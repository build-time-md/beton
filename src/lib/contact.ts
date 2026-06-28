/**
 * Contact / company details used by the header, footer and CTAs.
 * TODO: replace placeholders with the real company data.
 */
export const CONTACT = {
  companyName: "Beton",
  legalName: 'SRL "Beton" (de completat)',
  /** Display + tel: href. Keep digits only in `phoneDigits`. */
  phone: "+373 692 44 506",
  phoneDigits: "37369244506",
  /** WhatsApp / Viber number, digits only, no +. */
  whatsapp: "37369244506",
  viber: "37369244506",
  email: "contact@beton.md",
} as const;

export const telHref = `tel:+${CONTACT.phoneDigits}`;
export function whatsappHref(text?: string) {
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${CONTACT.whatsapp}${q}`;
}
export const viberHref = `viber://chat?number=%2B${CONTACT.viber}`;
