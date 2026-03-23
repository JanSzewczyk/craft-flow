"use client";

import React from "react";

import { BarChart3Icon, HomeIcon, LayoutDashboardIcon, SettingsIcon, UsersIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage, Button } from "@szum-tech/design-system";
import { PhoneMockup } from "~/features/onboarding/components/phone-mockup";

type BrandingPreviewProps = {
  brandColor?: string;
  logoUrl?: string | null;
};

export function BrandingPreview({ brandColor, logoUrl }: BrandingPreviewProps) {
  return (
    <div className="flex flex-col items-center gap-3" style={{ "--primary": brandColor } as React.CSSProperties}>
      <PhoneMockup>
        {/* Header */}
        <div className="bg-primary flex items-center gap-2 px-4 pt-8 pb-2">
          <Avatar>
            <AvatarImage src={logoUrl || undefined} alt="Logo" />
            <AvatarFallback>CF</AvatarFallback>
          </Avatar>
          <span className="text-primary-foreground text-sm font-semibold">Craft Flow</span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-2">
            <StatCard icon={<UsersIcon className="size-4" />} label="Klienci" value="128" />
            <StatCard icon={<BarChart3Icon className="size-4" />} label="Przychód" value="24.5k" />
          </div>

          {/* Activity card */}
          <div className="rounded border p-3">
            <p className="text-muted-foreground mb-2 text-xs font-medium">Ostatnia aktywność</p>
            <div className="flex flex-col gap-2">
              <ActivityRow label="Nowe zamówienie #1024" time="2 min temu" />
              <ActivityRow label="Wiadomość od klienta" time="15 min temu" />
              <ActivityRow label="Zakończono projekt" time="1 godz. temu" />
            </div>
          </div>

          {/* CTA button */}
          <Button> Nowy projekt</Button>
        </div>

        {/* Bottom tab bar */}
        <div className="flex items-center justify-around border-t border-gray-100 px-2 py-2 dark:border-gray-700">
          <TabIcon icon={<HomeIcon className="size-5" />} active brandColor={brandColor} />
          <TabIcon icon={<LayoutDashboardIcon className="size-5" />} />
          <TabIcon icon={<UsersIcon className="size-5" />} />
          <TabIcon icon={<SettingsIcon className="size-5" />} />
        </div>
      </PhoneMockup>

      <p className="text-muted-foreground text-body-xs">Podgląd na żywo</p>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded border p-3">
      <div className="text-primary mb-1">{icon}</div>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-muted-foreground text-xs">{label}</p>
    </div>
  );
}

function ActivityRow({ label, time }: { label: string; time: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-primary size-1.5 rounded-full" />
      <p className="flex-1 truncate text-xs">{label}</p>
      <p className="text-muted-foreground shrink-0 text-[10px]">{time}</p>
    </div>
  );
}

function TabIcon({ icon, active, brandColor }: { icon: React.ReactNode; active?: boolean; brandColor?: string }) {
  return (
    <div
      className="flex size-10 items-center justify-center rounded-lg"
      style={active ? { color: brandColor } : { color: "var(--color-gray-400)" }}
    >
      {icon}
    </div>
  );
}
