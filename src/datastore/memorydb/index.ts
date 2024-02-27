import { User, Post, Like, Comment } from "../../types";
import { DataStore } from "../index";

export class InMemoryDatastore implements DataStore {
  private users: User[] = [];
  private posts: Post[] = [];
  private comments: Comment[] = [];
  private likes: Like[] = [];

  createUser(user: User): void {
    this.users.push(user);
  }
  getUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }
  getUserByUsername(username: string): User | undefined {
    return this.users.find((u) => u.username === username);
  }
  createPost(post: Post): void {
    this.posts.push(post);
  }
  listPosts(): Post[] {
    return this.posts;
  }
  getPost(postId: string): Post | undefined {
    return this.posts.find((p) => p.id === postId);
  }
  deletePost(postId: string): void {
    const index = this.posts.findIndex((p) => p.id === postId);

    if (index === -1) {
      return;
    }

    this.posts.splice(index, 1);
  }
  createLike(like: Like): void {
    this.likes.push(like);
  }
  createComment(comment: Comment): void {
    this.comments.push(comment);
  }
  listComments(): Comment[] {
    return this.comments;
  }
  deleteComment(commentId: string): void {
    const index = this.comments.findIndex((c) => c.id === commentId);

    if (index === -1) {
      return;
    }

    this.comments.splice(index, 1);
  }
}
