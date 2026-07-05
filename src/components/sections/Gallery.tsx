"use client";

import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import SectionHead from "../SectionHead";

// Drop real photos in /public/gallery/images and list them here.
const PHOTOS = ["/gallery/images/truck-1.jpg", "/gallery/images/truck-2.jpg"];

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points={dir === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );
}

export default function Gallery() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const move = useCallback(
    (dir: number) =>
      setOpen((i) => (i === null ? i : (i + dir + PHOTOS.length) % PHOTOS.length)),
    [],
  );

  useEffect(() => {
    if (open === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") move(1);
      else if (e.key === "ArrowLeft") move(-1);
    }
    window.addEventListener("keydown", onKey);
    // Prevent body scroll while the lightbox is open.
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, move]);

  return (
    <section id="gallery" className="section">
      <div className="section__inner reveal">
        <SectionHead title={t("gallery.title")} />
        <div className="gallery">
          {PHOTOS.map((src, i) => (
            <button key={i} className="gallery__item" onClick={() => setOpen(i)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={t("gallery.alt")} className="gallery__img" loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      {open !== null ? (
        <div className="lightbox" onClick={close} role="dialog" aria-modal="true">
          <button className="lightbox__close" onClick={close} aria-label="×">
            ✕
          </button>
          {PHOTOS.length > 1 ? (
            <button
              className="lightbox__nav lightbox__nav--prev"
              onClick={(e) => {
                e.stopPropagation();
                move(-1);
              }}
              aria-label="prev"
            >
              <Chevron dir="left" />
            </button>
          ) : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PHOTOS[open]}
            alt=""
            className="lightbox__img"
            onClick={(e) => e.stopPropagation()}
          />
          {PHOTOS.length > 1 ? (
            <button
              className="lightbox__nav lightbox__nav--next"
              onClick={(e) => {
                e.stopPropagation();
                move(1);
              }}
              aria-label="next"
            >
              <Chevron dir="right" />
            </button>
          ) : null}
          <div className="lightbox__count">
            {open + 1} / {PHOTOS.length}
          </div>
        </div>
      ) : null}
    </section>
  );
}
