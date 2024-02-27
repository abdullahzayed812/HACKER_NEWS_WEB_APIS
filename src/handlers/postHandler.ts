import { db } from "../datastore";
import crypto from "crypto";
import {
  CreatePostRequest,
  CreatePostResponse,
  ExpressHandler,
} from "../types";

export const listPostsHandler: ExpressHandler<{}, {}> = (req, res) => {
  res.send({ posts: db.listPosts() });
};

export const createPostHandler: ExpressHandler<
  CreatePostRequest,
  CreatePostResponse
> = (req, res) => {
  const { url, title, userId } = req.body;

  if (!url || !title || !userId) {
    return res.sendStatus(400);
  }

  const post = {
    id: crypto.randomUUID(),
    postedAt: Date.now(),
    url,
    title,
    userId,
  };

  db.createPost(post);

  res.sendStatus(200);
};
