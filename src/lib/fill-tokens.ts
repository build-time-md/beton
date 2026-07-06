/**
 * Replaces the `{km}`/`{price}` tokens in district prose with the build-time
 * estimate, so the rendered text and the JSON-LD always match the calculator.
 * Pure — safe to import from both server and client components.
 */
export function fillTokens(s: string, estimate: { km: number; price: number }): string {
  return s
    .replaceAll("{km}", String(estimate.km))
    .replaceAll("{price}", String(estimate.price));
}
