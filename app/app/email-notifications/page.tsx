import { type Metadata } from "next";

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
import { redirect } from "next/navigation";
import { getPlanFeatures } from "~/features/billing/server";
import { EmailNotificationsEditor, UpgradePromptCard } from "~/features/contractor/components";
import { updateEmailTemplateAction } from "~/features/contractor/server/actions/branding/update-email-template.action";
import { getEmailTemplateData } from "~/features/contractor/server/services/branding.service";
import { createLogger } from "~/lib/logger";

export const metadata: Metadata = {
  title: "Powiadomienia e-mail"
};

const logger = createLogger({ module: "email-notifications-page" });

async function loadData() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.error("User not authenticated");
    redirect("/sign-in");
  }

  const { features } = await getPlanFeatures();

  if (!features.whitelabelEmails) {
    logger.info({ userId }, "Plan does not include whitelabel emails");
    return { canUseEmails: false as const, data: null };
  }

  const [error, data] = await getEmailTemplateData({ contractorId: userId });
  if (error) {
    logger.error({ userId, errorCode: error.code }, "Failed to load email template data");
    throw error;
  }

  logger.info({ userId }, "Successfully loaded email notifications page data");
  return { canUseEmails: true as const, data };
}

export default async function EmailNotificationsPage() {
  const { canUseEmails, data } = await loadData();

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
              <BreadcrumbPage>Powiadomienia e-mail</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-heading-h1">Powiadomienia e-mail</h1>
        <p className="text-lead text-muted-foreground">Dostosuj szablony wiadomości wysyłanych do Twoich klientów</p>
      </div>

      {canUseEmails ? (
        <EmailNotificationsEditor
          defaultValues={data ? { emailSubject: data.subject, emailBody: data.body } : null}
          onSaveAction={updateEmailTemplateAction}
        />
      ) : (
        <UpgradePromptCard variant="email" />
      )}
    </div>
  );
}
