import { verifyJwt } from "../utilities/auth";
import { db } from "../datastore";
import { ExpressHandler, JwtPayload } from "../types/apis";
import { TokenExpiredError, VerifyErrors } from "jsonwebtoken";
import { ERRORS } from "utilities/errors";

export const jwtParseMiddleware: ExpressHandler<any, any> = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next();
  }

  let jwtPayload: JwtPayload;

  try {
    jwtPayload = verifyJwt(token);
  } catch (error) {
    const verifyError = error as VerifyErrors;

    if (verifyError instanceof TokenExpiredError) {
      return res.status(401).send({ error: ERRORS.TOKEN_EXPIRED });
    }

    return res.status(401).send({ error: ERRORS.BAD_TOKEN });
  }

  const user = await db.getUserById(jwtPayload.userId);

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
