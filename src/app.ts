import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
// import { limiter } from "./app/middlewares/rate-limitter";
import bodyParser from "body-parser";
import {
  ADMIN_EMAIL,
  ADMIN_ID,
  ADMIN_NAME,
  ADMIN_PASSWORD,
  PORT,
} from "./app/configs/env-config";
import {
  errorEmitter,
  errorHandler,
} from "./app/middlewares/errors-middleware";
import { authRoute } from "./routes/auth-route";
import UserRepository from "./app/models/user-model";
import { Role } from "@prisma/client";
// import { liftOff } from "./app/configs/lift.off-config";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
// app.use(limiter);

app.use("/api", authRoute);

app.use(errorHandler);
app.use(errorEmitter);

app.listen(PORT, async () => {
  console.log(`docs hosted on http://localhost:${PORT}/api/docs`);
  const existingUser = await UserRepository.findUser(ADMIN_EMAIL);
  if (existingUser) {
    console.log("was not null");
    return;
  }
  const userRepo = new UserRepository(
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    ADMIN_ID,
    Role.ADMIN,
    ADMIN_NAME
  );
  await userRepo.add();
});
