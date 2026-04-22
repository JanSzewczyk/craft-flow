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
import { BrandingEditor, UpgradePromptCard } from "~/features/contractor/components";
import { updateBrandingAction } from "~/features/contractor/server/actions/branding/update-branding.action";
import { uploadLogoAction } from "~/features/contractor/server/actions/branding/upload-logo.action";
import { getBrandingData } from "~/features/contractor/server/services/branding.service";
import { createLogger } from "~/lib/logger";

export const metadata: Metadata = {
  title: "Branding"
};

const logger = createLogger({ module: "branding-page" });

async function loadData() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.error("User not authenticated");
    redirect("/sign-in");
  }

  const {
    features: { branding: hasBranding }
  } = await getPlanFeatures();

  if (!hasBranding) {
    logger.info({ userId }, "Plan does not include branding");
    return { hasBranding: false as const, data: null };
  }

  const [error, data] = await getBrandingData(userId);
  if (error) {
    logger.error({ userId, errorCode: error.code }, "Failed to load branding data");
    throw error;
  }

  logger.info({ userId }, "Successfully loaded branding page data");
  return { hasBranding: true as const, data };
}

export default async function BrandingPage() {
  const { hasBranding, data } = await loadData();

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
              <BreadcrumbPage>Branding</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-heading-h1">Branding</h1>
        <p className="text-lead text-muted-foreground">Dostosuj wygląd swojej marki</p>
      </div>

      {hasBranding ? (
        <BrandingEditor
          defaultValues={{
            brandColor: data.brandColor ?? undefined,
            logoUrl: data.logoUrl
          }}
          onSaveAction={updateBrandingAction}
          uploadLogoAction={uploadLogoAction}
        />
      ) : (
        <UpgradePromptCard variant="branding" />
      )}
    </div>
  );
}
