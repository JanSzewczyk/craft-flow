import { FolderOpenIcon } from "lucide-react";
import { type Metadata } from "next";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@szum-tech/design-system";

export const metadata: Metadata = {
  title: "Pliki projektu"
};

export default async function ProjectFilesPage({}: PageProps<"/app/projects/[projectId]/files">) {
  return (
    <Empty border="dashed">
      <EmptyMedia variant="icon">
        <FolderOpenIcon aria-hidden="true" />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>Funkcja wkrótce dostępna</EmptyTitle>
        <EmptyDescription>
          Zarządzanie plikami i załącznikami do etapów projektu jest w trakcie implementacji.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
