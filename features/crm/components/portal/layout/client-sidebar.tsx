"use client";

import { FolderIcon, HistoryIcon, LogOutIcon } from "lucide-react";

import { useClerk } from "@clerk/nextjs";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator
} from "@szum-tech/design-system";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CraftFlowLogo } from "~/components/ui/brand-logo";
import { ThemeToggle } from "~/components/ui/theme-toggle";

const NAV_ITEMS = [
  { label: "Moje Projekty", href: "/client", icon: FolderIcon },
  { label: "Historia", href: "/client/history", icon: HistoryIcon }
] as const;

export function ClientSidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/client">
                <CraftFlowLogo />
                <div className="flex flex-col leading-none">
                  <span className="text-heading-h4">CraftFlow</span>
                  <span className="text-body-xs text-muted-foreground">Portal Klienta</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                    <Link href={item.href}>
                      <item.icon className="size-4" aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Wyloguj się" onClick={() => signOut({ redirectUrl: "/sign-in" })}>
              <LogOutIcon className="size-4" aria-hidden="true" />
              <span>Wyloguj się</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
        <div className="flex justify-center">
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
