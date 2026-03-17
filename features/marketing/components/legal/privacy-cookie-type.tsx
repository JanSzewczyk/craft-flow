import * as React from "react";

export type PrivacyCookieTypeProps = {
  icon: React.ReactNode;
  name: string;
  description: string;
};

export function PrivacyCookieType({ icon, name, description }: PrivacyCookieTypeProps) {
  return (
    <div className="flex items-center gap-4 rounded border p-4">
      <span className="text-primary shrink-0" aria-hidden>
        {icon}
      </span>
      <div>
        <p className="text-foreground font-bold">{name}</p>
        <p className="text-body-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
