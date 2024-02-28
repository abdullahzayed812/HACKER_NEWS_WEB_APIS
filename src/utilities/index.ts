import { Response } from "express";

export const requestPostDataValidation = (
  res: Response,
  title: string,
  url: string,
  userId: string
): Response<any, Record<string, any>> => {
  if (!title) {
    return res.send(400).send("Post title field is required.");
  } else if (!url) {
    return res.status(400).send("Post url field is required. ");
  } else {
    return res.status(400).send("Post user id is required.");
  }
};
