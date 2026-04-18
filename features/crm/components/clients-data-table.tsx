import { MailIcon, PhoneIcon } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  Status,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@szum-tech/design-system";
import { type ClientListItem } from "~/features/crm/server/db/queries";
import { type ActionResponse } from "~/lib/action-types";
import { formatRelativeTime } from "~/utils/date";

import { ClientRowActions } from "./client-row-actions";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase();
}

type ClientsDataTableProps = {
  items: ClientListItem[];
  onDeleteAction(id: string): ActionResponse<{ id: string }>;
};

export function ClientsDataTable({ items, onDeleteAction }: ClientsDataTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Klient</TableHead>
          <TableHead>Kontakt</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Data dodania</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarFallback>{getInitials(item.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-muted-foreground text-sm">{item.email}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${item.email}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`Wyślij e-mail do ${item.name}`}
                >
                  <MailIcon className="size-4" aria-hidden="true" />
                </a>
                {item.phone ? (
                  <a
                    href={`tel:${item.phone}`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={`Zadzwoń do ${item.name}`}
                  >
                    <PhoneIcon className="size-4" aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </TableCell>
            <TableCell>
              {item.clerkUserId ? (
                <Status variant="primary">Zarejestrowany</Status>
              ) : (
                <Status variant="default">Gość</Status>
              )}
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">{formatRelativeTime(item.createdAt)}</TableCell>
            <TableCell>
              <ClientRowActions client={item} onDeleteAction={onDeleteAction} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
