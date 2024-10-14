import { DataStore } from "datastore";
import crypto from "crypto";
import {
  ExpressHandler,
  ExpressHandlerWithParams,
  GetCurrentUserRequest,
  GetCurrentUserResponse,
  GetUserRequest,
  GetUserResponse,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  UpdateCurrentUserRequest,
  UpdateCurrentUserResponse,
} from "types/apis";
import { User } from "types/entities";
import { signJwt } from "utilities/auth";
import { getSalt } from "utilities/env";
import { ERRORS } from "utilities/errors";

interface UserHandlerProps {
  signIn: ExpressHandler<SignInRequest, SignInResponse>;
  signUp: ExpressHandler<SignUpRequest, SignUpResponse>;
  getUser: ExpressHandlerWithParams<{ id: string }, GetUserRequest, GetUserResponse>;
  getCurrentUser: ExpressHandler<GetCurrentUserRequest, GetCurrentUserResponse>;
  updateCurrentUser: ExpressHandler<UpdateCurrentUserRequest, UpdateCurrentUserResponse>;
}

export class UserHandler implements UserHandlerProps {
  private db: DataStore;

  constructor(db: DataStore) {
    this.db = db;
  }

  public signIn: ExpressHandler<SignInRequest, SignInResponse> = async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).send({ error: ERRORS.INVALID_USER_DATA });
    }

    const userExists =
      (await this.db.getUserByEmail(login)) || (await this.db.getUserByUsername(login));

    if (!userExists) {
      return res.status(400).send({ error: ERRORS.USER_NOT_FOUND });
    }

    if (userExists.password !== this.hashPassword(password)) {
      return res.status(403).send({ error: ERRORS.INCORRECT_PASSWORD });
    }

    const jwt = signJwt({ userId: userExists.id });

    return res.status(200).send({
      user: {
        id: userExists.id,
        email: userExists.email,
        firstName: userExists.firstName,
        lastName: userExists.lastName,
        username: userExists.username,
      },
      accessToken: jwt,
    });
  };

  public signUp: ExpressHandler<SignUpRequest, SignUpResponse> = async (req, res) => {
    const { email, username, password, firstName, lastName } = req.body;

    if (!email || !username || !password || !firstName || !lastName) {
      return res.status(400).send({ error: ERRORS.USER_REQUIRED_FIELDS });
    }

    const usernameExists = await this.db.getUserByUsername(username);

    const userEmailExits = await this.db.getUserByEmail(email);

    if (usernameExists) {
      return res.status(403).send({ error: ERRORS.DUPLICATE_USERNAME });
    }

    if (userEmailExits) {
      return res.status(403).send({ error: ERRORS.DUPLICATE_EMAIL });
    }

    const user: User = {
      id: crypto.randomUUID(),
      email,
      username,
      password: this.hashPassword(password),
      firstName,
      lastName,
    };

    await this.db.createUser(user);

    const jwt = signJwt({ userId: user.id });

    return res.status(200).send({ accessToken: jwt });
  };

  public getUser: ExpressHandlerWithParams<{ id: string }, GetUserRequest, GetUserResponse> =
    async (req, res) => {
      const { id } = req.params;

      if (!id) return res.status(400).send({ error: ERRORS.USER_ID_NOT_SENT });

      const user = await this.db.getUserById(id);

      if (!user) {
        res.status(404).send({ error: ERRORS.USER_NOT_FOUND });
      }

      return res.send({
        id: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        username: user?.username,
      });
    };

  public getCurrentUser: ExpressHandler<GetCurrentUserRequest, GetCurrentUserResponse> = async (
    req,
    res
  ) => {
    const user = await this.db.getUserById(res.locals.userId);

    if (!user) {
      return res.status(500).send({ error: ERRORS.SERVER_ERROR });
    }

    return res.send({
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  };

  public updateCurrentUser: ExpressHandler<UpdateCurrentUserRequest, UpdateCurrentUserResponse> =
    async (req, res) => {
      const currentUserId = res.locals.userId;
      const { username } = req.body;

      if (username && (await this.isDuplicateUsername(username, currentUserId))) {
        return res.status(403).send({ error: ERRORS.DUPLICATE_USERNAME });
      }

      const currentUser = await this.db.getUserById(currentUserId);

      if (!currentUser) {
        return res.status(400).send({ error: ERRORS.USER_NOT_FOUND });
      }

      await this.db.updateCurrentUser({
        id: currentUserId,
        username: username ?? currentUser.username,
        firstName: req.body.firstName ?? currentUser.firstName,
        lastName: req.body.lastName ?? currentUser.lastName,
      });

      return res.sendStatus(200);
    };

  private async isDuplicateUsername(username: string, userId: string): Promise<boolean> {
    const user = await this.db.getUserByUsername(username);

    // returns true if we have a user with this username and it's not the authenticated user
    return user !== undefined && user.id !== userId;
  }

  private hashPassword(password: string) {
    return crypto.pbkdf2Sync(password, getSalt(), 100, 64, "sha512").toString("hex");
  }
}
