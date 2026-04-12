import { PlusIcon, FileTextIcon } from "lucide-react";

import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@szum-tech/design-system";

type TemplatesEmptyStateProps = {
  onCreateClick: () => void;
};

export function TemplatesEmptyState({ onCreateClick }: TemplatesEmptyStateProps) {
  return (
    <Empty>
      <EmptyMedia variant="icon">
        <FileTextIcon aria-hidden="true" />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>Brak szablonów</EmptyTitle>
        <EmptyDescription>Stwórz swój pierwszy szablon etapów, aby przyspieszyć tworzenie projektów.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button startIcon={<PlusIcon />} onClick={onCreateClick}>
          Utwórz pierwszy szablon
        </Button>
      </EmptyContent>
    </Empty>
  );
}
