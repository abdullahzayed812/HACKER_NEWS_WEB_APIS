import express from "express";
import { createPostHandler, listPostsHandler } from "./handlers/postHandler";
import expressAsyncHandler from "express-async-handler";
import { initDb } from "./datastore";
import { signInHandler, signUpHandler } from "./handlers/authHandler";
import dotenv from "dotenv";
import { requestLoggerMiddleware } from "./middlewares/loggerMiddleware";
import { errorHandlerMiddleware } from "./middlewares/errorMiddleware";
import { authMiddleware } from "./middlewares/authMiddleware";

(async () => {
  await initDb();

  dotenv.config();

  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(requestLoggerMiddleware);

  // Public endpoints.
  app.post("/v1/signUp", expressAsyncHandler(signUpHandler));
  app.post("/v1/signIn", expressAsyncHandler(signInHandler));

  app.use(authMiddleware);

  // Protected endpoints.
  app.get("/v1/posts", expressAsyncHandler(listPostsHandler));
  app.post("/v1/posts", expressAsyncHandler(createPostHandler));

  app.use(errorHandlerMiddleware);

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
