import { Comment } from "../../types/entities";

export interface CommentDao {
  createComment(comment: Comment): Promise<void>;
  listComments(): Promise<Comment[]>;
  deleteComment(commentId: string): Promise<void>;
}
