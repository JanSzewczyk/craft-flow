"use client";

import { cn } from "@szum-tech/design-system/utils";

type SwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
};

export function Switch({ checked, onCheckedChange, disabled = false, id, "aria-label": ariaLabel }: SwitchProps) {
  return (
    <label
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors",
        checked ? "bg-primary" : "bg-muted",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      )}
    >
      <input
        type="checkbox"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        id={id}
        checked={checked}
        disabled={disabled}
        className="absolute opacity-0"
        onChange={() => onCheckedChange(!checked)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onCheckedChange(!checked);
          }
        }}
      />
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none size-6 rounded-full bg-white shadow-md transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </label>
  );
}
