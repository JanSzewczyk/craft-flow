import { CreateTemplateSheet } from "~/features/templates/components/create-template-sheet";
import { createTemplateAction } from "~/features/templates/server/actions/create-template.action";

export default function CreateTemplateInterceptedPage() {
  return <CreateTemplateSheet onCreateAction={createTemplateAction} />;
}
