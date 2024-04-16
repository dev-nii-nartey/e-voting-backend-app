// import { Role } from "@prisma/client";
// import { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD, PORT } from "./env-config";
// import UserRepository from "../models/user-model";
// import { response } from "express";
// import { JsonOutput } from "../middlewares/json.response-middleware";
// import { internalServerError } from "./status-code";

// export const liftOff = async () => {
//   try {
//     console.log(`🚀 @ http://localhost:${PORT}`);
//     const existingUser = await UserRepository.findByUniqueKey(ADMIN_EMAIL);
//     if (existingUser) {
//       return;
//     }
//     const userRepo = new UserRepository(
//       ADMIN_NAME,
//       ADMIN_EMAIL,
//       ADMIN_PASSWORD,
//       Role.ADMIN
//     );
//     await userRepo.add();
//   } catch (error) {
//     throw new Error();
//   }
// };
