import { Post } from "../../types/entities";

export interface PostDao {
  createPost(post: Post): Promise<void>;
  listPosts(userId?: string): Promise<Post[]>;
  getPost(id: string, postId: string): Promise<Post | undefined>;
  getPostByUrl(url: string): Promise<Post | undefined>;
  deletePost(postId: string): Promise<void>;
}
