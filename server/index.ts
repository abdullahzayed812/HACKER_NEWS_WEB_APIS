import express from "express";
import { errorHandlerMiddleware, requestLoggerMiddleware } from "./middlewares";
import { createPostHandler, listPostsHandler } from "./handlers/postHandler";
import expressAsyncHandler from "express-async-handler";
import { initDb } from "./datastore";
import { signInHander, signUpHander } from "./handlers/userHandler";

(async () => {
  await initDb();

  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(requestLoggerMiddleware);

  app.get("/v1/posts", expressAsyncHandler(listPostsHandler));
  app.post("/v1/posts", expressAsyncHandler(createPostHandler));

  app.post("/v1/signUp", expressAsyncHandler(signUpHander));
  app.post("/v1/signIn", expressAsyncHandler(signInHander));

  app.use(errorHandlerMiddleware);

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
