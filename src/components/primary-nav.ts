import {
  BookOpenIcon,
  GraduationCapIcon,
  LayoutDashboardIcon,
  UsersIcon,
} from "lucide-react";

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
  {
    id: "modules",
    label: "Training Modules",
    icon: GraduationCapIcon,
  },
  {
    id: "teams",
    label: "Teams",
    icon: UsersIcon,
  },
] as const);
