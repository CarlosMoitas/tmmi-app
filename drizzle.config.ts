import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts", // Aponta para a nova pasta src/db
  out: "./drizzle",            // Onde as migrações SQL (o lixo que apagamos) serão recriadas
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});