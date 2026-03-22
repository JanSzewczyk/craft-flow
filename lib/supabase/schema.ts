import { boolean, jsonb, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const onboardingState = pgTable("onboarding_state", {
  contractorId: varchar("contractor_id", { length: 255 }).primaryKey(),
  currentStep: varchar("current_step", { length: 255 }).notNull(),
  formData: jsonb("form_data").$type<Record<string, unknown>>().default({}).notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});
