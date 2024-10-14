import { initDb } from "datastore";

export async function createServer(logRequests: boolean = true) {
  const dbPath = process.env.DB_PATH;

  if (!dbPath) {
    console.error("DB_PATH env variable is missing.");
    process.exit(1);
  }

  await initDb(dbPath);
}
