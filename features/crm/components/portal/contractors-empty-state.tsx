import { HardHatIcon } from "lucide-react";

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@szum-tech/design-system";

export function ContractorsEmptyState() {
  return (
    <Empty>
      <EmptyMedia variant="icon">
        <HardHatIcon aria-hidden="true" />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>Brak wykonawców</EmptyTitle>
        <EmptyDescription>
          Nie masz jeszcze żadnych wykonawców. Projekty mogą być inicjowane wyłącznie przez wykonawców — skontaktuj się
          bezpośrednio ze swoim fachowcem.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
