import { describe, expect, it } from "vitest";
import { navFor, ROLES } from "./roles";

describe("role-aware navigation", () => {
  it("lists five roles", () => {
    expect(ROLES).toHaveLength(5);
  });
  it("only owners see the Knowledge Centre", () => {
    expect(navFor("owner").some((i) => i.href === "/knowledge")).toBe(true);
    expect(navFor("creator").some((i) => i.href === "/knowledge")).toBe(false);
  });
});
