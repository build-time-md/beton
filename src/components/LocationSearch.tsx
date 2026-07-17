"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { LatLng } from "@/lib/types";
import type { GeocodeResult } from "@/lib/geocode";
import { useI18n } from "@/lib/i18n";

const DEBOUNCE_MS = 350;
const MIN_CHARS = 3;

/**
 * Search box floating over the map: type a locality (or address), pick a
 * suggestion, and the parent recalculates the route to it. Nominatim is proxied
 * through /api/geocode; keystrokes are debounced to stay within its usage policy.
 */
export default function LocationSearch({
  onSelect,
  clearToken = 0,
}: {
  onSelect: (point: LatLng, label: string) => void;
  /** Incremented by the parent to clear the box (location set elsewhere). */
  clearToken?: number;
}) {
  const { t, lang } = useI18n();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);
  // Set when a suggestion is chosen: choosing writes its name into the input,
  // which would otherwise re-trigger the search below and reopen the dropdown.
  const skipSearch = useRef(false);
  const listId = useId();

  // Debounced geocoding. Aborts an in-flight request when the query changes.
  useEffect(() => {
    if (skipSearch.current) {
      skipSearch.current = false;
      return;
    }
    const query = q.trim();
    if (query.length < MIN_CHARS) {
      setResults([]);
      setSearched(false);
      setFailed(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/geocode?q=${encodeURIComponent(query)}&lang=${lang}`,
          { signal: ctrl.signal },
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          // Service error (e.g. rate limit) — not the same as "doesn't exist".
          setResults([]);
          setFailed(true);
        } else {
          setResults(Array.isArray(data.results) ? data.results : []);
          setFailed(false);
        }
        setSearched(true);
        setActive(-1);
        setOpen(true);
      } catch (err) {
        if ((err as { name?: string })?.name !== "AbortError") {
          setResults([]);
          setFailed(true);
          setSearched(true);
          setOpen(true);
        }
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [q, lang]);

  // Close the dropdown when clicking outside the widget.
  useEffect(() => {
    function onDocDown(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, []);

  // Parent set the location elsewhere (map click / geolocation) — drop the now
  // stale search text. `clearToken` starts at 0, so this is a no-op on mount.
  useEffect(() => {
    if (clearToken === 0) return;
    skipSearch.current = true;
    setQ("");
    setResults([]);
    setSearched(false);
    setFailed(false);
    setLoading(false);
    setOpen(false);
  }, [clearToken]);

  function choose(r: GeocodeResult) {
    skipSearch.current = true;
    onSelect({ lat: r.lat, lng: r.lng }, r.name);
    setQ(r.name);
    setResults([]);
    setActive(-1);
    setSearched(false);
    setFailed(false);
    setLoading(false);
    setOpen(false);
  }

  function clear() {
    setQ("");
    setResults([]);
    setSearched(false);
    setFailed(false);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open && results.length) {
        setOpen(true);
        return;
      }
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (active >= 0 && results[active]) {
        e.preventDefault();
        choose(results[active]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const showResults = open && (loading || searched || failed);

  return (
    <div className="map-search" ref={boxRef}>
      <div className="map-search__field">
        <svg
          className="map-search__icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          className="map-search__input"
          type="text"
          value={q}
          placeholder={t("search.placeholder")}
          aria-label={t("search.placeholder")}
          role="combobox"
          aria-expanded={showResults}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          onChange={(e) => {
            // A real keystroke always re-enables search, even if a prior
            // selection left the skip flag set (when chosen name == typed text).
            skipSearch.current = false;
            setQ(e.target.value);
          }}
          onFocus={() => {
            if (results.length || searched || failed) setOpen(true);
          }}
          onKeyDown={onKeyDown}
        />
        {q ? (
          <button
            type="button"
            className="map-search__clear"
            aria-label={t("search.clear")}
            onClick={clear}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6 18 18M18 6 6 18" />
            </svg>
          </button>
        ) : null}
      </div>

      {showResults ? (
        <ul className="map-search__results" id={listId} role="listbox">
          {loading ? (
            <li className="map-search__msg">{t("search.searching")}</li>
          ) : failed ? (
            <li className="map-search__msg">{t("search.error")}</li>
          ) : results.length === 0 ? (
            <li className="map-search__msg">{t("search.noResults")}</li>
          ) : (
            results.map((r, i) => (
              <li
                key={`${r.lat},${r.lng},${i}`}
                role="option"
                aria-selected={i === active}
                className={`map-search__opt${i === active ? " is-active" : ""}`}
                onMouseEnter={() => setActive(i)}
                // mousedown (not click) so selecting fires before input blur.
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(r);
                }}
              >
                <span className="map-search__opt-name">{r.name}</span>
                <span className="map-search__opt-sub">{r.displayName}</span>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
