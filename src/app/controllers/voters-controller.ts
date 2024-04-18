import { matchedData, validationResult } from "express-validator";
import { HttpException } from "../exceptions/exception";
import { success_code, unprocessableEntity } from "../configs/status-code";
import VoteRepository from "../models/vote-model";
import { JsonOutput } from "../middlewares/json.response-middleware";
import { Request, Response } from "express";
import UserRepository from "../models/user-model";

export default class VotersController {
  constructor() {}
  static async vote(request: Request, response: Response) {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      throw new HttpException(unprocessableEntity, result.array());
    }
    const { candidateId, id } = matchedData(request);
    const findUser = await UserRepository.findByUniqueKey(id);
    const vote = await VoteRepository.vote(candidateId);
    const user = new UserRepository(
      findUser.email,
      findUser.password,
      findUser.id,
      findUser.role,
      findUser.name
    );
    await user.flag(id);
    const responseData = {
      message: "User credentials passed, and is able to log in successfully",
      details: { vote },
    };
    return response.status(success_code).json(new JsonOutput(responseData));
  }
}
