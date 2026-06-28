"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

const ITEMS = [
  { t: "why.cert.t", d: "why.cert.d" },
  { t: "why.fleet.t", d: "why.fleet.d" },
  { t: "why.coverage.t", d: "why.coverage.d" },
  { t: "why.fast.t", d: "why.fast.d" },
];

export default function WhyUs() {
  const { t } = useI18n();
  const listRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Vertical progress bar fills as the list scrolls through the viewport.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh - r.top) / (vh + r.height);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="why" className="section why-parallax">
      <div className="section__inner">
        <div className="why-grid">
          <div className="why-left">
            <h2 className="why-left__title">{t("why.title")}</h2>
            <p className="why-left__sub">{t("why.subtitle")}</p>
          </div>

          <div className="why-list" ref={listRef}>
            <div className="why-track">
              <div className="why-fill" style={{ height: `${progress * 100}%` }} />
            </div>
            {ITEMS.map((it, i) => (
              <div key={i} className="why-item reveal">
                <span className="why-item__num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="why-item__title">{t(it.t)}</h3>
                <p className="why-item__desc">{t(it.d)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
