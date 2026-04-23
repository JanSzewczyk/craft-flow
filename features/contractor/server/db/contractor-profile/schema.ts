import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { addresses } from "~/features/shared/server/db/schema";

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

export type ContractorProfile = typeof contractorProfile.$inferSelect;
