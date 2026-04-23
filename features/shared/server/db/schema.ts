import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  street: varchar("street", { length: 255 }),
  postalCode: varchar("postal_code", { length: 20 }),
  city: varchar("city", { length: 100 }),
  country: varchar("country", { length: 100 }).default("Polska"),
  additionalInfo: text("additional_info"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export type Address = typeof addresses.$inferSelect;
