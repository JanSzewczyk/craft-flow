import { type BuildQueryResult, relations } from "drizzle-orm";

import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { contractorProfile } from "~/features/contractor/server/db/contractor-profile/schema";
import { clients } from "~/features/crm/server/db/schema";
import { type TSchema } from "~/lib/supabase/types";

export const projectStatusEnum = pgEnum("project_status", ["DRAFT", "ACTIVE", "COMPLETED", "ARCHIVED", "DELETED"]);

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  contractorId: varchar("contractor_id", { length: 255 })
    .notNull()
    .references(() => contractorProfile.id, { onDelete: "cascade" }),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "restrict" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  status: projectStatusEnum("status").default("DRAFT").notNull(),
  publicToken: varchar("public_token", { length: 50 }).notNull().unique(),
  lastClientViewAt: timestamp("last_client_view_at"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const projectSteps = pgTable("project_steps", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  isCompleted: boolean("is_completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
  orderIndex: integer("order_index").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export type ProjectRow = typeof projects.$inferSelect;
export type Project = BuildQueryResult<TSchema, TSchema["projects"], { with: { client: true; steps: true } }>;
export type ProjectStep = typeof projectSteps.$inferSelect;

export const projectsRelations = relations(projects, ({ one, many }) => ({
  client: one(clients, {
    fields: [projects.clientId],
    references: [clients.id]
  }),
  steps: many(projectSteps)
}));

export const projectStepsRelations = relations(projectSteps, ({ one }) => ({
  project: one(projects, {
    fields: [projectSteps.projectId],
    references: [projects.id]
  })
}));
