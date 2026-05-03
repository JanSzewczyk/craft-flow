import { auth } from "@clerk/nextjs/server";
import { type Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@szum-tech/design-system";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ClientDetailsContent } from "~/features/crm/components/client-details-content";
import { updateClientAction } from "~/features/crm/server/actions/update-client.action";
import { getContractorClient } from "~/features/crm/server/services/clients.service";
import { createLogger } from "~/lib/logger";

export const metadata: Metadata = {
  title: "Szczegóły Klienta"
};

const logger = createLogger({ module: "client-detail-page" });

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

export default async function ClientDetailPage({ params }: PageProps<"/app/clients/[id]">) {
  const { id } = await params;
  const { client } = await loadData({ id });

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/app/dashboard">Craft Flow</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/app/clients">Baza Klientów</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{client.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-heading-h1">{client.name}</h1>
      </div>

      <div className="mx-auto max-w-2xl">
        <ClientDetailsContent client={client} onUpdateAction={updateClientAction} />
      </div>
    </div>
  );
}
