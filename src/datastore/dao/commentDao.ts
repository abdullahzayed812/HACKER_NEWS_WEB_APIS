import { Comment } from "../../types";

export interface CommentDao {
  createComment(comment: Comment): void;
  listComments(): Comment[];
  deleteComment(commentId: string): void;
}
