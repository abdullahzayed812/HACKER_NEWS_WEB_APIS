import { SignInRequest, SignInResponse, SignUpRepose, SignUpRequest } from "../api";
import { db } from "../datastore";
import { ExpressHandler, User } from "../types";
import crypto from "crypto";

export const signUpHander: ExpressHandler<SignUpRequest, SignUpRepose> = async (req, res) => {
  const { email, username, password, firstName, lastName } = req.body;

  if (!email || !username || !password || !firstName || !lastName) {
    return res.status(400).send("All fields are required.");
  }

  const userExists = (await db.getUserByEmail(email)) || (await db.getUserByUsername(username));

  if (userExists) {
    return res.status(403).send("User already exists.");
  }

  const user: User = { id: crypto.randomUUID(), email, username, password, firstName, lastName };

  await db.createUser(user);

  return res.status(200).send("User created successfully.");
};

export const signInHander: ExpressHandler<SignInRequest, SignInResponse> = async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.sendStatus(400);
  }

  const userExists = (await db.getUserByEmail(login)) || (await db.getUserByUsername(login));

  if (!userExists || password !== userExists.password) {
    return res.sendStatus(403);
  }

  return res.status(200).send({
    user: {
      id: userExists.id,
      email: userExists.email,
      firstName: userExists.firstName,
      lastName: userExists.lastName,
      username: userExists.username,
    },
  });
};
