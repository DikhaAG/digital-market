import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { relations } from "./schema";

if (!process.env.SUPABASE_DATABASE_URL) {
  throw new Error(
    "SUPABASE_DATABASE_URL is missing from environment variables",
  );
}

const client = postgres(process.env.SUPABASE_DATABASE_URL, { prepare: false });
export const db = drizzle({ client, relations: relations });
