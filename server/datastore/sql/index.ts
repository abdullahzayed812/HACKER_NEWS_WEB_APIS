import sqlite3 from "sqlite3";
import { Database, open as sqliteOpen } from "sqlite";

import { DataStore } from "..";
import { User, Post, Like, Comment } from "../../types/entities";

import path from "path";
import { SEED_POSTS, SEED_USERS } from "./seeds";
const __dirname = path.resolve();

export class SqlDatastore implements DataStore {
  private db!: Database<sqlite3.Database, sqlite3.Statement>;

  public async openDb(dbPath: string) {
    try {
      this.db = await sqliteOpen({
        filename: path.join(dbPath),
        driver: sqlite3.Database,
        mode: sqlite3.OPEN_READWRITE,
      });
    } catch (error) {
      console.log("Database Error: ", error);
      process.exit(1);
    }

    this.db.run("PRAGMA foreign_keys = ON;");

    try {
      await this.db.migrate({
        migrationsPath: path.join(__dirname, "server", "datastore", "sql", "migrations"),
      });
    } catch (error) {
      console.log("Database Error: ", error);
    }

    if (process.env.ENV === "development") {
      console.log("Seeding data....");

      SEED_USERS.forEach(async (user) => {
        const userExists = await this.getUserById(user.id);

        if (!userExists) await this.createUser(user);
      });

      SEED_POSTS.forEach(async (post) => {
        const postExists = await this.getPostByUrl(post.url);

        if (!postExists) await this.createPost(post);
      });
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

  async updateCurrentUser(user: Partial<User>): Promise<void> {
    await this.db.run(
      "UPDATE users SET username = ?, firstName = ?, lastName = ? WHERE id = ?",
      user.username,
      user.firstName,
      user.lastName,
      user.id
    );
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

  async listPosts(userId?: string): Promise<Post[]> {
    return await this.db.all<Post[]>(
      `SELECT *, EXISTS(
        SELECT 1 FROM likes WHERE likes.postId = posts.id AND likes.userId = ?
      ) as liked FROM posts ORDER BY postedAt DESC`,
      userId
    );
  }

  async getPost(id: string, userId: string): Promise<Post | undefined> {
    return await this.db.get<Post>(
      `SELECT *, EXISTS(
        SELECT 1 FROM likes WHERE likes.postId = ? AND likes.userId = ?
      ) as liked FROM posts WHERE id = ?`,
      id,
      userId,
      id
    );
  }

  async getPostByUrl(url: string): Promise<Post | undefined> {
    return await this.db.get<Post>(`SELECT * FROM posts WHERE url = ?`, url);
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
