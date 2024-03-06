import { Post, User } from "./types";

// Post APIs
export interface ListPostsRequest {}
export interface ListPostsResponse {
  post: Post[];
}

export type CreatePostRequest = Pick<Post, "url" | "title" | "userId">;
export interface CreatePostResponse {}

export interface GetPostRequest {
  post: Post;
}
export interface GetPostRespose {}

// Comment APIs

// Like APIs

// User APIs
export type SignUpRequest = Pick<
  User,
  "email" | "firstName" | "lastName" | "password" | "username"
>;
export interface SignUpRepose {}

export interface SignInRequest {
  login: string; // username or email
  password: string;
}

export type SignInResponse = {
  user: Pick<User, "id" | "email" | "firstName" | "lastName" | "username">;
};
