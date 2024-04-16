import { NextFunction, Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { HttpException } from "../exceptions/exception";
import { unauthorized, unprocessableEntity } from "../configs/status-code";
import { verifyAccessToken } from "./jwt-middleware";
import UserRepository from "../models/user-model";
import { Role } from "@prisma/client";
import { JsonOutput } from "./json.response-middleware";

export default class IsRegistrar {
  constructor() {}
  static async tokenValidator(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const result = validationResult(request);
      if (!result.isEmpty()) {
        throw new HttpException(unprocessableEntity, result.array());
      }
      const { authorization } = matchedData(request);
      let token = authorization.split(" ")[1];
      const data = <{ user: string }>await verifyAccessToken(token);
      const { role } = await UserRepository.findByUniqueKey(data.user);
      if (role !== Role.ADMIN || Role.REGISTRAR) {
        throw new Error("You are not authoriazed for this operation");
      }
      next();
    } catch (error) {
      return response.status(unauthorized).json(new JsonOutput(error));
    }
  }
}
