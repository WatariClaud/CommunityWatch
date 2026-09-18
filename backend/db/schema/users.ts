import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { reports, reportComments } from "./reports";
import { notifications } from "./notifications";

export const userRoleEnum = pgEnum("user_role", [
  "citizen",
  "officer",
  "admin",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  avatarUrl: text("avatar_url").default("/avatar.jpg"),
  role: userRoleEnum("role").default("citizen").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  reportsSubmitted: many(reports, { relationName: "reporter" }),
  reportsAssigned: many(reports, { relationName: "officer" }),
  comments: many(reportComments),
  notifications: many(notifications),
}));
