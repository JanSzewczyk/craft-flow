import "server-only";

import { getBillingPeriodStart, getPlanFeatures } from "~/features/billing/server";
import { getProjectCountStartedSince } from "~/features/projects/server/db/queries";
import { SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

export async function canActivateProject(contractorId: string): Promise<SupabaseServiceResult<void>> {
  const {
    limitations: { projectsPerMonth: max }
  } = await getPlanFeatures();

  if (max === null) {
    return [null, undefined];
  }

  const periodStart = await getBillingPeriodStart(contractorId);

  const [countError, count] = await getProjectCountStartedSince({ contractorId, since: periodStart });
  if (countError) return [countError, null];

  if (count >= max) {
    return [SupabaseServiceError.limitExceeded(max), null];
  }

  return [null, undefined];
}
