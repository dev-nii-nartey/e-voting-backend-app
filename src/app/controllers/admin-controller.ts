import { NextFunction, Request, Response, response } from "express";
import { matchedData, validationResult } from "express-validator";
import { HttpException } from "../exceptions/exception";
import { success_code, unprocessableEntity } from "../configs/status-code";
import { JsonOutput } from "../middlewares/json.response-middleware";
import CandidateRepository from "../models/candidate-model";
import Database from "../configs/db-config";

export default class AdminController {
  constructor() {}
  static async addCandidate(request: Request, response: Response) {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      throw new HttpException(unprocessableEntity, result.array());
    }
    const {
      name,
      nssNumber,
      district,
      portfolio,
      institutionAttended,
      qualification,
      posting,
      position,
      contact,
    } = matchedData(request);
    const candidate = new CandidateRepository(
      name,
      nssNumber,
      institutionAttended,
      qualification,
      posting,
      position,
      contact,
      portfolio,
      district
    );
    const newCandidate = await candidate.add();
    const responseData = {
      message: `Candidate  added successfully`,
      details: { newCandidate },
    };
    return response.status(success_code).json(new JsonOutput(responseData));
  }

  // static async fetchAllCandidates(request: Request, response: Response) {
  //   const candidates = await CandidateRepository.fetchCandidates();
  //   const responseData = {
  //     message: `Candidate  added successfully`,
  //     details: { candidates },
  //   };
  //   return response.status(success_code).json(new JsonOutput(responseData));
  // }
}
