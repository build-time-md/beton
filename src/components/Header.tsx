"use client";

import { useI18n, LANGS, type Lang } from "@/lib/i18n";
import { CONTACT, telHref } from "@/lib/contact";
import BrandMark from "./BrandMark";
import Icon from "./Icon";

const NAV = [
  { id: "prices", key: "nav.prices" },
  { id: "how", key: "nav.how" },
  { id: "why", key: "nav.why" },
  { id: "gallery", key: "nav.gallery" },
];

export default function Header() {
  const { t, lang, setLang } = useI18n();

  function go(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header className="site-header">
      <div className="site-header__brand">
        <BrandMark size={32} />
        <span style={{ fontWeight: 800, fontSize: 17 }}>{CONTACT.companyName}</span>
      </div>

      <nav className="site-header__nav">
        {NAV.map((n) => (
          <button key={n.id} onClick={() => go(n.id)} className="navlink">
            {t(n.key)}
          </button>
        ))}
      </nav>

      <div className="site-header__actions">
        <div className="lang-switch">
          {LANGS.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l as Lang)}
              className={`lang-switch__btn${l === lang ? " is-active" : ""}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <a href={telHref} className="btn btn--brand">
          <Icon name="phone" size={16} /> {CONTACT.phone}
        </a>
      </div>
    </header>
  );
}
