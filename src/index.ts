import express from "express";
import { errorHandlerMiddleware, requestLoggerMiddleware } from "./middlewares";
import { createPostHandler, listPostsHandler } from "./handlers/postHandler";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(requestLoggerMiddleware);

app.get("/posts", listPostsHandler);

app.post("/posts", createPostHandler);

app.use(errorHandlerMiddleware);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
