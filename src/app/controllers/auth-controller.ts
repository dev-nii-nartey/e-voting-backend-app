import { compare } from "bcryptjs";
import { matchedData, validationResult } from "express-validator";
import UserRepository from "../models/user-model";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middlewares/jwt-middleware";
import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/exception";
import { success_code, unprocessableEntity } from "../configs/status-code";
import { JsonOutput } from "../middlewares/json.response-middleware";
import { userRole } from "../utils/roles";
import { Password } from "../utils/password.generator";


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
    const refreshToken = await generateRefreshToken({ user: user?.email });
    const responseData = {
      message: "User credentials passed, and is able to log in successfully",
      details: { accessToken, refreshToken },
    };
    return response.status(success_code).json(new JsonOutput(responseData));
  }

  static async register(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      throw new HttpException(unprocessableEntity, result.array());
    }
    const { name, email } = matchedData(request);
    const role = userRole(request.url);
    const password = Password.generate();
    const userId = await UserRepository.customUserId(role);
    const userPayload = new UserRepository(email, password, userId, role, name);
    const data = await userPayload.add();
    const responseData = {
      message: `User account created successfully`,
      details: { data, password },
    };
    return response.status(success_code).json(new JsonOutput(responseData));
  }

  static async fetch(request: Request, response: Response) {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      throw new HttpException(unprocessableEntity, result.array());
    }
    const filter = userRole(request.url);
    const data = await UserRepository.filterUsers(filter);
    const responseData = {
      message: `${filter} retreived successfully`,
      details: { data },
    };
    return response.status(success_code).json(new JsonOutput(responseData));
  }

  static async delete(request: Request, response: Response) {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      throw new HttpException(unprocessableEntity, result.array());
    }
    const { id } = matchedData(request);
    const data = await UserRepository.deleteUser(id);
    const responseData = {
      message: `user deleted successfully`,
      details: { data },
    };
    return response.status(success_code).json(new JsonOutput(responseData));
  }

  static async update(request: Request, response: Response) {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      throw new HttpException(unprocessableEntity, result.array());
    }
    const { id, name } = matchedData(request);
    const user = await UserRepository.findByUniqueKey(id);
    const updatedUser = new UserRepository(
      user.email,
      user.password,
      id,
      user.role,
      name
    );
    const data = await updatedUser.update();
    const responseData = {
      message: `User account updated successfully`,
      details: { data },
    };
    return response.status(success_code).json(new JsonOutput(responseData));
  }
}
