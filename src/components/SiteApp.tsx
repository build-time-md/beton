"use client";

import { useEffect } from "react";
import { LanguageProvider, type Lang } from "@/lib/i18n";
import type { MapStation } from "@/lib/types";
import Header from "./Header";
import MapView from "./MapView";
import Intro from "./sections/Intro";
import Materials from "./sections/Materials";
import HowItWorks from "./sections/HowItWorks";
import WhyUs from "./sections/WhyUs";
import Cta from "./sections/Cta";
import Gallery from "./sections/Gallery";
import ServiceAreas from "./sections/ServiceAreas";
import SiteFooter from "./sections/SiteFooter";

export default function SiteApp({
  lang,
  stations,
  areas = [],
}: {
  lang: Lang;
  stations: MapStation[];
  /** District links for the "Zone de livrare" block. */
  areas?: { name: string; href: string }[];
}) {
  // Reveal-on-scroll: fade up elements with `.reveal` as they enter view.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("is-visible"));
      return;
    }
    const o = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            o.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((e) => o.observe(e));
    return () => o.disconnect();
  }, []);

  return (
    <LanguageProvider lang={lang}>
      <Header />
      <MapView stations={stations} />
      <Intro />
      <Materials />
      <WhyUs />
      <ServiceAreas areas={areas} />
      <Gallery />
      <Cta />
      <HowItWorks />
      <SiteFooter />
    </LanguageProvider>
  );
}
