import { DataStore } from "datastore";
import { ExpressHandlerWithParams, ListLikesResponse } from "types/apis";
import { Like } from "types/entities";
import { ERRORS } from "utilities/errors";

export class LikeHandler {
  private db: DataStore;

  constructor(db: DataStore) {
    this.db = db;
  }

  public create: ExpressHandlerWithParams<{ postId: string }, null, {}> = async (req, res) => {
    if (!req.params.postId) {
      return res.status(400).send({ error: ERRORS.POST_ID_MISSING });
    }

    if (!(await this.db.getPost(req.params.postId))) {
      return res.status(404).send({ error: ERRORS.POST_NOT_FOUND });
    }

    const likeFound = await this.db.likeExists({
      postId: req.params.postId,
      userId: res.locals.userId,
    });

    if (likeFound) {
      return res.status(400).send({ error: ERRORS.DUPLICATE_LIKE });
    }

    const like: Like = {
      postId: req.params.postId,
      userId: res.locals.userId,
    };

    this.db.createLike(like);

    return res.sendStatus(200);
  };

  public delete: ExpressHandlerWithParams<{ postId: string }, null, {}> = async (req, res) => {
    if (!req.params.postId) {
      return res.status(400).send({ error: ERRORS.POST_ID_MISSING });
    }
    if (!(await this.db.getPost(req.params.postId))) {
      return res.status(404).send({ error: ERRORS.POST_NOT_FOUND });
    }

    const like: Like = {
      postId: req.params.postId,
      userId: res.locals.userId,
    };

    this.db.deleteLike(like);

    return res.sendStatus(200);
  };

  public list: ExpressHandlerWithParams<{ postId: string }, null, ListLikesResponse> = async (
    req,
    res
  ) => {
    if (!req.params.postId) {
      return res.status(400).send({ error: ERRORS.POST_ID_MISSING });
    }

    const count: Number = await this.db.getLikes(req.params.postId);

    return res.send({ likes: count });
  };
}
