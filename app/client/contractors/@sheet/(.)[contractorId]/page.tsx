import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { ContractorDetailsSheet } from "~/features/crm/components";
import { getClientContractor } from "~/features/projects/server/services/projects.service";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "client-contractor-sheet-page" });

async function loadData({ contractorId }: { contractorId: string }) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    logger.error("User not authenticated");
    redirect("/sign-in");
  }

  const [err, contractor] = await getClientContractor({ userId, contractorId });
  if (err) {
    logger.error({ userId, contractorId, errorCode: err.code }, "Failed to load contractor detail");
    notFound();
  }

  logger.info({ userId, contractorId }, "Successfully loaded contractor sheet data");
  return { contractor };
}

export default async function ClientContractorSheetPage({ params }: PageProps<"/client/contractors/[contractorId]">) {
  const { contractorId } = await params;
  const { contractor } = await loadData({ contractorId });

  return <ContractorDetailsSheet contractor={contractor} />;
}
