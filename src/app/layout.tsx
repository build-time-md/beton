import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { SITE_URL, localBusinessSchema } from "@/lib/seo";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Locale is set per request by middleware (x-locale header).
  const locale = (await headers()).get("x-locale") ?? "ro";
  return (
    <html lang={locale}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }}
        />
      </body>
    </html>
  );
}
