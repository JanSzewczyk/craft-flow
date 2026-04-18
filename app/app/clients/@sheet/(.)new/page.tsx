import { CreateClientDialog } from "~/features/crm/components/forms/create-client-dialog";
import { createClientAction } from "~/features/crm/server/actions/create-client.action";

export default function CreateClientInterceptedPage() {
  return <CreateClientDialog onCreateAction={createClientAction} />;
}
