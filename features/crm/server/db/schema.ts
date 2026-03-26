import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { contractorProfile } from "~/features/contractor/server/db/contractor-profile/schema";

export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  contractorId: varchar("contractor_id", { length: 255 })
    .notNull()
    .references(() => contractorProfile.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  clerkUserId: varchar("clerk_user_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export type Client = typeof clients.$inferSelect;
