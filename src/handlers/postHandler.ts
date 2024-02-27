import { RequestHandler } from "express";
import { db } from "../datastore";
import { Post } from "../types";
import crypto from "crypto";

type ExpressHandler<Req, Res> = RequestHandler<
  string,
  Partial<Res>,
  Partial<Req>,
  any
>;

type CreatePostRequest = Pick<Post, "url" | "title" | "userId">;

interface CreatePostResponse {}

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
