import { ExpressHandler, SignInRequest, SignInResponse, SignUpRequest } from "../types/apis";
import { signJwt } from "../utilities/auth";
import { db } from "../datastore";
import { User } from "../types/entities";
import crypto from "crypto";
import { getSalt } from "utilities/env";

export const signUpHandler: ExpressHandler<SignUpRequest, SignInResponse> = async (req, res) => {
  const { email, username, password, firstName, lastName } = req.body;

  if (!email || !username || !password || !firstName || !lastName) {
    return res.status(400).send({ error: "All fields are required." });
  }

  const userExists = (await db.getUserByEmail(email)) || (await db.getUserByUsername(username));

  if (userExists) {
    return res.status(403).send({ error: "User already exists." });
  }

  const user: User = {
    id: crypto.randomUUID(),
    email,
    username,
    password: hashPassword(password),
    firstName,
    lastName,
  };

  await db.createUser(user);

  const jwt = signJwt({ userId: user.id });

  return res.status(200).send({ accessToken: jwt });
};

export const signInHandler: ExpressHandler<SignInRequest, SignInResponse> = async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).send({ error: "Invalid user data, try again." });
  }

  const userExists = (await db.getUserByEmail(login)) || (await db.getUserByUsername(login));

  if (!userExists) {
    return res.status(400).send({ error: "User not exists, sing up..." });
  }

  if (userExists.password !== hashPassword(password)) {
    return res.status(403).send({ error: "Incorrect password..." });
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

function hashPassword(password: string): string {
  return crypto.pbkdf2Sync(password, getSalt(), 100, 64, "sha512").toString("hex");
}
