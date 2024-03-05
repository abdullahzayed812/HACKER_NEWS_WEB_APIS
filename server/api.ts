import { Post } from "./types";

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
