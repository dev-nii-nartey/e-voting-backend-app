import { Router } from "express";
import { errorController } from "../app/middlewares/errors-middleware";
import AdminController from "../app/controllers/admin-controller";
import IsAdmin from "../app/middlewares/is.admin-middleware";
import { body } from "express-validator";
import CandidateRepository from "../app/models/candidate-model";

export const adminRoute: Router = Router();

adminRoute.post(
  "/candidate",
  body("nssNumber")
    .notEmpty()
    .trim()
    .isEmail()
    .toLowerCase()
    .escape()
    .custom(async (nssNumber: string) => {
      //find if candidate exist already
      const candidate = await CandidateRepository.findCandidate(nssNumber);
      if (candidate) {
        throw new Error("Candidate is already in the system");
      }
    }),
  body("name").notEmpty().trim().toLowerCase().escape(),
  body("district").notEmpty().trim().toLowerCase().escape(),
  body("institutionAttended").notEmpty().trim().toLowerCase().escape(),
  body("qualification").notEmpty().trim().toLowerCase().escape(),
  body("posting").notEmpty().trim().toLowerCase().escape(),
  body("position").notEmpty().trim().toLowerCase().escape(),
  body("contact").notEmpty().trim().toLowerCase().escape(),
  IsAdmin.tokenValidator,
  errorController(AdminController.addCandidate)


//   adminRoute.get("/candidate/:id",errorController(AdminController.))
);
