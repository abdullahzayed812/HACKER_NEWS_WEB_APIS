import { Post } from "../../types";

export interface PostDao {
  createPost(post: Post): void;
  listPosts(): Post[];
  getPost(postId: string): Post | undefined;
  deletePost(postId: string): void;
}
