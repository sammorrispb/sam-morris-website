"use client";

import { useEffect, useRef, useState } from "react";

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

/** Minimal typings for the Maps JavaScript API "places" library (New). */
interface PlacePrediction {
  placeId: string;
  text: { text: string };
}
interface AutocompleteSuggestion {
  placePrediction: PlacePrediction | null;
}
interface PlacesLibrary {
  AutocompleteSuggestion: {
    fetchAutocompleteSuggestions(request: {
      input: string;
      sessionToken: object;
    }): Promise<{ suggestions: AutocompleteSuggestion[] }>;
  };
  AutocompleteSessionToken: new () => object;
  Place: new (options: {
    id: string;
  }) => {
    fetchFields(options: { fields: string[] }): Promise<void>;
    displayName?: string;
    formattedAddress?: string;
  };
}

declare global {
  interface Window {
    google?: {
      maps?: {
        importLibrary: (name: "places") => Promise<PlacesLibrary>;
      };
    };
  }
}

let placesLibraryPromise: Promise<PlacesLibrary> | null = null;

function loadPlacesLibrary(): Promise<PlacesLibrary> {
  if (placesLibraryPromise) return placesLibraryPromise;
  placesLibraryPromise = new Promise((resolve, reject) => {
    const importLibrary = window.google?.maps?.importLibrary;
    if (importLibrary) {
      importLibrary("places").then(resolve, reject);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      MAPS_API_KEY
    )}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const ready = window.google?.maps?.importLibrary;
      if (ready) ready("places").then(resolve, reject);
      else reject(new Error("Google Maps Places library failed to initialize"));
    };
    script.onerror = () =>
      reject(new Error("Google Maps script failed to load"));
    document.head.appendChild(script);
  });
  return placesLibraryPromise;
}

interface Suggestion {
  placeId: string;
  label: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

const DEBOUNCE_MS = 250;
const MIN_QUERY_LENGTH = 3;

/**
 * Location input with Google Places autocomplete (Places API "New") when
 * NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is configured; falls back to a plain
 * text input otherwise. Selecting a suggestion fills in the full
 * formatted address, which is what lands on the invoice + calendar invite.
 */
export function PlaceAutocompleteInput({
  value,
  onChange,
  required,
  placeholder,
  className,
}: Props) {
  const [libReady, setLibReady] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  // Diagnostic: last places-library error, exposed as data-places-error on
  // the wrapper for automated checks. Not rendered visibly.
  const [placesError, setPlacesError] = useState<string | null>(null);
  const placesRef = useRef<{ lib: PlacesLibrary; token: object } | null>(null);
  const requestRef = useRef(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!MAPS_API_KEY) return;
    let cancelled = false;
    loadPlacesLibrary()
      .then((lib) => {
        if (cancelled) return;
        try {
          placesRef.current = {
            lib,
            token: new lib.AutocompleteSessionToken(),
          };
        } catch (err) {
          const msg = `token: ${err instanceof Error ? err.message : String(err)}`;
          console.error("[place-autocomplete]", msg);
          setPlacesError(msg);
          return;
        }
        setLibReady(true);
      })
      .catch((err) => {
        const msg = `load: ${err instanceof Error ? err.message : String(err)}`;
        console.error("[place-autocomplete]", msg);
        // Autocomplete unavailable — the plain input keeps working.
        setPlacesError(msg);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch suggestions (debounced) while the user types.
  useEffect(() => {
    if (!libReady || !open) return;
    const query = value.trim();
    if (query.length < MIN_QUERY_LENGTH) return;
    const requestId = ++requestRef.current;
    const timer = setTimeout(() => {
      const ctx = placesRef.current;
      if (!ctx) return;
      ctx.lib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input: query,
        sessionToken: ctx.token,
      })
        .then(({ suggestions: raw }) => {
          if (requestRef.current !== requestId) return;
          const seen = new Set<string>();
          const mapped: Suggestion[] = [];
          for (const s of raw) {
            const p = s.placePrediction;
            if (!p || seen.has(p.placeId)) continue;
            seen.add(p.placeId);
            mapped.push({ placeId: p.placeId, label: p.text.text });
          }
          setSuggestions(mapped);
          setActiveIndex(mapped.length > 0 ? 0 : -1);
        })
        .catch((err) => {
          if (requestRef.current !== requestId) return;
          const msg = `suggest: ${err instanceof Error ? err.message : String(err)}`;
          console.error("[place-autocomplete]", msg);
          setPlacesError(msg);
          setSuggestions([]);
          setActiveIndex(-1);
        });
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [value, open, libReady]);

  // Close the dropdown on outside click.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  async function selectSuggestion(s: Suggestion) {
    setOpen(false);
    setSuggestions([]);
    setActiveIndex(-1);
    const ctx = placesRef.current;
    if (!ctx) {
      onChange(s.label);
      return;
    }
    try {
      const place = new ctx.lib.Place({ id: s.placeId });
      await place.fetchFields({ fields: ["displayName", "formattedAddress"] });
      onChange(place.formattedAddress || place.displayName || s.label);
      // Start a fresh billing session for the next autocomplete interaction.
      ctx.token = new ctx.lib.AutocompleteSessionToken();
    } catch {
      // Keep the suggestion label; manual entry still works.
      onChange(s.label);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) {
      if (e.key === "Escape") setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      const s = suggestions[activeIndex];
      if (s) void selectSuggestion(s);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const listboxId = "place-autocomplete-listbox";
  const showDropdown = open && suggestions.length > 0;

  return (
    <div
      ref={wrapperRef}
      className="relative"
      data-places-error={placesError ?? undefined}
    >
      <input
        type="text"
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (e.target.value.trim().length < MIN_QUERY_LENGTH) {
            setSuggestions([]);
            setActiveIndex(-1);
          }
          setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0) setOpen(true);
        }}
        className={className}
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls={listboxId}
        aria-activedescendant={
          activeIndex >= 0 ? `place-option-${activeIndex}` : undefined
        }
        autoComplete="off"
      />
      {showDropdown && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-white/10 bg-navy shadow-lg"
        >
          {suggestions.map((s, i) => (
            <button
              key={s.placeId}
              type="button"
              role="option"
              id={`place-option-${i}`}
              aria-selected={i === activeIndex}
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => void selectSuggestion(s)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`block w-full px-4 py-2.5 text-left text-sm ${
                i === activeIndex
                  ? "bg-white/10 text-text-primary"
                  : "text-text-primary/80"
              }`}
            >
              {s.label}
            </button>
          ))}
          <div className="border-t border-white/10 px-4 py-1.5 text-right text-[11px] text-text-muted">
            Powered by Google
          </div>
        </div>
      )}
    </div>
  );
}
