"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Fuse, { type FuseResult } from "fuse.js";

interface SearchEntry {
  title: string;
  description: string;
  url: string;
  type: "page" | "blog" | "section";
  category?: string;
}

interface SearchBarProps {
  onOpenChange?: (open: boolean) => void;
}

const TYPE_COLORS: Record<SearchEntry["type"], string> = {
  page: "text-accent-blue",
  blog: "text-accent-purple",
  section: "text-accent-lime",
};

const TYPE_BG: Record<SearchEntry["type"], string> = {
  page: "bg-accent-blue/10",
  blog: "bg-accent-purple/10",
  section: "bg-accent-lime/10",
};

export function SearchBar({ onOpenChange }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FuseResult<SearchEntry>[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [index, setIndex] = useState<Fuse<SearchEntry> | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Notify parent of open state changes
  const updateOpen = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange],
  );

  // Load search index on first open
  const ensureIndex = useCallback(async () => {
    if (index) return index;
    setLoading(true);
    try {
      const res = await fetch("/search-index.json");
      const entries: SearchEntry[] = await res.json();
      const fuse = new Fuse(entries, {
        keys: [
          { name: "title", weight: 2 },
          { name: "description", weight: 1 },
          { name: "category", weight: 0.5 },
        ],
        threshold: 0.4,
        includeMatches: true,
      });
      setIndex(fuse);
      return fuse;
    } finally {
      setLoading(false);
    }
  }, [index]);

  // Toggle open
  const handleToggle = useCallback(async () => {
    if (open) {
      updateOpen(false);
      setQuery("");
      setResults([]);
      setSelectedIndex(-1);
      return;
    }
    updateOpen(true);
    await ensureIndex();
  }, [open, updateOpen, ensureIndex]);

  // Auto-focus the visible input when opening
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        // Check which input is visible based on viewport width
        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        if (isMobile) {
          mobileInputRef.current?.focus();
        } else {
          desktopInputRef.current?.focus();
        }
      });
    }
  }, [open]);

  // Click outside handler
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        updateOpen(false);
        setQuery("");
        setResults([]);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, updateOpen]);

  // Debounced search
  const handleInputChange = useCallback(
    (value: string) => {
      setQuery(value);
      setSelectedIndex(-1);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!value.trim()) {
        setResults([]);
        return;
      }
      debounceRef.current = setTimeout(() => {
        if (index) {
          setResults(index.search(value, { limit: 8 }));
        }
      }, 200);
    },
    [index],
  );

  // Navigate to a result
  const navigateTo = useCallback(
    (url: string) => {
      router.push(url);
      updateOpen(false);
      setQuery("");
      setResults([]);
      setSelectedIndex(-1);
    },
    [router, updateOpen],
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : 0,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : results.length - 1,
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          navigateTo(results[selectedIndex].item.url);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        updateOpen(false);
        setQuery("");
        setResults([]);
        setSelectedIndex(-1);
      }
    },
    [results, selectedIndex, navigateTo, updateOpen],
  );

  // Render highlighted text using Fuse match indices
  const renderHighlighted = (
    text: string,
    matchIndices?: readonly [number, number][],
  ) => {
    if (!matchIndices || matchIndices.length === 0) {
      return <span className="text-text-muted">{text}</span>;
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    for (const [start, end] of matchIndices) {
      if (start > lastIndex) {
        parts.push(
          <span key={`pre-${start}`} className="text-text-muted">
            {text.slice(lastIndex, start)}
          </span>,
        );
      }
      parts.push(
        <span
          key={`match-${start}`}
          className="text-text-primary font-semibold"
        >
          {text.slice(start, end + 1)}
        </span>,
      );
      lastIndex = end + 1;
    }

    if (lastIndex < text.length) {
      parts.push(
        <span key={`post-${lastIndex}`} className="text-text-muted">
          {text.slice(lastIndex)}
        </span>,
      );
    }

    return <>{parts}</>;
  };

  // Get match indices for a specific field
  const getMatchIndices = (
    result: FuseResult<SearchEntry>,
    key: string,
  ): readonly [number, number][] | undefined => {
    if (!result.matches) return undefined;
    const match = result.matches.find((m) => m.key === key);
    return match?.indices;
  };

  const showDropdown = open && (query.trim().length > 0 || loading);

  return (
    <div ref={containerRef} className="relative">
      {/* Desktop: inline search */}
      <div className="hidden md:flex items-center gap-2">
        {open && (
          <input
            ref={desktopInputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search..."
            className="w-60 bg-navy-light border border-white/10 focus:border-accent-blue/50 rounded-lg text-sm text-text-primary placeholder:text-text-muted/50 px-3 py-1.5 outline-none transition-colors"
          />
        )}
        <button
          type="button"
          onClick={handleToggle}
          aria-label={open ? "Close search" : "Open search"}
          className="text-text-muted hover:text-text-primary transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile: icon only (input expands below nav) */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={handleToggle}
          aria-label={open ? "Close search" : "Open search"}
          className="text-text-muted hover:text-text-primary transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile: full-width input below nav */}
      {open && (
        <div className="md:hidden fixed left-0 right-0 top-[57px] z-50 px-4 py-3 bg-navy/95 backdrop-blur-md border-b border-white/5">
          <input
            ref={mobileInputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search..."
            className="w-full bg-navy-light border border-white/10 focus:border-accent-blue/50 rounded-lg text-sm text-text-primary placeholder:text-text-muted/50 px-3 py-2 outline-none transition-colors"
          />
        </div>
      )}

      {/* Results dropdown */}
      {showDropdown && (
        <div
          className={[
            "absolute z-50 bg-navy/95 backdrop-blur-md glow-border rounded-xl mt-2 shadow-2xl max-h-[70vh] overflow-y-auto",
            // Desktop: positioned below the inline input
            "hidden md:block right-0 w-80",
          ].join(" ")}
        >
          {loading && (
            <div className="px-4 py-3 text-text-muted text-sm">
              Loading search index...
            </div>
          )}
          {!loading && results.length === 0 && query.trim().length > 0 && (
            <div className="px-4 py-3 text-text-muted text-sm">
              No results found
            </div>
          )}
          {!loading &&
            results.map((result, i) => (
              <button
                key={result.item.url}
                type="button"
                className={[
                  "w-full text-left px-4 py-3 cursor-pointer transition-colors",
                  i === selectedIndex
                    ? "bg-white/5"
                    : "hover:bg-white/5",
                ].join(" ")}
                onClick={() => navigateTo(result.item.url)}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={[
                      "text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full",
                      TYPE_COLORS[result.item.type],
                      TYPE_BG[result.item.type],
                    ].join(" ")}
                  >
                    {result.item.type}
                  </span>
                  {result.item.category && (
                    <span className="text-[10px] text-text-muted/60 truncate">
                      {result.item.category}
                    </span>
                  )}
                </div>
                <div className="text-sm leading-snug">
                  {renderHighlighted(
                    result.item.title,
                    getMatchIndices(result, "title"),
                  )}
                </div>
                {result.item.description && (
                  <div className="text-xs leading-snug mt-0.5 line-clamp-2">
                    {renderHighlighted(
                      result.item.description,
                      getMatchIndices(result, "description"),
                    )}
                  </div>
                )}
              </button>
            ))}
        </div>
      )}

      {/* Mobile results dropdown */}
      {showDropdown && (
        <div
          className={[
            "fixed left-4 right-4 z-50 bg-navy/95 backdrop-blur-md glow-border rounded-xl shadow-2xl max-h-[70vh] overflow-y-auto",
            "md:hidden",
            // Position below the mobile input bar (nav ~57px + input bar ~53px)
            "top-[110px]",
          ].join(" ")}
        >
          {loading && (
            <div className="px-4 py-3 text-text-muted text-sm">
              Loading search index...
            </div>
          )}
          {!loading && results.length === 0 && query.trim().length > 0 && (
            <div className="px-4 py-3 text-text-muted text-sm">
              No results found
            </div>
          )}
          {!loading &&
            results.map((result, i) => (
              <button
                key={result.item.url}
                type="button"
                className={[
                  "w-full text-left px-4 py-3 cursor-pointer transition-colors",
                  i === selectedIndex
                    ? "bg-white/5"
                    : "hover:bg-white/5",
                ].join(" ")}
                onClick={() => navigateTo(result.item.url)}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={[
                      "text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full",
                      TYPE_COLORS[result.item.type],
                      TYPE_BG[result.item.type],
                    ].join(" ")}
                  >
                    {result.item.type}
                  </span>
                  {result.item.category && (
                    <span className="text-[10px] text-text-muted/60 truncate">
                      {result.item.category}
                    </span>
                  )}
                </div>
                <div className="text-sm leading-snug">
                  {renderHighlighted(
                    result.item.title,
                    getMatchIndices(result, "title"),
                  )}
                </div>
                {result.item.description && (
                  <div className="text-xs leading-snug mt-0.5 line-clamp-2">
                    {renderHighlighted(
                      result.item.description,
                      getMatchIndices(result, "description"),
                    )}
                  </div>
                )}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
