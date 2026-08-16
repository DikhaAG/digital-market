import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import dns from "node:dns";

// Paksa Node.js mengutamakan resolusi IPv4 untuk mencegah timeout koneksi Supabase
dns.setDefaultResultOrder("ipv4first");

if (!process.env.SUPABASE_DATABASE_URL) {
  throw new Error(
    "SUPABASE_DATABASE_URL is missing from environment variables",
  );
}

// Global Singleton Connection Pool untuk Next.js (Development Hot Reload)
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const client =
  globalForDb.conn ??
  postgres(process.env.SUPABASE_DATABASE_URL, {
    prepare: false, // Wajib false untuk Supabase Transaction Pooler (PgBouncer)
    max: 10,
    idle_timeout: 30,
    connect_timeout: 30, // Ditingkatkan ke 30 detik untuk toleransi latensi jaringan
    ssl: "require", // Memastikan handshake SSL diizinkan oleh Supabase
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.conn = client;
}

// Pass schema sebagai opsi kedua agar db.query.* dapat bekerja secara fungsional
export const db = drizzle({ client, relations: schema.relations });
