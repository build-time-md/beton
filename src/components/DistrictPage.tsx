"use client";

import { useEffect } from "react";
import Link from "next/link";
import { LanguageProvider, useI18n, type Lang } from "@/lib/i18n";
import type { DistrictContent } from "@/data/districts";
import type { LatLng, MapStation } from "@/lib/types";
import Header from "./Header";
import MapView from "./MapView";
import Materials from "./sections/Materials";
import Cta from "./sections/Cta";
import SiteFooter from "./sections/SiteFooter";

type NavLink = { name: string; href: string };

type Props = {
  lang: Lang;
  content: DistrictContent; // localized content only (other locales not shipped)
  center: LatLng; // centroid → map + calculator start here
  estimate: { km: number; price: number };
  stations: MapStation[];
  nearby: NavLink[];
  langHrefs: Record<Lang, string>;
};

export default function DistrictPage(props: Props) {
  return (
    <LanguageProvider lang={props.lang}>
      <DistrictBody {...props} />
    </LanguageProvider>
  );
}

function DistrictBody({ content, center, estimate, stations, nearby, langHrefs }: Props) {
  const { t } = useI18n();

  // Reveal-on-scroll (same behaviour as the homepage).
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

  // Keep the prose in sync with the live estimate.
  const fill = (s: string) =>
    s.replaceAll("{km}", String(estimate.km)).replaceAll("{price}", String(estimate.price));
  const paras = (body: string) => fill(body).split("\n\n");

  return (
    <>
      <Header langHrefs={langHrefs} />

      <section className="dhero">
        <div className="dhero__inner reveal">
          <h1 className="dhero__title">{content.h1}</h1>
          <p className="dhero__intro">{fill(content.intro)}</p>
          <div className="dhero__meta">
            <span className="dhero__chip">
              {t("district.deliveryFrom")} {estimate.price} lei · ~{estimate.km} km
            </span>
            <a href="#calculator" className="btn btn--brand dhero__cta">
              {t("district.calcCta")} ↓
            </a>
          </div>
        </div>
      </section>

      <MapView stations={stations} initialClient={center} />

      <section className="dsection">
        <div className="dsection__inner reveal">
          <h2 className="dsection__title">{content.sectionA.title}</h2>
          {paras(content.sectionA.body).map((p, i) => (
            <p key={i} className="dsection__p">
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="dsection dsection--alt">
        <div className="dsection__inner reveal">
          <h2 className="dsection__title">{content.sectionB.title}</h2>
          {paras(content.sectionB.body).map((p, i) => (
            <p key={i} className="dsection__p">
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="dfaq">
        <div className="dfaq__inner reveal">
          <h2 className="dsection__title">{t("district.faqHeading")}</h2>
          <div className="dfaq__list">
            {content.faq.map((f, i) => (
              <div key={i} className="dfaq__item">
                <h3 className="dfaq__q">{f.q}</h3>
                <p className="dfaq__a">{fill(f.a)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Materials />

      {nearby.length ? (
        <section className="dsection dsection--alt">
          <div className="dsection__inner reveal">
            <h2 className="dsection__title">{t("district.nearbyHeading")}</h2>
            <div className="d-nearby">
              {nearby.map((n) => (
                <Link key={n.href} href={n.href} className="d-nearby__link">
                  {t("district.deliveryIn")} {n.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <Cta />
      <SiteFooter />
    </>
  );
}
