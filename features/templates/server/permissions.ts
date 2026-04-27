import "server-only";

import { getPlanFeatures } from "~/features/billing/server";
import { getTemplateCountByContractor } from "~/features/templates/server/db/queries";
import { SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

/**
 * Assert that the contractor is allowed to add another template under their current plan.
 * Returns `SupabaseServiceResult<void>` — [error, null] if limit reached, [null, undefined] otherwise.
 */
export async function canAddTemplate(contractorId: string): Promise<SupabaseServiceResult<void>> {
  const [countError, used] = await getTemplateCountByContractor({ contractorId });
  if (countError) return [countError, null];

  const {
    limitations: { templates: max }
  } = await getPlanFeatures();

  if (max !== null && used >= max) {
    return [SupabaseServiceError.limitExceeded(max), null];
  }
  return [null, undefined];
}
