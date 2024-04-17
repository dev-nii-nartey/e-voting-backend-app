import { Router } from "express";
import { errorController } from "../app/middlewares/errors-middleware";
import AdminController from "../app/controllers/admin-controller";
import IsAdmin from "../app/middlewares/is.admin-middleware";
import { body, header } from "express-validator";
import CandidateRepository from "../app/models/candidate-model";

export const adminRoute: Router = Router();

adminRoute.post(
  "/candidate",
  body("nssNumber")
    .notEmpty()
    .trim()
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
  body("position").notEmpty().trim().toUpperCase().escape(),
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
adminRoute.put(
  "/candidate/:id",
  IsAdmin.tokenValidator,
  errorController(AdminController.fetchAllCandidates)
);
adminRoute.delete(
  "/candidate/:id",
  IsAdmin.tokenValidator,
  errorController(AdminController.fetchAllCandidates)
);

adminRoute.get(
  "/registrar",
  IsAdmin.tokenValidator,
  errorController(AdminController.fetchAllCandidates)
);
adminRoute.put(
  "/registrar/:id",
  IsAdmin.tokenValidator,
  errorController(AdminController.fetchAllCandidates)
);
adminRoute.delete(
  "/registrar/:id",
  IsAdmin.tokenValidator,
  errorController(AdminController.fetchAllCandidates)
);

adminRoute.get(
  "/voter",
  IsAdmin.tokenValidator,
  errorController(AdminController.fetchAllCandidates)
);
adminRoute.put(
  "/voter",
  IsAdmin.tokenValidator,
  errorController(AdminController.fetchAllCandidates)
);
adminRoute.delete(
  "/voter",
  IsAdmin.tokenValidator,
  errorController(AdminController.fetchAllCandidates)
);
