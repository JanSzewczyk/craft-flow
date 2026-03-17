import { FingerprintIcon, MailIcon, MapPinIcon } from "lucide-react";

import { Card } from "@szum-tech/design-system";

export type PrivacyAdminCardProps = {
  companyName: string;
  address: string;
  nip: string;
  email: string;
};

export function PrivacyAdminCard({ companyName, address, nip, email }: PrivacyAdminCardProps) {
  return (
    <Card className="p-6">
      <p className="text-primary mb-2 text-xs font-bold tracking-wider uppercase">Administrator Danych</p>
      <h3 className="text-heading-h3 text-foreground mb-3">{companyName}</h3>
      <div className="space-y-1">
        <div className="text-body-sm text-muted-foreground flex items-center gap-2">
          <MapPinIcon className="size-4 shrink-0" aria-hidden />
          <span>{address}</span>
        </div>
        <div className="text-body-sm text-muted-foreground flex items-center gap-2">
          <FingerprintIcon className="size-4 shrink-0" aria-hidden />
          <span>NIP: {nip}</span>
        </div>
        <div className="text-body-sm text-muted-foreground flex items-center gap-2">
          <MailIcon className="size-4 shrink-0" aria-hidden />
          <a href={`mailto:${email}`} className="text-primary underline-offset-4 hover:underline">
            {email}
          </a>
        </div>
      </div>
    </Card>
  );
}
