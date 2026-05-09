"use client";

import { ChevronRightIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator
} from "@szum-tech/design-system";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CraftFlowLogo } from "~/components/ui/brand-logo";
import { ThemeToggle } from "~/components/ui/theme-toggle";
import { BOTTOM_NAV_ITEMS, COMPANY_NAV_GROUP, MAIN_NAV_ITEMS } from "~/features/contractor/constants/navigation";

type AppSidebarProps = {
  plan?: string;
};

export function AppSidebar({ plan }: AppSidebarProps) {
  const pathname = usePathname();

  const isActive = (segment: string) => {
    return pathname.startsWith(`/app/${segment}`);
  };

  const isCompanyGroupActive = COMPANY_NAV_GROUP.items.some((item) => isActive(item.segment));

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
                  <span className="text-body-xs text-muted-foreground">{plan}</span>
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
            <Collapsible defaultOpen={isCompanyGroupActive} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={COMPANY_NAV_GROUP.label}>
                    <COMPANY_NAV_GROUP.icon aria-hidden="true" />
                    <span>{COMPANY_NAV_GROUP.label}</span>
                    <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {COMPANY_NAV_GROUP.items.map((item) => (
                      <SidebarMenuSubItem key={item.segment}>
                        <SidebarMenuSubButton asChild isActive={isActive(item.segment)}>
                          <Link href={item.href}>
                            <item.icon aria-hidden="true" />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
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
