import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { SITE_URL } from "@/lib/seo";

/** Google Ads (gtag.js) — conversion tracking tag. */
const GOOGLE_TAG_ID = "AW-18304758281";

// metadataBase makes canonical/hreflang/OG URLs absolute. Per-page (ro/ru/en)
// title, description, canonical and language alternates come from metadataFor().
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "DARSAN — livrare beton Chișinău",
  description:
    "Află instant costul livrării de beton la locația ta. Livrăm din cea mai apropiată stație, la cel mai mic preț — Chișinău și suburbiile.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3FA535",
};

// Static lang default (keeps every route fully static / SSG). The ru/en locale
// layouts correct document.documentElement.lang via LocaleChrome before paint.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body>
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_TAG_ID}');`}
        </Script>
      </body>
    </html>
  );
}
