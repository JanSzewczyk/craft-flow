import { jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { contractorProfile } from "~/features/contractor/server/db/contractor-profile/schema";

export type TemplateStep = {
  title: string;
  description: string | null;
  orderIndex: number;
};

export const templates = pgTable("templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  contractorId: varchar("contractor_id", { length: 255 })
    .notNull()
    .references(() => contractorProfile.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  steps: jsonb("steps").$type<Array<TemplateStep>>().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export type Template = typeof templates.$inferSelect;
