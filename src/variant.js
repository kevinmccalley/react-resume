// Résumé variants: alternate framings of the same résumé, each served under its
// own path prefix (e.g. /frontend). A variant is a small override file layered
// over sections.json — it never duplicates sections it doesn't change.
import frontend from "./variants/frontend.json";

export const VARIANTS = { frontend };

// "/frontend" and "/frontend/experience" select the variant; "/frontendish" does not.
export function getVariant(pathname) {
  const first = (pathname || "").split("/")[1];
  return VARIANTS[first] || null;
}

export function applyVariant(sections, variant) {
  if (!variant || !Array.isArray(sections)) return sections;

  const overrides = variant.sections || {};
  const merged = sections.map((s) => (overrides[s.id] ? { ...s, ...overrides[s.id] } : s));
  if (!variant.order) return merged;

  // Listed ids first, in the variant's order; anything unlisted keeps its place after them.
  const rank = (s) => {
    const i = variant.order.indexOf(s.id);
    return i === -1 ? variant.order.length : i;
  };
  return merged
    .map((s, i) => ({ s, i }))
    .sort((a, b) => rank(a.s) - rank(b.s) || a.i - b.i)
    .map(({ s }) => s);
}
