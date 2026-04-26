import "server-only";

import { type ExtractTablesWithRelations } from "drizzle-orm";
import postgres from "postgres";

import { type PgTransaction } from "drizzle-orm/pg-core";
import { drizzle, type PostgresJsDatabase, type PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import { env } from "~/data/env/server";

import * as schema from "./schema";

const client = postgres(env.DATABASE_URL, { prepare: false });

export const db = drizzle(client, { schema });

export type DbClient =
  | PostgresJsDatabase<typeof schema>
  | PgTransaction<PostgresJsQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>;
