import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, leads, diagnoses, InsertDiagnosis } from "../drizzle/schema";
import { ENV } from './_core/env';

import type { Lead, InsertLead, Diagnosis } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Leads queries
export async function createLead(email: string, name?: string, company?: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    await db.insert(leads).values({
      email,
      name,
      company,
    });
    const result = await db.select().from(leads).where(eq(leads.email, email)).limit(1);
    return result[0];
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      // Email already exists, return existing lead
      const result = await db.select().from(leads).where(eq(leads.email, email)).limit(1);
      return result[0];
    }
    throw error;
  }
}

export async function getLeadByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(leads).where(eq(leads.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Diagnoses queries
export async function createDiagnosis(leadId: number, token: string, type: 'express' | 'complete' = 'express') {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(diagnoses).values({
    leadId,
    type,
    token,
    status: 'in_progress',
  });
  
  // Return diagnosis with lead info
  const diagnosis = await db.select().from(diagnoses).where(eq(diagnoses.token, token)).limit(1);
  if (diagnosis.length > 0) {
    const lead = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
    return { ...diagnosis[0], lead: lead[0] };
  }
  
  return result;
}

export async function getDiagnosisByToken(token: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(diagnoses).where(eq(diagnoses.token, token)).limit(1);
  if (result.length > 0) {
    const lead = await db.select().from(leads).where(eq(leads.id, result[0].leadId)).limit(1);
    return { ...result[0], lead: lead[0] };
  }
  
  return result.length > 0 ? result[0] : undefined;
}

export async function getDiagnosisById(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(diagnoses).where(eq(diagnoses.id, id)).limit(1);
  if (result.length > 0) {
    const lead = await db.select().from(leads).where(eq(leads.id, result[0].leadId)).limit(1);
    return { ...result[0], lead: lead[0] };
  }
  
  return result.length > 0 ? result[0] : undefined;
}

export async function updateDiagnosis(id: number, data: Partial<InsertDiagnosis>) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(diagnoses).set(data).where(eq(diagnoses.id, id));
  const result = await db.select().from(diagnoses).where(eq(diagnoses.id, id)).limit(1);
  return result[0];
}
