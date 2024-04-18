import { Router } from "express";
import { errorController } from "../app/middlewares/errors-middleware";
import AdminController from "../app/controllers/admin-controller";
import IsAdmin from "../app/middlewares/is.admin-middleware";
import { body, header, param, query } from "express-validator";
import CandidateRepository from "../app/models/candidate-model";
import { aspiringPosition } from "../app/utils/portfolio";
import UserRepository from "../app/models/user-model";
import AuthController from "../app/controllers/auth-controller";
import IsRegistrar from "../app/middlewares/is.registrar-middleware";

export const adminRoute: Router = Router();

adminRoute.post(
  "/candidate",
  body("nssNumber")
    .notEmpty()
    .trim()
    .toUpperCase()
    .isLength({ min: 13, max: 13 })
    .withMessage("Nss Number must be 13")
    .escape()
    .custom(async (nssNumber: string) => {
      //find if candidate exist already
      const candidate = await CandidateRepository.findCandidate(nssNumber);
      if (candidate) {
        throw new Error("Candidate is already in the system");
      }
    }),
  body("name").notEmpty().trim().toUpperCase().escape(),
  body("district").notEmpty().trim().toLowerCase().escape(),
  body("institutionAttended").notEmpty().trim().toLowerCase().escape(),
  body("qualification").notEmpty().trim().toLowerCase().escape(),
  body("posting").notEmpty().trim().toLowerCase().escape(),
  body("position")
    .notEmpty()
    .trim()
    .toUpperCase()
    .escape()
    .custom((value: string) => {
      return aspiringPosition(value);
    }),
  body("contact").notEmpty().trim().toLowerCase().escape(),
  header("authorization")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("provide an access token"),
  IsAdmin.tokenValidator,
  errorController(AdminController.addCandidate)
);
adminRoute.get(
  "/candidate",
  header("authorization")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("provide an access token"),
  IsAdmin.tokenValidator,
  errorController(AdminController.fetchAllCandidates)
);
adminRoute.get(
  "/candidate/:filter",
  header("authorization")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("provide an access token"),
  param("filter")
    .notEmpty()
    .trim()
    .escape()
    .toUpperCase()
    .withMessage("provide a parameter to filter by"),
  IsAdmin.tokenValidator,
  errorController(AdminController.filterCandidate)
);
adminRoute.put(
  "/candidate/:nssNumber",
  body("nssNumber")
    .notEmpty()
    .trim()
    .toUpperCase()
    .isLength({ min: 13, max: 13 })
    .withMessage("Nss Number must be 13")
    .escape()
    .custom(async (nssNumber: string) => {
      //find if candidate exist already
      const candidate = await CandidateRepository.findCandidate(nssNumber);
      if (!candidate) {
        throw new Error("Candidate is already in the system");
      }
    }),
  body("name").notEmpty().trim().toUpperCase().escape(),
  body("district").notEmpty().trim().toLowerCase().escape(),
  body("institutionAttended").notEmpty().trim().toLowerCase().escape(),
  body("qualification").notEmpty().trim().toLowerCase().escape(),
  body("posting").notEmpty().trim().toLowerCase().escape(),
  body("position")
    .notEmpty()
    .trim()
    .toUpperCase()
    .escape()
    .custom((value: string) => {
      return aspiringPosition(value);
    }),
  body("contact").notEmpty().trim().toLowerCase().escape(),
  param("nssNumber")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("provide a parameter to update by"),
  header("authorization")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("provide an access token"),
  IsAdmin.tokenValidator,
  errorController(AdminController.updateCandidate)
);

adminRoute.delete(
  "/candidate/:nssNumber",
  header("authorization")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("provide an access token"),
  param("nssNumber")
    .notEmpty()
    .trim()
    .escape()
    .toUpperCase()
    .withMessage("provide a parameter to delete by")
    .custom(async (nssNumber: string) => {
      //find if candidate exist already
      const candidate = await CandidateRepository.findCandidate(nssNumber);
      if (!candidate) {
        throw new Error("User is not in the system");
      }
    }),
  IsAdmin.tokenValidator,
  errorController(AdminController.deleteCandidate)
);

adminRoute.get(
  "/registrar",
  header("authorization")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("provide an access token"),
  IsAdmin.tokenValidator,
  errorController(AuthController.fetch)
);

adminRoute.delete(
  "/registrar/:id",
  param("id")
    .notEmpty()
    .trim()
    .escape()
    .toUpperCase()
    .withMessage("provide a parameter to delete by")
    .custom(async (id: string) => {
      //find if candidate exist already
      const registrar = await UserRepository.findUser(id);
      if (!registrar) {
        throw new Error("User is not in the system");
      }
    }),
  header("authorization")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("provide an access token"),
  IsAdmin.tokenValidator,
  errorController(AuthController.delete)
);

adminRoute.get(
  "/voter",
  header("authorization")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("provide an access token"),
  IsAdmin.tokenValidator,
  errorController(AuthController.fetch)
);
