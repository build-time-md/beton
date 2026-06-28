import { BRAND } from "@/lib/brand";

/**
 * Brand logo mark: a stylized concrete-mixer drum on a green rounded badge.
 * Pure SVG, themeable via the brand palette — reuse anywhere on the site.
 */
export default function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${BRAND.name} logo`}
    >
      <rect width="48" height="48" rx="11" fill={BRAND.green} />
      {/* mixer drum — tilted barrel with diagonal mixing fins */}
      <g stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
        <path
          d="M13 30 L17 16 C17 14.5 19 13.5 22.5 13.5 L34 13.5 L30 27.5 C29.5 29.5 27.5 31 24 31 L13 31 Z"
          fill="rgba(255,255,255,0.12)"
        />
        <path d="M21 15 L17.5 29" opacity="0.9" />
        <path d="M26.5 14 L23 28" opacity="0.7" />
      </g>
      {/* chute */}
      <path d="M12 31 L9 36" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
