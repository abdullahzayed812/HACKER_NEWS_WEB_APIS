import { RequestHandler } from "express";
import { Post, User, Comment } from "./entities";

export type WithError<T> = T & { error: string };

export type ExpressHandler<Req, Res> = RequestHandler<
  string,
  Partial<WithError<Res>>,
  Partial<Req>,
  any
>;

export type ExpressHandlerWithParams<Params, Req, Res> = RequestHandler<
  Partial<Params>,
  Partial<WithError<Res>>,
  Partial<Req>,
  any
>;

// Post APIs
export interface ListPostsRequest {}
export interface ListPostsResponse {
  posts: Post[];
}
export type CreatePostRequest = Pick<Post, "url" | "title">;
export interface CreatePostResponse {}
export interface GetPostRequest {
  post: Post;
}
export interface GetPostResponse {}
export interface DeletePostRequest {
  postId: string;
}
export interface DeletePostResponse {}

// Comment APIs
export type CreateCommentRequest = Pick<Comment, "comment">;
export interface CreateCommentResponse {}
export type CountCommentsRequest = { postId: string };
export type CountCommentResponse = { count: number };
export interface ListCommentsResponse {
  comments: Comment[];
}
export interface DeleteCommentResponse {}

// Like APIs
export interface ListLikesResponse {
  likes: Number;
}

// User APIs
export type SignUpRequest = Pick<
  User,
  "email" | "firstName" | "lastName" | "password" | "username"
>;
export interface SignUpResponse {
  accessToken: string;
}

export interface SignInRequest {
  login: string; // username or email
  password: string;
}
export type SignInResponse = {
  user: Pick<User, "id" | "email" | "firstName" | "lastName" | "username">;
  accessToken: string;
};

export type GetUserRequest = {};
export type GetUserResponse = Pick<User, "id" | "firstName" | "lastName" | "username">;

export type GetCurrentUserRequest = {};
export type GetCurrentUserResponse = Pick<
  User,
  "id" | "firstName" | "lastName" | "username" | "email"
>;

export type UpdateCurrentUserRequest = Partial<Omit<User, "id" | "email" | "password">>;
export type UpdateCurrentUserResponse = {};

export type GetUserByEmailRequest = { email: string };
export interface GetUserByEmailResponse {
  user: User;
}

export type GetUserByUserNameRequest = {
  username: string;
};
export interface GetUserByUserNameResponse {
  user: User;
}
