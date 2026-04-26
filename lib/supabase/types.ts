import { type ExtractTablesWithRelations } from "drizzle-orm";

import type * as schema from "~/lib/supabase/schema";

export type TSchema = ExtractTablesWithRelations<typeof schema>;
