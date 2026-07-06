import type { Metadata } from "next";
import type { Lang } from "./i18n";
import type { District } from "@/data/districts";
import { CONTACT } from "./contact";

/** Public site origin. Override per deploy with NEXT_PUBLIC_SITE_URL. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://beton.build-time.net";

/** URL path for each locale — Romanian is the default and lives at the root. */
export const LOCALE_PATH: Record<Lang, string> = {
  ro: "/",
  ru: "/ru",
  en: "/en",
};

/** hreflang alternates — same for every page. */
const LANGUAGE_ALTERNATES = {
  ro: "/",
  ru: "/ru",
  en: "/en",
};

/** Keyword prefix folder per locale for district landing pages. */
const DISTRICT_PREFIX: Record<Lang, string> = {
  ro: "livrare-beton",
  ru: "dostavka-betona",
  en: "concrete-delivery",
};

/** URL path of a district page: `/livrare-beton/{slug}`, `/ru/dostavka-betona/{slug}`, … */
export function districtPath(lang: Lang, slug: string): string {
  const localePrefix = lang === "ro" ? "" : `/${lang}`;
  return `${localePrefix}/${DISTRICT_PREFIX[lang]}/${slug}`;
}

const SEO: Record<Lang, { title: string; description: string; ogLocale: string }> = {
  ro: {
    title: "Livrare beton Chișinău — preț instant pe hartă | DARSAN",
    description:
      "Află instant costul livrării de beton la locația ta. Livrăm din cea mai apropiată stație, la cel mai mic preț — Chișinău și suburbiile.",
    ogLocale: "ro_RO",
  },
  ru: {
    title: "Доставка бетона Кишинёв — цена онлайн на карте | DARSAN",
    description:
      "Мгновенный расчёт стоимости доставки бетона на ваш адрес. Доставляем с ближайшего завода, по минимальной цене — Кишинёв и пригороды.",
    ogLocale: "ru_RU",
  },
  en: {
    title: "Concrete delivery Chișinău — instant map price | DARSAN",
    description:
      "Instantly get the concrete delivery cost to your location. We deliver from the nearest plant at the lowest price — Chișinău and suburbs.",
    ogLocale: "en_US",
  },
};

/** Localized LocalBusiness description, matching the page's language. */
const BUSINESS_DESCRIPTION: Record<Lang, string> = {
  ro: "Livrare beton, nisip și pietriș în Chișinău și suburbii. Alegem automat cea mai apropiată stație, la cel mai mic preț pe transport.",
  ru: "Доставка бетона, песка и щебня в Кишинёве и пригородах. Автоматически выбираем ближайший завод — минимальная цена за транспорт.",
  en: "Concrete, sand and gravel delivery in Chișinău and suburbs. We automatically pick the nearest plant for the lowest transport price.",
};

/**
 * LocalBusiness structured data (JSON-LD) for Google rich results / local pack.
 * Address and geo are included only once filled in CONTACT.
 */
export function localBusinessSchema(lang: Lang): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE_URL}/#business`,
    name: CONTACT.companyName,
    url: SITE_URL,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    image: [
      `${SITE_URL}/gallery/images/truck-1.jpg`,
      `${SITE_URL}/gallery/images/truck-2.jpg`,
    ],
    description: BUSINESS_DESCRIPTION[lang],
    priceRange: "$$",
    areaServed: CONTACT.areaServed.map((name) => ({ "@type": "City", name })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
  };

  if (CONTACT.address.street) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: CONTACT.address.street,
      addressLocality: CONTACT.address.locality,
      addressRegion: CONTACT.address.region,
      postalCode: CONTACT.address.postalCode || undefined,
      addressCountry: CONTACT.address.country,
    };
  }
  if (CONTACT.geo.lat && CONTACT.geo.lng) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: CONTACT.geo.lat,
      longitude: CONTACT.geo.lng,
    };
  }
  return schema;
}

/** og:locale:alternate — the other two locales' OG codes. */
const otherOgLocales = (lang: Lang) =>
  (["ro", "ru", "en"] as Lang[]).filter((l) => l !== lang).map((l) => SEO[l].ogLocale);

/** Localized <head> metadata for a locale, incl. canonical + hreflang. */
export function metadataFor(lang: Lang): Metadata {
  const s = SEO[lang];
  return {
    title: s.title,
    description: s.description,
    alternates: {
      canonical: LOCALE_PATH[lang],
      languages: LANGUAGE_ALTERNATES,
    },
    openGraph: {
      type: "website",
      url: LOCALE_PATH[lang],
      siteName: "DARSAN",
      title: s.title,
      description: s.description,
      locale: s.ogLocale,
      alternateLocale: otherOgLocales(lang),
      images: [{ url: "/gallery/images/truck-1.jpg", width: 1600, height: 1200 }],
    },
    twitter: {
      card: "summary_large_image",
      title: s.title,
      description: s.description,
      images: ["/gallery/images/truck-1.jpg"],
    },
  };
}

/** Per-district, per-locale metadata: unique title/description, self-canonical + hreflang. */
export function metadataForDistrict(lang: Lang, d: District): Metadata {
  const c = d.content[lang];
  const self = districtPath(lang, d.slug);
  const languages = {
    ro: districtPath("ro", d.slug),
    ru: districtPath("ru", d.slug),
    en: districtPath("en", d.slug),
  };
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: self, languages },
    openGraph: {
      type: "website",
      url: self,
      siteName: "DARSAN",
      title: c.title,
      description: c.description,
      locale: SEO[lang].ogLocale,
      alternateLocale: otherOgLocales(lang),
      images: [{ url: "/gallery/images/truck-1.jpg", width: 1600, height: 1200 }],
    },
    twitter: {
      card: "summary_large_image",
      title: c.title,
      description: c.description,
      images: ["/gallery/images/truck-1.jpg"],
    },
  };
}
