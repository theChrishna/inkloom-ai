export const ROLES = ["owner", "reviewer", "creator", "agency", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export type NavItem = { href: string; label: string; roles: readonly Role[] };

// Placeholder: real pages arrive in later steps (S2, S4, S6).
export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/", label: "Home", roles: ROLES },
  { href: "/knowledge", label: "Knowledge Centre", roles: ["owner"] },
  { href: "/content", label: "Content", roles: ["owner", "reviewer", "creator", "agency", "viewer"] },
  { href: "/review", label: "Review queue", roles: ["owner", "reviewer"] },
];

export function navFor(role: Role): NavItem[] {
  return NAV_ITEMS.filter((i) => i.roles.includes(role));
}
