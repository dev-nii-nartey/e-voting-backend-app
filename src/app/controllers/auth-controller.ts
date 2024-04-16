import { compare } from "bcryptjs";
import { matchedData, validationResult } from "express-validator";
import UserRepository from "../models/user-model";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middlewares/jwt-middleware";
import { Request, Response } from "express";
import { HttpException } from "../exceptions/exception";
import { success_code, unprocessableEntity } from "../configs/status-code";
import { JsonOutput } from "../middlewares/json.response-middleware";

export default class AuthController {
  constructor() {}

  //Login
  static async login(request: Request, response: Response) {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      throw new HttpException(unprocessableEntity, result.array());
    }
    const { email, password } = matchedData(request);
    const existingUser = await UserRepository.findByUniqueKey(email);
    const pass = await compare(password, existingUser.password);
    if (!pass) {
      throw new Error("The password the user entered is incorrect");
    }
    const user = await UserRepository.findByUniqueKey(email);
    const accessToken = await generateAccessToken({ user: user?.id });
    console.log(accessToken);
    const refreshToken = await generateRefreshToken({ user: user?.email });
    console.log(refreshToken);
    const responseData = {
      message: "User credentials passed, and is able to log in successfully",
      details: { accessToken, refreshToken },
    };
    return response.status(success_code).json(new JsonOutput(responseData));
  }
}
