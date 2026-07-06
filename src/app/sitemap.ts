import type { MetadataRoute } from "next";
import { SITE_URL, LOCALE_PATH, districtPath } from "@/lib/seo";
import { DISTRICTS } from "@/data/districts";

const LANGS = ["ro", "ru", "en"] as const;

/** Bump when page content meaningfully changes — emitted as <lastmod>. */
const LAST_MODIFIED = new Date("2026-07-06");

export default function sitemap(): MetadataRoute.Sitemap {
  const abs = (p: string) => new URL(p, SITE_URL).toString();

  const homepages: MetadataRoute.Sitemap = LANGS.map((lang) => ({
    url: abs(LOCALE_PATH[lang]),
    lastModified: LAST_MODIFIED,
    changeFrequency: "monthly",
    priority: lang === "ro" ? 1 : 0.8,
    alternates: {
      languages: { ro: abs("/"), ru: abs("/ru"), en: abs("/en"), "x-default": abs("/") },
    },
  }));

  const districts: MetadataRoute.Sitemap = DISTRICTS.flatMap((d) =>
    LANGS.map((lang) => ({
      url: abs(districtPath(lang, d.slug)),
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: {
        languages: {
          ro: abs(districtPath("ro", d.slug)),
          ru: abs(districtPath("ru", d.slug)),
          en: abs(districtPath("en", d.slug)),
          "x-default": abs(districtPath("ro", d.slug)),
        },
      },
    })),
  );

  return [...homepages, ...districts];
}
