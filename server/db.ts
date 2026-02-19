import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../src/db/schema";
import { users, leads, diagnoses } from "../src/db/schema";
import type { InsertUser, InsertDiagnosis } from "../src/db/schema";
import { ENV } from './_core/env';

// Conexão usando a URL do seu .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

// --- USUÁRIOS ---
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required");
  await db.insert(users)
    .values(user)
    .onConflictDoUpdate({
      target: users.openId,
      set: {
        name: user.name,
        email: user.email,
        lastSignedIn: new Date(),
        role: user.openId === ENV.ownerOpenId ? 'admin' : (user.role ?? 'user')
      }
    });
}

export async function getUserByOpenId(openId: string) {
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

// --- LEADS (O routers.ts precisa destas funções) ---
export async function createLead(email: string, name?: string, company?: string) {
  const [newLead] = await db.insert(leads)
    .values({ email, name, company })
    .onConflictDoUpdate({
      target: leads.email,
      set: { name, company, updatedAt: new Date() }
    })
    .returning();
  return newLead;
}

export async function getLeadByEmail(email: string) {
  const result = await db.select().from(leads).where(eq(leads.email, email)).limit(1);
  return result[0];
}

// --- DIAGNÓSTICOS (O routers.ts precisa destas funções) ---
export async function createDiagnosis(leadId: number, token: string, type: 'express' | 'complete' = 'express') {
  const [newDiag] = await db.insert(diagnoses)
    .values({ leadId, token, type, status: 'in_progress' })
    .returning();
  return newDiag;
}

export async function getDiagnosisByToken(token: string) {
  const result = await db.select().from(diagnoses).where(eq(diagnoses.token, token)).limit(1);
  if (result.length > 0) {
    const lead = await db.select().from(leads).where(eq(leads.id, result[0].leadId)).limit(1);
    return { ...result[0], lead: lead[0] };
  }
  return undefined;
}

export async function getDiagnosisById(id: number) {
  const result = await db.select().from(diagnoses).where(eq(diagnoses.id, id)).limit(1);
  if (result.length > 0) {
    const lead = await db.select().from(leads).where(eq(leads.id, result[0].leadId)).limit(1);
    return { ...result[0], lead: lead[0] };
  }
  return undefined;
}

export async function updateDiagnosis(id: number, data: Partial<InsertDiagnosis>) {
  const [updated] = await db.update(diagnoses)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(diagnoses.id, id))
    .returning();
  return updated;
}