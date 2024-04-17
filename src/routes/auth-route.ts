import { Router } from "express";
import { body, header } from "express-validator";
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

//REGISTER
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

authRoute.post(
  "/voter",
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
  header("authorization").notEmpty().trim().escape().withMessage('provide an access token'),
  IsRegistrar.tokenValidator,
  errorController(AuthController.register)
);
