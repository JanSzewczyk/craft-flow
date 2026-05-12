import { BriefcaseIcon, FolderCheckIcon, FolderIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

import {
  Card,
  CardContent,
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemMedia,
  ItemTitle,
  Separator
} from "@szum-tech/design-system";
import { type ClientContractorListItem } from "~/features/projects/types/contractor";

type ContractorDetailsContentProps = {
  contractor: ClientContractorListItem;
};

export function ContractorDetailsContent({ contractor }: ContractorDetailsContentProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Dane kontaktowe</p>

        <Item variant="muted" size="sm">
          <ItemMedia>
            <BriefcaseIcon className="size-4" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemHeader>
              <ItemTitle>Branża</ItemTitle>
            </ItemHeader>
            <ItemDescription>{contractor.industry}</ItemDescription>
          </ItemContent>
        </Item>

        <Item variant="muted" size="sm">
          <ItemMedia>
            <MailIcon className="size-4" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemHeader>
              <ItemTitle>E-mail</ItemTitle>
            </ItemHeader>
            <ItemDescription>
              <a href={`mailto:${contractor.email}`} className="hover:underline">
                {contractor.email}
              </a>
            </ItemDescription>
          </ItemContent>
        </Item>

        {contractor.phone ? (
          <Item variant="muted" size="sm">
            <ItemMedia>
              <PhoneIcon className="size-4" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemHeader>
                <ItemTitle>Telefon</ItemTitle>
              </ItemHeader>
              <ItemDescription>
                <a href={`tel:${contractor.phone}`} className="hover:underline">
                  {contractor.phone}
                </a>
              </ItemDescription>
            </ItemContent>
          </Item>
        ) : null}

        {contractor.address ? (
          <Item variant="muted" size="sm">
            <ItemMedia>
              <MapPinIcon className="size-4" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemHeader>
                <ItemTitle>Adres</ItemTitle>
              </ItemHeader>
              <ItemDescription>
                <span className="block">{contractor.address.street}</span>
                <span className="block">
                  {contractor.address.postalCode} {contractor.address.city}
                </span>
                <span className="block">{contractor.address.country}</span>
                {contractor.address.additionalInfo ? (
                  <span className="block">{contractor.address.additionalInfo}</span>
                ) : null}
              </ItemDescription>
            </ItemContent>
          </Item>
        ) : null}
      </div>

      <Separator />

      <div className="space-y-3">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Projekty</p>
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <FolderIcon className="text-primary size-4" aria-hidden="true" />
                <span className="text-muted-foreground text-xs">Aktywne</span>
              </div>
              <p className="mt-1 text-2xl font-semibold">{contractor.activeProjectCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <FolderCheckIcon className="text-muted-foreground size-4" aria-hidden="true" />
                <span className="text-muted-foreground text-xs">Łącznie</span>
              </div>
              <p className="mt-1 text-2xl font-semibold">{contractor.projectCount}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
