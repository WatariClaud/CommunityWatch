import dotenv from "dotenv";
dotenv.config();
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";

const connectionString = process.env.DATABASE_URL!;

// Disable prefetch for serverless / edge compatibility
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
