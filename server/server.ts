import express, { RequestHandler } from "express";
import cors from "cors";
import { db, initDb } from "datastore";
import { requestLoggerMiddleware } from "middlewares/loggerMiddleware";
import { UserHandler } from "handlers/userHandler";
import { ENDPOINT_CONFIGS, Endpoints } from "utilities/endpoints";
import { PostHandler } from "handlers/postHandler";
import { LikeHandler } from "handlers/likeHandler";
import { CommentHandler } from "handlers/commentHandler";
import { enforceJwtMiddleware, jwtParseMiddleware } from "middlewares/authMiddleware";
import expressAsyncHandler from "express-async-handler";
import { errorHandlerMiddleware } from "middlewares/errorMiddleware";
import { corsOptions } from "configs/corsOptions";
import { credentialsMiddleware } from "middlewares/credentialsMiddleware";
import path from "path";

export async function createServer(logRequests: boolean = true) {
  const dbPath = process.env.DB_PATH;

  console.log("DB Path:", path.resolve(dbPath!));

  if (!dbPath) {
    console.error("DB_PATH env variable is missing.");
    process.exit(1);
  }

  await initDb(dbPath);

  // create express app
  const app = express();

  // middlewares for parsing JSON payloads and opening up cors policy
  app.use(express.json());
  // Cross origin resource sharing
  app.use(cors(corsOptions));
  // Access Control Allow Credentials
  app.use(credentialsMiddleware);

  if (logRequests) {
    // log incoming Requests
    app.use(requestLoggerMiddleware);
  }

  const userHandler = new UserHandler(db);
  const postHandler = new PostHandler(db);
  const likeHandler = new LikeHandler(db);
  const commentHandler = new CommentHandler(db);

  // map of endpoints handlers
  const HANDLERS: { [key in Endpoints]: RequestHandler<any, any> } = {
    [Endpoints.healthy]: (_, res) => res.send({ status: "ok!" }),

    [Endpoints.signIn]: userHandler.signIn,
    [Endpoints.signUp]: userHandler.signUp,
    [Endpoints.getUser]: userHandler.getUser,
    [Endpoints.getCurrentUser]: userHandler.getCurrentUser,
    [Endpoints.updateCurrentUser]: userHandler.updateCurrentUser,

    [Endpoints.listPosts]: postHandler.list,
    [Endpoints.getPost]: postHandler.get,
    [Endpoints.createPost]: postHandler.create,
    [Endpoints.deletePost]: postHandler.delete,

    [Endpoints.listLikes]: likeHandler.list,
    [Endpoints.createLike]: likeHandler.create,
    [Endpoints.deleteLike]: likeHandler.delete,

    [Endpoints.countComments]: commentHandler.count,
    [Endpoints.listComments]: commentHandler.list,
    [Endpoints.createComment]: commentHandler.create,
    [Endpoints.deleteComment]: commentHandler.delete,
  };

  Object.keys(Endpoints).forEach((entry) => {
    const config = ENDPOINT_CONFIGS[entry as Endpoints];
    const handler = HANDLERS[entry as Endpoints];

    config.auth
      ? app[config.method](
          config.url,
          jwtParseMiddleware,
          enforceJwtMiddleware,
          expressAsyncHandler(handler)
        )
      : app[config.method](config.url, jwtParseMiddleware, expressAsyncHandler(handler));
  });

  app.use(errorHandlerMiddleware);

  // start server, https in production, otherwise http.
  const { ENV } = process.env;

  if (!ENV) {
    throw "Environment not defined, make sure to pass in env vars or have a .env file at root.";
  }

  return app;
}
