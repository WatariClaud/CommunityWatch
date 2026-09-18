import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  uuid,
  integer,
  doublePrecision,
  pgEnum,
  index,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { notifications } from "./notifications";

export const reportStatusEnum = pgEnum("report_status", [
  "new",
  "in_progress",
  "resolved",
  "closed",
]);

export const reportCategoryEnum = pgEnum("report_category", [
  "infrastructure",
  "public_safety",
  "sanitation",
  "utilities",
  "other",
]);

export const reports = pgTable(
  "reports",
  {
    id: serial("id").primaryKey(),
    reportCode: text("report_code").unique(),
    title: text("title").notNull(),
    category: reportCategoryEnum("category").notNull(),
    description: text("description").notNull(),
    locationName: text("location_name").notNull(),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    photoUrl: text("photo_url"),
    status: reportStatusEnum("status").default("new").notNull(),
    isAnonymous: boolean("is_anonymous").default(false).notNull(),

    reporterId: uuid("reporter_id").references(() => users.id, {
      onDelete: "set null",
    }),
    assignedOfficerId: uuid("assigned_officer_id").references(() => users.id, {
      onDelete: "set null",
    }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_reports_reporter").on(table.reporterId),
    index("idx_reports_status").on(table.status),
    index("idx_reports_category").on(table.category),
  ],
);

export const reportActivities = pgTable("report_activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportId: integer("report_id")
    .notNull()
    .references(() => reports.id, { onDelete: "cascade" }),
  actorId: uuid("actor_id").references(() => users.id, {
    onDelete: "set null",
  }),
  actionText: text("action_text").notNull(),
  dotColor: text("dot_color").default("bg-blue-500"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const reportComments = pgTable("report_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportId: integer("report_id")
    .notNull()
    .references(() => reports.id, { onDelete: "cascade" }),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  commentText: text("comment_text").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const reportsRelations = relations(reports, ({ one, many }) => ({
  reporter: one(users, {
    fields: [reports.reporterId],
    references: [users.id],
    relationName: "reporter",
  }),
  assignedOfficer: one(users, {
    fields: [reports.assignedOfficerId],
    references: [users.id],
    relationName: "officer",
  }),
  activities: many(reportActivities),
  comments: many(reportComments),
  notifications: many(notifications),
}));

export const reportActivitiesRelations = relations(
  reportActivities,
  ({ one }) => ({
    report: one(reports, {
      fields: [reportActivities.reportId],
      references: [reports.id],
    }),
    actor: one(users, {
      fields: [reportActivities.actorId],
      references: [users.id],
    }),
  }),
);

export const reportCommentsRelations = relations(reportComments, ({ one }) => ({
  report: one(reports, {
    fields: [reportComments.reportId],
    references: [reports.id],
  }),
  author: one(users, {
    fields: [reportComments.authorId],
    references: [users.id],
  }),
}));

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  reportId: integer("report_id").references(() => reports.id, {
    onDelete: "cascade",
  }),
  reportCode: varchar("report_code", { length: 50 }),
  actionType: varchar("action_type", { length: 50 }).notNull(),
  message: varchar("message", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
