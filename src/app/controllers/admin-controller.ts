import { NextFunction, Request, Response, response } from "express";
import { matchedData, validationResult } from "express-validator";
import { HttpException } from "../exceptions/exception";
import { success_code, unprocessableEntity } from "../configs/status-code";
import { JsonOutput } from "../middlewares/json.response-middleware";
import CandidateRepository from "../models/candidate-model";
import Database from "../configs/db-config";
import { aspiringPosition } from "../utils/portfolio";
import UserRepository from "../models/user-model";
import { userRole } from "../utils/roles";

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
      institutionAttended,
      qualification,
      posting,
      position,
      contact,
    } = matchedData(request);
    const portfolio = aspiringPosition(position);
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

  static async fetchAllCandidates(request: Request, response: Response) {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      throw new HttpException(unprocessableEntity, result.array());
    }
    const candidates = await CandidateRepository.fetchCandidates();
    const responseData = {
      message: `Candidate  retreived successfully`,
      details: { candidates },
    };
    return response.status(success_code).json(new JsonOutput(responseData));
  }

  // static async updateCandidate(request: Request, response: Response) {
  //   const result = validationResult(request);
  //   if (!result.isEmpty()) {
  //     throw new HttpException(unprocessableEntity, result.array());
  //   }
  //   const data = matchedData(request);
  //   const candidates = await CandidateRepository.update(data.nssNumber);
  //   const responseData = {
  //     message: `Candidate  retreived successfully`,
  //     details: { candidates },
  //   };
  //   return response.status(success_code).json(new JsonOutput(responseData));
  // }
  
  static async deleteCandidate(request: Request, response: Response) {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      throw new HttpException(unprocessableEntity, result.array());
    }
    const { nssNumber } = matchedData(request);
    const candidates = await CandidateRepository.delete(nssNumber);
    const responseData = {
      message: `Candidate  deleted successfully`,
      details: { candidates },
    };
    return response.status(success_code).json(new JsonOutput(responseData));
  }

  static async filterCandidate(request: Request, response: Response) {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      throw new HttpException(unprocessableEntity, result.array());
    }
    const { filter } = matchedData(request);
    const candidates = await CandidateRepository.filter(filter);
    const responseData = {
      message: `Candidate  retreived successfully`,
      details: { candidates },
    };
    return response.status(success_code).json(new JsonOutput(responseData));
  } 
}
