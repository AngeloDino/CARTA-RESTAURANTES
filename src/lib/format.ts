const copFormatter = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 0,
});

export function formatCOP(value: number): string {
  return `$${copFormatter.format(Math.round(value))}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
