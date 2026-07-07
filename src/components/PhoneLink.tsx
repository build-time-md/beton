"use client";

import type { ComponentPropsWithoutRef, MouseEvent } from "react";
import { telHref } from "@/lib/contact";
import { reportPhoneConversion } from "@/lib/gtag";

type PhoneLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  /** Defaults to the company tel: href. */
  href?: string;
};

/**
 * Phone link that fires a Google Ads "Clic pentru apelare" conversion on click.
 * Renders a plain <a href="tel:…"> so calling still works before gtag loads.
 */
export default function PhoneLink({ href = telHref, onClick, children, ...rest }: PhoneLinkProps) {
  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    reportPhoneConversion();
    onClick?.(e);
  }
  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
