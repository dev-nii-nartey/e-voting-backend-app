import { NextFunction, Request, Response, response } from "express";
import { matchedData, validationResult } from "express-validator";
import UserRepository from "../models/user-model";
import { hashSync } from "bcryptjs";
import { Role } from "@prisma/client";
import { HttpException } from "../exceptions/exception";
import { success_code, unprocessableEntity } from "../configs/status-code";
import { JsonOutput } from "../middlewares/json.response-middleware";
import { userRole } from "../utils/url.extractor";

export default class AdminController {
  constructor() {}

  static async register(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      throw new HttpException(unprocessableEntity, result.array());
    }
    const { name, email, password } = matchedData(request);
    const role =  userRole(request.url);
    const userId = await UserRepository.customUserId(role);
    const userPayload = new UserRepository(
      email,
      password,
      userId,
      Role.REGISTRAR,
      name
    );
    const newUser = await userPayload.add();
    const responseData = {
      message: `User account created successfully`,
      details: { newUser },
    };
    return response.status(success_code).json(new JsonOutput(responseData));
  }
}
