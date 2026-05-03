import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { ClientDetailsSheet } from "~/features/crm/components/client-details-sheet";
import { updateClientAction } from "~/features/crm/server/actions/update-client.action";
import { getContractorClient } from "~/features/crm/server/services/clients.service";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "client-sheet-page" });

async function loadData({ id }: { id: string }) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.error("User not authenticated");
    redirect("/sign-in");
  }

  const [error, client] = await getContractorClient({ contractorId: userId, clientId: id });
  if (error) {
    logger.error({ userId, clientId: id, errorCode: error.code }, "Failed to load client detail");
    notFound();
  }

  logger.info({ userId, clientId: id }, "Successfully loaded client detail");
  return { client };
}

export default async function ClientDetailInterceptedPage({ params }: PageProps<"/app/clients/[id]">) {
  const { id } = await params;
  const { client } = await loadData({ id });

  return <ClientDetailsSheet client={client} onUpdateAction={updateClientAction} />;
}
