import { relations } from "drizzle-orm";

import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { contractorProfile } from "~/features/contractor/server/db/contractor-profile/schema";
import { clients } from "~/features/crm/server/db/schema";

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
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const projectSteps = pgTable("project_steps", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
  orderIndex: integer("order_index").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export type Project = typeof projects.$inferSelect;
export type ProjectStep = typeof projectSteps.$inferSelect;

export type ProjectStatus = (typeof projectStatusEnum.enumValues)[number];
export const ProjectStatus = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  ARCHIVED: "ARCHIVED",
  DELETED: "DELETED"
} as const satisfies Record<ProjectStatus, ProjectStatus>;

export const ProjectStatuses = projectStatusEnum.enumValues;

export const projectsRelations = relations(projects, ({ one, many }) => ({
  client: one(clients, {
    fields: [projects.clientId],
    references: [clients.id]
  }),
  steps: many(projectSteps)
}));
