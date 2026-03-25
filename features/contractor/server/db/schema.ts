import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const contractorProfile = pgTable("contractor_profile", {
  id: varchar("id", { length: 255 }).primaryKey(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  industry: varchar("industry", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  brandColor: varchar("brand_color", { length: 7 }).default("#10B981"),
  logoUrl: text("logo_url"),
  defaultEmailMessage: text("default_email_message"),
  defaultEmailSubject: text("default_email_subject"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export type ContractorProfile = typeof contractorProfile.$inferSelect;
