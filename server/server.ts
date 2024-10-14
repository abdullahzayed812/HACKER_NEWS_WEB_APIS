import express, { RequestHandler } from "express";
import cors from "cors";
import { initDb } from "datastore";
import { requestLoggerMiddleware } from "middlewares/loggerMiddleware";

export async function createServer(logRequests: boolean = true) {
  const dbPath = process.env.DB_PATH;

  if (!dbPath) {
    console.error("DB_PATH env variable is missing.");
    process.exit(1);
  }

  await initDb(dbPath);

  // create express app
  const app = express();

  // middlewares for parsing JSON payloads and opening up cors policy
  app.use(express.json());
  app.use(cors());

  if (logRequests) {
    // log incoming Requests
    app.use(requestLoggerMiddleware);
  }
}
