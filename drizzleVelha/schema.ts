import { integer, jsonb, pgEnum, pgTable, text, timestamp, varchar, serial } from "drizzle-orm/pg-core";

// 1. Definição de Enums (O Postgres exige criação prévia)
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const typeEnum = pgEnum("type", ["express", "complete"]);
export const statusEnum = pgEnum("status", ["in_progress", "completed", "failed"]);

// 2. Tabela Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(), // serial substitui o auto_increment
  openId: varchar("open_id", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("login_method", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in").defaultNow().notNull(),
});

// 3. Tabela Leads
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  company: varchar("company", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 4. Tabela Diagnoses (TDM/TMMi)
export const diagnoses = pgTable("diagnoses", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull(),
  type: typeEnum("type").default("express").notNull(),
  status: statusEnum("status").default("in_progress").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  // Usamos jsonb no Postgres para melhor performance e busca
  answers: jsonb("answers"),
  analysis: jsonb("analysis"),
  maturityLevel: integer("maturity_level"),
  scores: jsonb("scores"),
  gaps: jsonb("gaps"),
  recommendations: jsonb("recommendations"),
  benchmarking: jsonb("benchmarking"),
  reportUrl: varchar("report_url", { length: 512 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});