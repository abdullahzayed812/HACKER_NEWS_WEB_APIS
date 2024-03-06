import { db } from "../datastore";
import crypto from "crypto";
import { ExpressHandler } from "../types";
import { requestPostDataValidation } from "../utilities";
import { CreatePostRequest, CreatePostResponse } from "../api";

export const listPostsHandler: ExpressHandler<{}, {}> = async (req, res) => {
  res.send({ posts: await db.listPosts() });
};

export const createPostHandler: ExpressHandler<CreatePostRequest, CreatePostResponse> = async (
  req,
  res
) => {
  const { url, title, userId } = req.body;

  requestPostDataValidation(res, title, url, userId);

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

  await db.createPost(post);

  res.sendStatus(200);
};