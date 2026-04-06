import type { LucideIcon } from "lucide-react";
import { CircleHelpIcon, FileTextIcon, HardHatIcon, LayoutDashboardIcon, SettingsIcon, UsersIcon } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  segment: string;
};

export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: "Panel sterowania", href: "/app/dashboard", icon: LayoutDashboardIcon, segment: "dashboard" },
  { label: "Projekty", href: "/app/projects", icon: HardHatIcon, segment: "projects" },
  { label: "Klienci", href: "/app/clients", icon: UsersIcon, segment: "clients" },
  { label: "Szablony", href: "/app/templates", icon: FileTextIcon, segment: "templates" }
];

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { label: "Ustawienia", href: "/app/settings", icon: SettingsIcon, segment: "settings" },
  { label: "Pomoc", href: "/app/help", icon: CircleHelpIcon, segment: "help" }
];
