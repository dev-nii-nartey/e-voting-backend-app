import { Role } from "@prisma/client";

export const userRole = (value: string) => {
  return value === "/enroll/registrar" ? Role.REGISTRAR : Role.VOTER;
};
