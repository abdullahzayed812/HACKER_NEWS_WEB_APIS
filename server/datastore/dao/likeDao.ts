import { Like } from "../../types/entities";

export interface LikeDao {
  createLike(like: Like): Promise<void>;
}
