import "server-only";

import { type SupabaseServiceResult } from "~/lib/supabase/errors";

/**
 * Assert that the contractor is allowed to create a project.
 * Currently a pass-through guard — all contractors with a valid profile may create projects.
 * Returns `SupabaseServiceResult<void>` — [null, undefined] always.
 */
export async function canCreateProject(_contractorId: string): Promise<SupabaseServiceResult<void>> {
  return [null, undefined];
}
