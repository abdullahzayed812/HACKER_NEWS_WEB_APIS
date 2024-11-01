import { verifyJwt } from "../utilities/auth";
import { db } from "../datastore";
import { ExpressHandler } from "../types/apis";

export const authMiddleware: ExpressHandler<any, any> = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).send({ error: "No token exist, please check it and try again." }); // Unauthorized
  }

  try {
    const { userId } = verifyJwt(token!);
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

export const jwtParseMiddleware: ExpressHandler<any, any> = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next();
  }

  let payload: JwtObject;

  try {
    payload = verifyJwt(token);
  } catch (e) {
    const verifyErr = e as VerifyErrors;
    if (verifyErr instanceof TokenExpiredError) {
      return res.status(401).send({ error: ERRORS.TOKEN_EXPIRED });
    }
    return res.status(401).send({ error: ERRORS.BAD_TOKEN });
  }

  const user = await db.getUserById(payload.userId);
  if (!user) {
    return res.status(401).send({ error: ERRORS.USER_NOT_FOUND });
  }
  res.locals.userId = user.id;
  return next();
};

export const enforceJwtMiddleware: ExpressHandler<any, any> = async (_, res, next) => {
  if (!res.locals.userId) {
    return res.sendStatus(401);
  }
  return next();
};
