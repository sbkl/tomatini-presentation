"use client";

import {
  BookOpenIcon,
  GraduationCapIcon,
  HouseIcon,
  UsersIcon,
} from "lucide-react";

import { defineMobileNav } from "@/components/mobile-app-layout";

export const mobilePrimaryNav = defineMobileNav([
  {
    id: "dashboard",
    label: "Home",
    icon: HouseIcon,
    isActive: true,
  },
  {
    id: "menus",
    label: "Menu",
    icon: BookOpenIcon,
  },
  {
    id: "modules",
    label: "Learn",
    icon: GraduationCapIcon,
  },
  {
    id: "teams",
    label: "Team",
    icon: UsersIcon,
  },
] as const);
