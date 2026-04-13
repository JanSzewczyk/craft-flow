import { FileTextIcon, PlusIcon } from "lucide-react";

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

export function TemplatesEmptyState() {
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
        <Button asChild startIcon={<PlusIcon />}>
          <Link href="/app/templates/create">Utwórz pierwszy szablon</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
