import { neon } from "@neondatabase/serverless";

const url =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_sBbQpif18vYl@ep-odd-fog-axpxauwj-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require";

const sql = neon(url);

try {
  const rows = await sql`select 1 as ok, current_database() as db, now() as ts`;
  console.log("HTTP OK", rows);
} catch (err) {
  console.error("HTTP FAIL", err?.message || err);
  process.exit(1);
}
