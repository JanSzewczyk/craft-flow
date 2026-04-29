import "server-only";

import { getBillingPeriodStart, getPlanFeatures } from "~/features/billing/server";
import { getProjectCountCreatedSince } from "~/features/projects/server/db/queries";
import { SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

/**
 * Assert that the contractor is allowed to create a project.
 * Checks the monthly project limit from their billing plan.
 * Returns `SupabaseServiceResult<void>` — [error, null] if limit reached, [null, undefined] otherwise.
 */
export async function canCreateProject(contractorId: string): Promise<SupabaseServiceResult<void>> {
  const {
    limitations: { projectsPerMonth: max }
  } = await getPlanFeatures();

  if (max === null) {
    return [null, undefined];
  }

  const periodStart = await getBillingPeriodStart(contractorId);

  const [countError, count] = await getProjectCountCreatedSince({ contractorId, since: periodStart });
  if (countError) return [countError, null];

  if (count >= max) {
    return [SupabaseServiceError.limitExceeded(max), null];
  }

  return [null, undefined];
}
