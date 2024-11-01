import { Comment } from "../../types/entities";

export interface CommentDao {
  createComment(comment: Comment): Promise<void>;
  listComments(postId: string): Promise<Comment[]>;
  deleteComment(commentId: string): Promise<void>;
  countComments(postId: string): Promise<number>;
}
