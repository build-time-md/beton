/** Google Ads (gtag.js) conversion helpers. */

// Google Ads conversion "Clic pentru apelare" — fires when a user taps any
// phone number on the site. Label from Google Ads.
const PHONE_CONVERSION = "AW-18304758281/HMx6CLfMtMwcEInksZhE";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Report a Google Ads "phone click" conversion. Safe no-op if gtag hasn't
 * loaded yet. tel: links don't unload the page (they hand off to the dialer),
 * so we fire the event and let the default action proceed — no need to defer
 * navigation via event_callback.
 */
export function reportPhoneConversion() {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", { send_to: PHONE_CONVERSION });
}
