import { NextFunction, Request, Response, response } from "express";
import { matchedData, validationResult } from "express-validator";
import UserRepository from "../models/user-model";
import { hashSync } from "bcryptjs";
import { Role } from "@prisma/client";
import { HttpException } from "../exceptions/exception";
import { success_code, unprocessableEntity } from "../configs/status-code";
import { JsonOutput } from "../middlewares/json.response-middleware";
import { userRole } from "../utils/roles";
import { Password } from "../utils/password.generator";

export default class RegisterarController {
  constructor() {}

}
