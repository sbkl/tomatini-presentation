"use client";

import type { LucideIcon } from "lucide-react";

export type MobileNavItem<Id extends string = string> = {
  id: Id;
  label: string;
  icon: LucideIcon;
  isActive?: boolean;
};

export function defineMobileNav<const TPrimaryNav extends readonly MobileNavItem[]>(
  navItems: TPrimaryNav,
) {
  return navItems;
}
