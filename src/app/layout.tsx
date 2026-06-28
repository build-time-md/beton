import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = "https://beton.build-time.net";
const TITLE = "Beton — livrare beton Chișinău";
const DESCRIPTION =
  "Află instant costul livrării de beton la locația ta. Livrăm din cea mai apropiată stație, la cel mai mic preț — Chișinău și suburbiile.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Beton",
    title: TITLE,
    description: DESCRIPTION,
    locale: "ro_RO",
    images: [{ url: "/gallery/images/truck-1.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/gallery/images/truck-1.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

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
