import { Router } from "express";
import IsVoter from "../app/middlewares/is.voter-middleware";
import VotersController from "../app/controllers/voters-controller";
import { body, header, param } from "express-validator";
import { errorController } from "../app/middlewares/errors-middleware";
import UserRepository from "../app/models/user-model";

export const voteRoute: Router = Router();

voteRoute.post(
  "/vote/:id",
  header("authorization")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("provide an access token"),
  body("candidateId").trim().notEmpty().escape().toInt(),
  param("id")
    .notEmpty()
    .trim()
    .escape()
    .custom(async (id: string) => {
      //find if candidate exist already
      const { hasVoted } = await UserRepository.findByUniqueKey(id);
      if (hasVoted) {
        throw new Error("user has voted already");
      }
    }),
  IsVoter.tokenValidator,
  errorController(VotersController.vote)
);
