import type { InferSelectModel } from "drizzle-orm";
import {
  json,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Simplified chat table - no user association
export const chat = pgTable("Chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  title: text("title").notNull(),
  sessionId: varchar("sessionId", { length: 255 }).notNull(), // Anonymous session tracking
});

export type Chat = InferSelectModel<typeof chat>;

// Simplified message table
export const message = pgTable("Message", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id),
  role: varchar("role").notNull(),
  parts: json("parts").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export type DBMessage = InferSelectModel<typeof message>;

// Survey responses table (for future use)
export const surveyResponse = pgTable("SurveyResponse", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id),
  questionId: varchar("questionId", { length: 255 }).notNull(),
  answer: text("answer").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export type SurveyResponse = InferSelectModel<typeof surveyResponse>;
