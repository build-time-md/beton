"use client";

import { useI18n } from "@/lib/i18n";
import { CONTACT, telHref } from "@/lib/contact";
import Icon from "../Icon";

export default function Cta() {
  const { t } = useI18n();
  return (
    <section className="cta">
      <div className="cta__inner reveal">
        <div>
          <div className="cta__title">{t("cta.title")}</div>
          <div className="cta__text">{t("cta.text")}</div>
        </div>
        <div className="cta__actions">
          <a href={telHref} className="cta__btn cta__btn--solid">
            <Icon name="phone" size={18} /> {CONTACT.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
