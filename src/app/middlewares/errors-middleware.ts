import { Request, Response, request, response, NextFunction } from "express";
import { HttpException } from "../exceptions/exception";
import createError from "http-errors";
import { internalServerError } from "../configs/status-code";
import { JsonOutput } from "./json.response-middleware";
// import { internalServerError } from "../constants/status-codes-constant";
// import { JsonOutput } from "./response.middleware";

//ERROR MIDDLEWARE TO CATCH UNRESOLVED ERRORS
export const errorHandler = ( req: Request, res: Response) => {
 const err = createError.NotFound()
  res.status(err.status || 500);
  res.json({
    status: err.status || 500,
    message: err.message,
  });
};

///GENERIC ERROR CONTROLLER
export const errorController = (method: Function) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      await method(request, response);
    } catch (error) {
      if (error instanceof HttpException) {
        return response.status(error.statusCode).json(new JsonOutput(error));
      }
      return response.status(internalServerError).json(new JsonOutput(error));
    }
  };
};
