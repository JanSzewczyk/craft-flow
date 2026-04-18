import { PlusIcon, UsersIcon } from "lucide-react";

import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@szum-tech/design-system";
import Link from "next/link";

export function ClientsEmptyState() {
  return (
    <Empty>
      <EmptyMedia variant="icon">
        <UsersIcon aria-hidden="true" />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>Brak klientów</EmptyTitle>
        <EmptyDescription>Dodaj pierwszego klienta, aby rozpocząć zarządzanie swoją bazą.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild startIcon={<PlusIcon />}>
          <Link href="/app/clients/new">Dodaj pierwszego klienta</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
