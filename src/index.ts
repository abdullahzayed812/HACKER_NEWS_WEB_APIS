import express from "express";
import { errorHandlerMiddleware, requestLoggerMiddleware } from "./middlewares";
import { createPostHandler, listPostsHandler } from "./handlers/postHandler";
import expressAsyncHandler from "express-async-handler";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(requestLoggerMiddleware);

app.get("/posts", expressAsyncHandler(listPostsHandler));

app.post("/posts", expressAsyncHandler(createPostHandler));

app.use(errorHandlerMiddleware);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
