import { type BuildQueryResult, relations } from "drizzle-orm";

import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { addresses } from "~/features/shared/server/db/schema";
import { type TSchema } from "~/lib/supabase/types";

export const contractorProfile = pgTable("contractor_profile", {
  id: varchar("id", { length: 255 }).primaryKey(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  industry: varchar("industry", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  nip: varchar("nip", { length: 50 }),
  regon: varchar("regon", { length: 14 }),
  email: varchar("email", { length: 255 }).notNull(),
  addressId: uuid("address_id")
    .references(() => addresses.id, { onDelete: "set null" })
    .unique(),
  brandColor: varchar("brand_color", { length: 7 }).default("#10B981"),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export type ContractorProfileRow = typeof contractorProfile.$inferSelect;
export type ContractorProfile = BuildQueryResult<TSchema, TSchema["contractorProfile"], { with: { address: true } }>;

export const contractorProfileRelations = relations(contractorProfile, ({ one }) => ({
  address: one(addresses, {
    fields: [contractorProfile.addressId],
    references: [addresses.id]
  })
}));
