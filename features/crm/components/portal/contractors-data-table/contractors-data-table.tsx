import { ExternalLinkIcon, MailIcon, PhoneIcon } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@szum-tech/design-system";
import Link from "next/link";
import { type ClientContractorListItem } from "~/features/projects/types/contractor";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase();
}

type ContractorsDataTableProps = {
  items: Array<ClientContractorListItem>;
};

export function ContractorsDataTable({ items }: ContractorsDataTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Wykonawca</TableHead>
          <TableHead>Kontakt</TableHead>
          <TableHead>Projekty</TableHead>
          <TableHead className="w-28" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarFallback>{getInitials(item.companyName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-body-sm font-medium">{item.companyName}</p>
                  <p className="text-mute">{item.industry}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${item.email}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`Wyślij e-mail do ${item.companyName}`}
                >
                  <MailIcon className="size-4" aria-hidden="true" />
                </a>
                {item.phone ? (
                  <a
                    href={`tel:${item.phone}`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={`Zadzwoń do ${item.companyName}`}
                  >
                    <PhoneIcon className="size-4" aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                {item.activeProjectCount > 0 ? (
                  <Badge variant="primary">{item.activeProjectCount} aktywnych</Badge>
                ) : null}
                <span className="text-mute">{item.projectCount} łącznie</span>
              </div>
            </TableCell>
            <TableCell>
              <Button asChild variant="outline" size="sm" endIcon={<ExternalLinkIcon />}>
                <Link href={`/client/contractors/${item.id}`}>Szczegóły</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
