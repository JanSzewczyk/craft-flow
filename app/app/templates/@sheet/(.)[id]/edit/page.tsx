import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { EditTemplateSheet } from "~/features/templates/components/forms/edit-template-sheet";
import { updateTemplateAction } from "~/features/templates/server/actions/update-template.action";
import { getTemplateWithSteps } from "~/features/templates/server/db/queries";

export default async function EditTemplateInterceptedPage({ params }: PageProps<"/app/templates/[id]/edit">) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [error, data] = await getTemplateWithSteps({ templateId: id });
  if (error || !data) notFound();

  return (
    <EditTemplateSheet
      templateId={id}
      defaultValues={{
        name: data.template.name,
        description: data.template.description ?? null,
        steps: data.steps.map((s) => ({ title: s.title, description: s.description ?? null }))
      }}
      onUpdateAction={updateTemplateAction}
    />
  );
}
