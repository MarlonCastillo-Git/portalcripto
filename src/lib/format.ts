const numberFormat = new Intl.NumberFormat("es-ES", {
  maximumFractionDigits: 2,
});

/** Escala larga del español: un billón equivale a un millón de millones. */
export function formatMarketCap(value: number): string {
  const magnitude = Math.abs(value);
  if (magnitude >= 1_000_000_000_000) {
    const amount = value / 1_000_000_000_000;
    return `${numberFormat.format(amount)} ${Math.abs(amount) === 1 ? "billón" : "billones"}`;
  }
  if (magnitude >= 1_000_000) {
    const amount = value / 1_000_000;
    return `${numberFormat.format(amount)} ${Math.abs(amount) === 1 ? "millón" : "millones"}`;
  }
  if (magnitude >= 1_000) {
    return `${numberFormat.format(value / 1_000)} mil`;
  }
  return numberFormat.format(value);
}
