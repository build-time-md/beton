/**
 * Contact / company details used by the header, footer and CTAs.
 * TODO: replace placeholders with the real company data.
 */
export const CONTACT = {
  companyName: "DARSAN",
  legalName: 'SRL "DARSAN" (de completat)',
  /** Display + tel: href. Keep digits only in `phoneDigits`. */
  phone: "+373 692 44 506",
  phoneDigits: "37369244506",
  /** WhatsApp / Viber number, digits only, no +. */
  whatsapp: "37369244506",
  viber: "37369244506",
  email: "contact@beton.md",

  /** Physical base address — completează pentru SEO local (apare în Google). */
  address: {
    street: "", // ex: "str. Constructorilor 7" — lăsat gol = omis din schema
    locality: "Chișinău",
    region: "Chișinău",
    postalCode: "",
    country: "MD",
  },
  /** Coordonatele bazei — completează pentru rich results locale (0 = omis). */
  geo: { lat: 0, lng: 0 },
  /** Localități deservite (areaServed în structured data). */
  areaServed: ["Chișinău", "Ialoveni", "Strășeni", "Anenii Noi"],
} as const;

export const telHref = `tel:+${CONTACT.phoneDigits}`;
export function whatsappHref(text?: string) {
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${CONTACT.whatsapp}${q}`;
}
export const viberHref = `viber://chat?number=%2B${CONTACT.viber}`;
