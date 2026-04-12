"use client";

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
import { BOTTOM_NAV_ITEMS, MAIN_NAV_ITEMS } from "~/features/contractor/constants/navigation";

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (segment: string) => {
    return pathname.startsWith(`/app/${segment}`);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/app/dashboard">
                <CraftFlowLogo />
                <div className="flex flex-col leading-none">
                  <span className="text-heading-h4">CraftFlow</span>
                  <span className="text-body-xs text-muted-foreground">SaaS dla rzemieślników</span>
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
              {MAIN_NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.segment}>
                  <SidebarMenuButton asChild isActive={isActive(item.segment)} tooltip={item.label}>
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
          {BOTTOM_NAV_ITEMS.map((item) => (
            <SidebarMenuItem key={item.segment}>
              <SidebarMenuButton asChild isActive={isActive(item.segment)}>
                <Link href={item.href}>
                  <item.icon className="size-4" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarSeparator />
        <div className="flex justify-center">
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
