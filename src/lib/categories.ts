export const CATEGORY_COLORS: Record<string, string> = {
  Diesel: "var(--brass-amber)",
  Electric: "var(--steel-blue)",
  "Heritage steam": "var(--rust-vermilion)",
};

export const CATEGORIES = Object.keys(CATEGORY_COLORS);

export function categoryColor(category: string) {
  return CATEGORY_COLORS[category] ?? "var(--brass-amber)";
}
