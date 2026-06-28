"use client";

import { useI18n } from "@/lib/i18n";
import { CONTACT, telHref } from "@/lib/contact";
import BrandMark from "@/components/BrandMark";
import Icon from "@/components/Icon";

export default function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer id="contact" className="site-footer">
      <div className="site-footer__inner">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <BrandMark size={32} />
            <strong style={{ fontSize: 17 }}>{CONTACT.companyName}</strong>
          </div>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>{t("tagline")}</div>
        </div>

        <div>
          <div className="site-footer__label">{t("footer.contact")}</div>
          <a
            href={telHref}
            className="site-footer__link"
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <Icon name="phone" size={15} /> {CONTACT.phone}
          </a>
        </div>

        <div>
          <div className="site-footer__label">{t("footer.hours")}</div>
          <div className="site-footer__text">{t("footer.hoursValue")}</div>
          <div className="site-footer__label" style={{ marginTop: 12 }}>
            {t("footer.area")}
          </div>
          <div className="site-footer__text">{t("footer.areaValue")}</div>
        </div>
      </div>
      <div className="site-footer__bottom">
        © {CONTACT.companyName} · {t("footer.rights")}
      </div>
    </footer>
  );
}
