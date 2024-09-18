import { db } from "../datastore";
import crypto from "crypto";
import { requestPostDataValidation } from "../utilities/validation";
import {
  CreatePostRequest,
  CreatePostResponse,
  ExpressHandler,
  ListPostsRequest,
  ListPostsResponse,
} from "../types/apis";

export const listPostsHandler: ExpressHandler<ListPostsRequest, ListPostsResponse> = async (
  req,
  res
) => {
  res.send({ posts: await db.listPosts() });
};

export const createPostHandler: ExpressHandler<CreatePostRequest, CreatePostResponse> = async (
  req,
  res
) => {
  const { url, title } = req.body;

  requestPostDataValidation(res, title, url);

  const userId = res.locals.userId;

  if (!url || !title || !userId) {
    return res.sendStatus(400); // Bad request
  }

  const post = {
    id: crypto.randomUUID(),
    title,
    url,
    userId: res.locals.userId,
    postedAt: Date.now(),
  };

  await db.createPost(post);

  res.sendStatus(200);
};
