import express, { RequestHandler } from "express";
import cors from "cors";
import { db, initDb } from "datastore";
import { requestLoggerMiddleware } from "middlewares/loggerMiddleware";
import { UserHandler } from "handlers/userHandler";
import { Endpoints } from "utilities/endpoints";

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

  const userHandler = new UserHandler(db);

  // map of endpoints handlers
  const HANDLERS: { [key in Endpoints]: RequestHandler<any, any> } = {
    [Endpoints.healthy]: (_, res) => res.send({ status: "ok!" }),

    [Endpoints.signIn]: userHandler.signIn,
    [Endpoints.signUp]: userHandler.signUp,
    [Endpoints.getUser]: userHandler.getUser,
    [Endpoints.getCurrentUser]: userHandler.getCurrentUser,
    [Endpoints.updateCurrentUser]: userHandler.updateCurrentUser,

    // [Endpoints.listPosts]: postHandler.list,
    // [Endpoints.getPost]: postHandler.get,
    // [Endpoints.createPost]: postHandler.create,
    // [Endpoints.deletePost]: postHandler.delete,

    // [Endpoints.listLikes]: likeHandler.list,
    // [Endpoints.createLike]: likeHandler.create,
    // [Endpoints.deleteLike]: likeHandler.delete,

    // [Endpoints.countComments]: commentHandler.count,
    // [Endpoints.listComments]: commentHandler.list,
    // [Endpoints.createComment]: commentHandler.create,
    // [Endpoints.deleteComment]: commentHandler.delete,
  };
}
