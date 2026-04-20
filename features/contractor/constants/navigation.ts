import {
  type LucideIcon,
  BuildingIcon,
  CircleHelpIcon,
  FileTextIcon,
  HardHatIcon,
  LayoutDashboardIcon,
  MailIcon,
  PaletteIcon,
  SettingsIcon,
  UsersIcon
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  segment: string;
};

export type NavGroup = {
  label: string;
  segment: string;
  icon: LucideIcon;
  items: NavItem[];
};

export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: "Panel sterowania", href: "/app/dashboard", icon: LayoutDashboardIcon, segment: "dashboard" },
  { label: "Projekty", href: "/app/projects", icon: HardHatIcon, segment: "projects" },
  { label: "Klienci", href: "/app/clients", icon: UsersIcon, segment: "clients" },
  { label: "Szablony", href: "/app/templates", icon: FileTextIcon, segment: "templates" }
];

export const COMPANY_NAV_GROUP: NavGroup = {
  label: "Moja firma",
  segment: "company-group",
  icon: BuildingIcon,
  items: [
    { label: "Dane firmy", href: "/app/company", icon: BuildingIcon, segment: "company" },
    { label: "Branding", href: "/app/branding", icon: PaletteIcon, segment: "branding" },
    { label: "Powiadomienia", href: "/app/email-notifications", icon: MailIcon, segment: "email-notifications" }
  ]
};

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { label: "Ustawienia", href: "/app/settings", icon: SettingsIcon, segment: "settings" },
  { label: "Pomoc", href: "/app/help", icon: CircleHelpIcon, segment: "help" }
];
