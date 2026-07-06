import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/seo";

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
      <body>{children}</body>
    </html>
  );
}
