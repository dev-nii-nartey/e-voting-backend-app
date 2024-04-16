import router from "express";
import { Router } from "express";
import { body } from "express-validator";
import UserRepository from "../app/models/user-model";
import AuthController from "../app/controllers/auth-controller";
import AdminController from "../app/controllers/admin-controller";
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
  "/enroll/registrar",
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
  IsAdmin.tokenValidator,
  errorController(AdminController.register)
);

authRoute.post(
  "/enroll/voter",
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
  IsRegistrar.tokenValidator,
  errorController(AdminController.register)
);
