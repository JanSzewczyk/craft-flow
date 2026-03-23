import { type ReactNode } from "react";

import { cn } from "@szum-tech/design-system/utils";

type PhoneMockupProps = {
  children: ReactNode;
  className?: string;
};

export function PhoneMockup({ children, className }: PhoneMockupProps) {
  return (
    <div
      className={cn(
        "bg-background relative mx-auto w-70 rounded-[2.5rem] border-[6px] border-gray-800 shadow-xl dark:border-gray-700",
        className
      )}
    >
      {/* Notch */}
      <div className="absolute top-0 left-1/2 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-gray-800 dark:bg-gray-700" />

      {/* Screen */}
      <div className="bg-background relative flex h-140 flex-col overflow-hidden rounded-4xl">{children}</div>
    </div>
  );
}
