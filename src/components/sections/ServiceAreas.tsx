"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import SectionHead from "../SectionHead";

/** "Zone de livrare" — links from the homepage to every district page (hub → spokes). */
export default function ServiceAreas({
  areas,
}: {
  areas: { name: string; href: string }[];
}) {
  const { t } = useI18n();
  if (!areas.length) return null;
  return (
    <section id="areas" className="section section--alt">
      <div className="section__inner reveal">
        <SectionHead title={t("areas.title")} />
        <p className="section__sub">{t("areas.subtitle")}</p>
        <div className="service-areas">
          {areas.map((a) => (
            <Link key={a.href} href={a.href} className="service-areas__link">
              {a.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
