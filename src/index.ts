import express from "express";
import { loggerMiddleware } from "./middlewares/loggerMiddleware";
import { createPostHandler, listPostsHandler } from "./handlers/postHandler";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(loggerMiddleware);

app.get("/posts", listPostsHandler);

app.post("/posts", createPostHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
