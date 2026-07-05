"use client";

import Link from "next/link";
import { useI18n, LANGS, type Lang } from "@/lib/i18n";
import { LOCALE_PATH } from "@/lib/seo";
import { CONTACT, telHref } from "@/lib/contact";
import BrandMark from "./BrandMark";
import Icon from "./Icon";

const NAV = [
  { id: "how", key: "nav.how" },
  { id: "why", key: "nav.why" },
  { id: "gallery", key: "nav.gallery" },
];

export default function Header({
  langHrefs,
}: {
  /** Per-locale hrefs for the language switch. Defaults to the homepages. */
  langHrefs?: Record<Lang, string>;
}) {
  const { t, lang } = useI18n();
  const home = LOCALE_PATH[lang];
  const langs = langHrefs ?? LOCALE_PATH;

  // Smooth-scroll when the section is on this page; otherwise the link
  // navigates to that section on the homepage.
  function go(e: React.MouseEvent, id: string) {
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <header className="site-header">
      <Link href={home} className="site-header__brand" style={{ textDecoration: "none", color: "inherit" }}>
        <BrandMark size={32} />
        <span style={{ fontWeight: 800, fontSize: 17 }}>{CONTACT.companyName}</span>
      </Link>

      <nav className="site-header__nav">
        {NAV.map((n) => (
          <a key={n.id} href={`${home}#${n.id}`} onClick={(e) => go(e, n.id)} className="navlink">
            {t(n.key)}
          </a>
        ))}
      </nav>

      <div className="site-header__actions">
        <div className="lang-switch">
          {LANGS.map((l) => (
            <Link
              key={l}
              href={langs[l]}
              hrefLang={l}
              className={`lang-switch__btn${l === lang ? " is-active" : ""}`}
            >
              {l.toUpperCase()}
            </Link>
          ))}
        </div>
        <a href={telHref} className="btn btn--brand">
          <Icon name="phone" size={16} /> {CONTACT.phone}
        </a>
      </div>
    </header>
  );
}
