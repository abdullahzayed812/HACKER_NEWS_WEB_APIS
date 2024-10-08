import sqlite3 from "sqlite3";
import { Database, open as sqliteOpen } from "sqlite";

import { DataStore } from "..";
import { User, Post, Like, Comment } from "../../types/entities";

import path from "path";
const __dirname = path.resolve();

export class SqlDatastore implements DataStore {
  private db!: Database<sqlite3.Database, sqlite3.Statement>;

  public async openDb() {
    try {
      this.db = await sqliteOpen({
        filename: path.join(__dirname, "server", "datastore", "sql", "hacker-news.sqlite"),
        driver: sqlite3.Database,
      });
    } catch (error) {
      console.log("Database Error: ", error);
    }

    try {
      await this.db.migrate({
        migrationsPath: path.join(__dirname, "server", "datastore", "sql", "migrations"),
      });
    } catch (error) {
      console.log("Database Error: ", error);
    }

    return this;
  }

  // User Dao Implementation.
  async createUser(user: User): Promise<void> {
    await this.db.run(
      "INSERT INTO users (id, email, password, username, firstName, lastName) VALUES (?,?,?,?,?,?)",
      user.id,
      user.email,
      user.password,
      user.username,
      user.firstName,
      user.lastName
    );
  }

  async getUserById(id: string): Promise<User | undefined> {
    return await this.db.get<User | undefined>("SELECT * FROM users WHERE id = ?", id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return await this.db.get<User | undefined>("SELECT * FROM users WHERE email = ?", email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return await this.db.get<User | undefined>("SELECT * FROM users WHERE username = ?", username);
  }

  // Post Dao Implementation
  async createPost(post: Post): Promise<void> {
    await this.db.run(
      "INSERT INTO posts (id, title, url, userId, postedAt) VALUES (?,?,?,?,?)",
      post.id,
      post.title,
      post.url,
      post.userId,
      post.postedAt
    );
  }

  async listPosts(): Promise<Post[]> {
    return await this.db.all<Post[]>("SELECT * FROM posts");
  }

  async getPost(postId: string): Promise<Post | undefined> {
    return await this.db.get<Post>("SELECT * FROM posts WHERE id = ?", postId);
  }

  async deletePost(postId: string): Promise<void> {
    await this.db.run("DELETE FROM posts WHERE id = ?", postId);
  }

  // Like Dao Implementation
  async createLike(like: Like): Promise<void> {
    await this.db.run("INSERT INTO likes (userId, postId) VALUES(?,?)", like.userId, like.postId);
  }

  // Comment Dao Implementation
  async createComment(comment: Comment): Promise<void> {
    await this.db.run(
      "INSERT INTO comments (id, userId, postId, comment, postedAt) VALUES (?,?,?,?,?)",
      comment.id,
      comment.userId,
      comment.postId,
      comment.comment,
      comment.postedAt
    );
  }

  async listComments(): Promise<Comment[]> {
    return await this.db.all<Comment[]>("SELECT * FROM comments");
  }

  async deleteComment(commentId: string): Promise<void> {
    await this.db.run("DELETE FROM comments WHERE id = ?", commentId);
  }
}
