import { ErrorRequestHandler, RequestHandler } from "express";

export const requestLoggerMiddleware: RequestHandler = (req, res, next) => {
  console.log(req.method, req.path, " - body ", req.body);
  next();
};

export const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  console.log("Uncaught exxeption: ", err);

  return res.status(500).send("Oops, an unexpected error occured, please try again.");
};
