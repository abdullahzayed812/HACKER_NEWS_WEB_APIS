import { Like } from "../../types/entities";

export interface LikeDao {
  createLike(like: Like): Promise<void>;
  deleteLike(like: Like): Promise<void>;
  getLikes(postId: string): Promise<number>;
  likeExists(like: Like): Promise<boolean>;
}
