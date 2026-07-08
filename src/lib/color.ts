/** Convierte "#d4a853" en "212 168 83" (formato que esperan las variables --c-*). */
export function hexToRgbTriplet(hex: string): string | null {
  const m = /^#([0-9a-fA-F]{6})$/.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/** true si el color es claro y necesita texto oscuro encima. */
export function isLightColor(hex: string): boolean {
  const triplet = hexToRgbTriplet(hex);
  if (!triplet) return false;
  const [r, g, b] = triplet.split(" ").map(Number);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}
