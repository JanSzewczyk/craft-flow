import "server-only";

import { boolean, jsonb, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { type BrandingFormData } from "~/features/onboarding/schemas/branding-schema";
import { type CompanyDetailsFormData } from "~/features/onboarding/schemas/company-details-schema";
import { type EmailFormData } from "~/features/onboarding/schemas/email-schema";
import { type TemplateFormData } from "~/features/onboarding/schemas/template-schema";

export const onboardingState = pgTable("onboarding_state", {
  contractorId: varchar("contractor_id", { length: 255 }).primaryKey(),
  currentStep: varchar("current_step", { length: 255 }).notNull(),
  companyDetails: jsonb("company_details").$type<CompanyDetailsFormData>(),
  branding: jsonb("branding").$type<BrandingFormData>(),
  templateConfig: jsonb("template_config").$type<TemplateFormData>(),
  emailConfig: jsonb("email_config").$type<EmailFormData>(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export type OnboardingState = typeof onboardingState.$inferSelect;
