import { verifyJwt } from "../auth";
import { db } from "../datastore";
import { ExpressHandler } from "../types";

export const authMiddleware: ExpressHandler<any, any> = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.sendStatus(401);
  }

  try {
    const { userId } = verifyJwt(token);
    const user = await db.getUserById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    res.locals.userId = userId;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).send({ error: "Bad token" });
  }
};
