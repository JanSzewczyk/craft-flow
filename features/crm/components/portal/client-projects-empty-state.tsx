import { FolderOpenIcon, HistoryIcon } from "lucide-react";

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@szum-tech/design-system";

type ClientProjectsEmptyStateProps = {
  context: "active" | "history";
};

export function ClientProjectsEmptyState({ context }: ClientProjectsEmptyStateProps) {
  if (context === "active") {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <FolderOpenIcon aria-hidden="true" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Brak aktywnych projektów</EmptyTitle>
          <EmptyDescription>
            Nie masz żadnych aktywnych projektów. Skontaktuj się z wykonawcą, aby rozpocząć nową realizację.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <Empty>
      <EmptyMedia variant="icon">
        <HistoryIcon aria-hidden="true" />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>Brak projektów w historii</EmptyTitle>
        <EmptyDescription>Zakończone i zarchiwizowane projekty będą widoczne tutaj.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
