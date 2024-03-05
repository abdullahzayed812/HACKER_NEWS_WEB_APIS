import sqlite3 from "sqlite3";
import { Database, open as sqliteOpen } from "sqlite";

import { DataStore } from "..";
import { User, Post, Like, Comment } from "../../types";

import path from "path";
const __dirname = path.resolve();

export class SqlDatastore implements DataStore {
  private db: Database<sqlite3.Database, sqlite3.Statement>;

  public async openDb() {
    this.db = await sqliteOpen({
      filename: path.join(__dirname, "server", "datastore", "sql", "hackerank.sqlite"),
      driver: sqlite3.Database,
    });

    await this.db.migrate({
      migrationsPath: path.join(__dirname, "server", "datastore", "sql", "migrations"),
    });

    return this;
  }

  createUser(user: User): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getUserByEmail(email: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  getUserByUsername(username: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  createPost(post: Post): Promise<void> {
    throw new Error("Method not implemented.");
  }
  listPosts(): Promise<Post[]> {
    throw new Error("Method not implemented.");
  }
  getPost(postId: string): Promise<Post> {
    throw new Error("Method not implemented.");
  }
  deletePost(postId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  createLike(like: Like): Promise<void> {
    throw new Error("Method not implemented.");
  }
  createComment(comment: Comment): Promise<void> {
    throw new Error("Method not implemented.");
  }
  listComments(): Promise<Comment[]> {
    throw new Error("Method not implemented.");
  }
  deleteComment(commentId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
