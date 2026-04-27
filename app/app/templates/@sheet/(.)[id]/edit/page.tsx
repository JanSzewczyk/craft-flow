import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { EditTemplateSheet } from "~/features/templates/components/forms/edit-template-sheet";
import { updateTemplateAction } from "~/features/templates/server/actions/update-template.action";
import { getTemplateById } from "~/features/templates/server/db/queries";

export default async function EditTemplateInterceptedPage({ params }: PageProps<"/app/templates/[id]/edit">) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [error, template] = await getTemplateById({ templateId: id });
  if (error || !template) notFound();

  return (
    <EditTemplateSheet
      templateId={id}
      defaultValues={{
        name: template.name,
        description: template.description ?? null,
        steps: template.steps.map((s) => ({ title: s.title, description: s.description ?? null }))
      }}
      onUpdateAction={updateTemplateAction}
    />
  );
}
