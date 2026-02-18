import { BookOpenIcon, LayoutDashboardIcon } from "lucide-react";

import { defineWebNav } from "@/components/web-app-layout";

export const primaryNav = defineWebNav([
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboardIcon,
    isActive: true,
  },
  {
    id: "menus",
    label: "Menus",
    icon: BookOpenIcon,
  },
] as const);
