import express from "express";
import { db } from "./datastore/index";

const app = express();

app.use(express.json());

app.get("/posts", (req, res) => {
  res.send({ posts: db.listPosts() });
});

app.post("/posts", (req, res) => {
  const post = req.body;

  db.createPost(post);

  res.sendStatus(200);
});

app.listen(3000, () => console.log("Server running on port 3000"));
