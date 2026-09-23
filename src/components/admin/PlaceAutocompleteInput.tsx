"use client";

import { useEffect, useRef } from "react";

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Autocomplete: new (input: HTMLInputElement, opts?: any) => any;
        };
        event?: { clearInstanceListeners: (instance: unknown) => void };
      };
    };
  }
}

let mapsLoadPromise: Promise<void> | null = null;

function loadMapsScript(): Promise<void> {
  if (mapsLoadPromise) return mapsLoadPromise;
  mapsLoadPromise = new Promise((resolve, reject) => {
    if (window.google?.maps?.places) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      MAPS_API_KEY
    )}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Google Maps script failed to load"));
    document.head.appendChild(script);
  });
  return mapsLoadPromise;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

/**
 * Location input with Google Places autocomplete when
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!MAPS_API_KEY || !inputRef.current) return;
    let autocomplete: { getPlace: () => unknown } | null = null;
    let cancelled = false;

    loadMapsScript()
      .then(() => {
        if (cancelled || !inputRef.current || !window.google?.maps?.places)
          return;
        const ac = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            fields: ["formatted_address", "name"],
          }
        );
        autocomplete = ac;
        ac.addListener("place_changed", () => {
          const place = ac.getPlace() as {
            formatted_address?: string;
            name?: string;
          };
          const address =
            place?.formatted_address || place?.name || inputRef.current?.value;
          if (address) onChange(address);
        });
      })
      .catch(() => {
        // Autocomplete unavailable — the plain input keeps working.
      });

    return () => {
      cancelled = true;
      if (autocomplete && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
    // Only wire up once per mount; value changes flow through props.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
    />
  );
}
