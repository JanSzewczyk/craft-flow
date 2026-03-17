import * as React from "react";

export type PrivacyDataItemProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export function PrivacyDataItem({ icon, title, description }: PrivacyDataItemProps) {
  return (
    <li className="bg-primary/5 border-primary/10 flex items-start gap-4 rounded border p-4">
      <div className="bg-primary/10 text-primary shrink-0 rounded p-2" aria-hidden>
        {icon}
      </div>
      <div>
        <strong className="text-foreground block">{title}</strong>
        <span className="text-body-sm text-muted-foreground">{description}</span>
      </div>
    </li>
  );
}
