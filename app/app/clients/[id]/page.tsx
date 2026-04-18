import { auth } from "@clerk/nextjs/server";
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
import { getClientDetail } from "~/features/crm/server/services/clients.service";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "client-detail-page" });

export default async function ClientDetailPage({ params }: PageProps<"/app/clients/[id]">) {
  const { id } = await params;

  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.error("User not authenticated");
    redirect("/sign-in");
  }

  const [error, client] = await getClientDetail(userId, id);
  if (error || !client) notFound();

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
