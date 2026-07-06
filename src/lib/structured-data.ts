import type { Lang } from "./i18n";
import type { District } from "@/data/districts";
import { SITE_URL, districtPath } from "./seo";
import { CONTACT } from "./contact";
import { fillTokens } from "./fill-tokens";

const SERVICE_TYPE: Record<Lang, string> = {
  ro: "Livrare beton",
  ru: "Доставка бетона",
  en: "Concrete delivery",
};

/** JSON-LD `Service` for a district page — ties the delivery service to a place. */
export function districtServiceSchema(
  lang: Lang,
  d: District,
  km: number,
): Record<string, unknown> {
  const c = d.content[lang];
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: SERVICE_TYPE[lang],
    name: c.h1,
    description: c.description,
    url: `${SITE_URL}${districtPath(lang, d.slug)}`,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      "@id": `${SITE_URL}/#business`,
      name: CONTACT.companyName,
      telephone: CONTACT.phone,
    },
    areaServed: {
      "@type": "Place",
      name: d.name[lang],
      geo: { "@type": "GeoCoordinates", latitude: d.lat, longitude: d.lng },
    },
    ...(km ? { additionalProperty: { "@type": "PropertyValue", name: "distanceKm", value: km } } : {}),
  };
}

/** JSON-LD `FAQPage` from a district's Q&A list, with `{km}`/`{price}` resolved. */
export function faqSchema(
  faq: { q: string; a: string }[],
  estimate: { km: number; price: number },
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: fillTokens(f.q, estimate),
      acceptedAnswer: { "@type": "Answer", text: fillTokens(f.a, estimate) },
    })),
  };
}
