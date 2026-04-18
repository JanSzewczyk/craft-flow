import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { ClientDetailsSheet } from "~/features/crm/components/client-details-sheet";
import { updateClientAction } from "~/features/crm/server/actions/update-client.action";
import { getClientDetail } from "~/features/crm/server/services/clients.service";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "client-sheet-page" });

export default async function ClientDetailInterceptedPage({ params }: PageProps<"/app/clients/[id]">) {
  const { id } = await params;

  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.error("User not authenticated");
    redirect("/sign-in");
  }

  const [error, client] = await getClientDetail(userId, id);
  if (error || !client) notFound();

  return <ClientDetailsSheet client={client} onUpdateAction={updateClientAction} />;
}
