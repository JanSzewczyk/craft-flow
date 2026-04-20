import "server-only";

import { getPlanFeatures } from "~/features/billing/server";
import { SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

export async function canEditBranding(): Promise<SupabaseServiceResult<void>> {
  const { features } = await getPlanFeatures();

  if (!features.branding) {
    return [SupabaseServiceError.unauthorized(), null];
  }

  return [null, undefined];
}

export async function canEditEmailTemplates(): Promise<SupabaseServiceResult<void>> {
  const { features } = await getPlanFeatures();

  if (!features.whitelabelEmails) {
    return [SupabaseServiceError.unauthorized(), null];
  }

  return [null, undefined];
}
