import type { Lang } from "./i18n";
import { getDistrict } from "@/data/districts";
import { districtEstimate } from "./estimate";
import { districtPath } from "./seo";

/**
 * Server-side assembly of everything a district page needs. Returns null for an
 * unknown slug (the route then calls notFound()). Only the current locale's
 * content is exposed to the client; the full District (with all locales) stays
 * server-side for the JSON-LD.
 */
export function districtPageProps(lang: Lang, slug: string) {
  const d = getDistrict(slug);
  if (!d) return null;

  const estimate = districtEstimate({ lat: d.lat, lng: d.lng });

  const nearby = d.nearby
    .map((s) => getDistrict(s))
    .filter((x): x is NonNullable<typeof x> => Boolean(x))
    .map((n) => ({ name: n.name[lang], href: districtPath(lang, n.slug) }));

  const langHrefs: Record<Lang, string> = {
    ro: districtPath("ro", d.slug),
    ru: districtPath("ru", d.slug),
    en: districtPath("en", d.slug),
  };

  return {
    district: d,
    content: d.content[lang],
    center: { lat: d.lat, lng: d.lng },
    estimate,
    nearby,
    langHrefs,
  };
}
