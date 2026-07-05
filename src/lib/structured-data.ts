import type { Lang } from "./i18n";
import type { District } from "@/data/districts";
import { SITE_URL, districtPath } from "./seo";
import { CONTACT } from "./contact";

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
    serviceType: "Livrare beton",
    name: c.h1,
    description: c.description,
    url: `${SITE_URL}${districtPath(lang, d.slug)}`,
    provider: {
      "@type": "LocalBusiness",
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

/** JSON-LD `FAQPage` from a district's Q&A list. */
export function faqSchema(faq: { q: string; a: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
