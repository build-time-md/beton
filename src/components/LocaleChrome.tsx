import type { Lang } from "@/lib/i18n";
import { localBusinessSchema } from "@/lib/seo";

/**
 * Per-locale chrome rendered at the top of <body> by each locale's layout:
 * corrects <html lang> for non-ro locales (the root layout is fully static and
 * defaults to "ro") and injects the localized LocalBusiness JSON-LD.
 */
export default function LocaleChrome({ lang }: { lang: Lang }) {
  return (
    <>
      {lang !== "ro" ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.lang=${JSON.stringify(lang)}`,
          }}
        />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema(lang)) }}
      />
    </>
  );
}
