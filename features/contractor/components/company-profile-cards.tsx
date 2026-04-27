import { BuildingIcon, MapPinIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@szum-tech/design-system";
import { type CompanyProfile } from "~/features/contractor/server/services/company-profile.service";

type ProfileFieldProps = {
  label: string;
  value: string | null | undefined;
  className?: string;
};

function ProfileField({ label, value, className }: ProfileFieldProps) {
  return (
    <div className={className}>
      <p className="text-mute uppercase">{label}</p>
      <p className="text-body-default mt-1">{value ?? "—"}</p>
    </div>
  );
}

type CompanyProfileCardsProps = {
  companyProfile: CompanyProfile;
};

export function CompanyProfileCards({ companyProfile }: CompanyProfileCardsProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BuildingIcon className="size-5" />
            Dane Biznesowe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-8">
            <ProfileField label="Nazwa firmy" value={companyProfile.companyName} />
            <ProfileField label="Branża" value={companyProfile.industry} />
            <ProfileField label="NIP" value={companyProfile.nip} />
            <ProfileField label="REGON" value={companyProfile.regon} />
            <ProfileField label="Publiczny e-mail" value={companyProfile.email} />
            <ProfileField label="Telefon" value={companyProfile.phone} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPinIcon className="size-5" />
            Siedziba Firmy
          </CardTitle>
        </CardHeader>
        <CardContent>
          {companyProfile.address ? (
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-8">
              <ProfileField label="Ulica i numer" value={companyProfile.address.street} />
              <ProfileField label="Kod pocztowy" value={companyProfile.address.postalCode} />
              <ProfileField label="Miasto" value={companyProfile.address.city} />
              <ProfileField label="Kraj" value={companyProfile.address.country} />
              {companyProfile.address.additionalInfo ? (
                <ProfileField
                  label="Informacje dodatkowe"
                  value={companyProfile.address.additionalInfo}
                  className="sm:col-span-2"
                />
              ) : null}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Nie podano adresu siedziby</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
