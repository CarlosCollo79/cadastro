import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const dbUrl = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || process.env.DATABASE_TURSO_DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_TURSO_AUTH_TOKEN;

if (!dbUrl && process.env.NODE_ENV === 'production') {
    throw new Error('Database URL is missing in production environment variables.');
}

const client = createClient({
    url: dbUrl || "file:local.db",
    authToken: authToken,
});

export const db = drizzle(client, { schema });
