import { Post, User } from "./types";

// Post APIs
export interface ListPostsRequest {}
export interface ListPostsResponse {
  posts: Post[];
}

export type CreatePostRequest = Pick<Post, "url" | "title" | "userId">;
export interface CreatePostResponse {}

export interface GetPostRequest {
  post: Post;
}
export interface GetPostResponse {}

// Comment APIs

// Like APIs

// User APIs
export type SignUpRequest = Pick<
  User,
  "email" | "firstName" | "lastName" | "password" | "username"
>;
export interface SignUpRepose {
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
