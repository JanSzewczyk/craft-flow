import * as React from "react";

export type PrivacyRightItemProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export function PrivacyRightItem({ icon, title, description }: PrivacyRightItemProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-primary flex items-center gap-2 font-bold">
        <span aria-hidden>{icon}</span>
        {title}
      </div>
      <p className="text-body-sm text-muted-foreground">{description}</p>
    </div>
  );
}
