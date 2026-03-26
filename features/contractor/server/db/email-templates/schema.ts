import { pgEnum, pgTable, text, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";

import { contractorProfile } from "../contractor-profile/schema";

export const emailTemplateTypeEnum = pgEnum("email_template_type", ["WELCOME"]);

export const emailTemplates = pgTable(
  "email_templates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contractorId: varchar("contractor_id", { length: 255 })
      .notNull()
      .references(() => contractorProfile.id, { onDelete: "cascade" }),
    type: emailTemplateTypeEnum("type").notNull(),
    subject: text("subject").notNull(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
  },
  (table) => [unique("email_templates_contractor_type_unique").on(table.contractorId, table.type)]
);

export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type EmailTemplateType = (typeof emailTemplateTypeEnum.enumValues)[number];
export const EmailTemplateType = {
  WELCOME: "WELCOME"
} as const;
