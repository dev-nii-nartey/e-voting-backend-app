import { Router } from "express";
import { body, header, param } from "express-validator";
import UserRepository from "../app/models/user-model";
import AuthController from "../app/controllers/auth-controller";
import { errorController } from "../app/middlewares/errors-middleware";
import IsAdmin from "../app/middlewares/is.admin-middleware";
import IsRegistrar from "../app/middlewares/is.registrar-middleware";

export const authRoute: Router = Router();

//LOGIN
authRoute.post(
  "/login",
  body("email")
    .trim()
    .isEmail()
    .notEmpty()
    .escape()
    .custom(async (value: string) => {
      //find if user account exist
      const existingUser = await UserRepository.findUser(value);
      if (!existingUser) {
        throw new Error("This email doesnt exist in the system");
      }
    }),
  body("password")
    .notEmpty()
    .trim()
    .escape()
    .isLength({ min: 5 })
    .isLength({ max: 10 }),
  errorController(AuthController.login)
);

//enroll registrar
authRoute.post(
  "/registrar",
  body("email")
    .notEmpty()
    .trim()
    .isEmail()
    .toLowerCase()
    .escape()
    .custom(async (value: string) => {
      //find if user exist already
      const existingUser = await UserRepository.findUser(value);
      if (existingUser) {
        throw new Error("User is already registered in the system");
      }
    }),
  body("name").notEmpty().trim().toLowerCase().escape(),
  header("authorization").notEmpty().trim().escape(),
  IsAdmin.tokenValidator,
  errorController(AuthController.register)
);

//update registrar
authRoute.put(
  "/registrar/:id",
  header("authorization")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("provide an access token"),
  body("name").notEmpty().trim().escape(),
  param("id")
    .notEmpty()
    .toUpperCase()
    .trim()
    .escape()
    .withMessage("provide a parameter to update registrar by")
    .custom(async (id: string) => {
      //find if registrar exist already
      const registrar = await UserRepository.findUser(id);
      if (!registrar) {
        throw new Error("User is not in the system");
      }
      if (registrar.role !== "REGISTRAR") {
        throw new Error("User is not a registrar in the system");
      }
    }),
  IsAdmin.tokenValidator,
  errorController(AuthController.update)
);

//enroll voter
authRoute.post(
  "/voter",
  body("email")
    .notEmpty()
    .trim()
    .isEmail()
    .toLowerCase()
    .escape()
    .custom(async (value: string) => {
      const existingUser = await UserRepository.findUser(value);
      if (existingUser) {
        throw new Error("User is already registered in the system");
      }
    }),
  body("name").notEmpty().trim().toLowerCase().escape(),
  header("authorization")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("provide an access token"),
  IsRegistrar.tokenValidator,
  errorController(AuthController.register)
);

//update voter
authRoute.put(
  "/voter/:id",
  header("authorization")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("provide an access token"),
  body("name").notEmpty().trim().toLowerCase().escape(),
  param("id")
    .notEmpty()
    .toUpperCase()
    .trim()
    .escape()
    .withMessage("provide a parameter to update voter by")
    .custom(async (id: string) => {
      //find if voter exist already
      const voter = await UserRepository.findUser(id);
      if (!voter) {
        throw new Error("User is not in the system");
      }
      if (voter.role !== "VOTER") {
        throw new Error("User is not a voter in the system");
      }
    }),
  IsRegistrar.tokenValidator,
  errorController(AuthController.update)
);

//remove voter
authRoute.delete(
  "/voter:id",
  header("authorization")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("provide an access token"),
  param("id")
    .notEmpty()
    .toUpperCase()
    .trim()
    .escape()
    .withMessage("provide a parameter to delete by")
    .custom(async (id: string) => {
      //find if voter exist already
      const voter = await UserRepository.findUser(id);
      if (!voter) {
        throw new Error("User is not in the system");
      }
    }),
  IsRegistrar.tokenValidator,
  errorController(AuthController.delete)
);
