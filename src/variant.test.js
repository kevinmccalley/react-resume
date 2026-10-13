import { describe, it, expect } from "vitest";
import { VARIANTS, getVariant, applyVariant } from "./variant";
import sectionsData from "./sections.json";

describe("getVariant", () => {
  it("returns null on the main résumé", () => {
    expect(getVariant("/")).toBeNull();
    expect(getVariant("/overview")).toBeNull();
    expect(getVariant("")).toBeNull();
  });

  it("selects a variant by its path prefix", () => {
    expect(getVariant("/frontend")).toBe(VARIANTS.frontend);
    expect(getVariant("/frontend/")).toBe(VARIANTS.frontend);
    expect(getVariant("/frontend/experience")).toBe(VARIANTS.frontend);
  });

  it("does not match a longer first segment", () => {
    expect(getVariant("/frontendish")).toBeNull();
  });
});

describe("applyVariant", () => {
  const base = [
    { id: "a", title: "A", content: "a" },
    { id: "b", title: "B", content: "b" },
    { id: "c", title: "C", content: "c" },
  ];

  it("returns the sections unchanged without a variant", () => {
    expect(applyVariant(base, null)).toBe(base);
  });

  it("overrides only the listed fields of a section", () => {
    const out = applyVariant(base, { sections: { b: { content: "new" } } });
    expect(out.find((s) => s.id === "b")).toEqual({ id: "b", title: "B", content: "new" });
    expect(out.find((s) => s.id === "a")).toBe(base[0]);
  });

  it("reorders sections and keeps unlisted ones after the listed ones", () => {
    const out = applyVariant(base, { order: ["c", "a"] });
    expect(out.map((s) => s.id)).toEqual(["c", "a", "b"]);
  });

  it("does not mutate the base sections", () => {
    const before = JSON.stringify(base);
    applyVariant(base, { order: ["c"], sections: { a: { title: "Z" } } });
    expect(JSON.stringify(base)).toBe(before);
  });
});

describe("frontend variant", () => {
  const variant = VARIANTS.frontend;
  const sections = applyVariant(sectionsData, variant);
  const ids = sectionsData.map((s) => s.id);

  it("keeps every section of the main résumé", () => {
    expect(sections.map((s) => s.id).sort()).toEqual([...ids].sort());
  });

  it("only orders and overrides sections that exist", () => {
    variant.order.forEach((id) => expect(ids).toContain(id));
    Object.keys(variant.sections).forEach((id) => expect(ids).toContain(id));
  });

  it("leads with the overview, then employed experience", () => {
    expect(sections[0].id).toBe("overview");
    expect(sections[1].id).toBe("experience");
  });

  it("reframes the overview", () => {
    expect(sections[0].subtitle).toContain("Senior Front-End & Design Engineer");
  });

  // The variant restates the experience section, so guard against it drifting
  // from the main résumé's employers, dates and titles.
  it("keeps the same employers and dates as the main résumé", () => {
    const positions = (list) =>
      list
        .find((s) => s.id === "experience")
        .content.filter((c) => c.type === "position")
        .map(({ title, date, location }) => ({ title, date, location }));
    expect(positions(sections)).toEqual(positions(sectionsData));
  });

  it("keeps the employed job titles exactly as on the main résumé", () => {
    const roles = (list) =>
      list
        .find((s) => s.id === "experience")
        .content.filter((c) => c.type === "position" && c.title !== "Independent")
        .map((c) => c.role);
    expect(roles(sections)).toEqual(roles(sectionsData));
  });
});
