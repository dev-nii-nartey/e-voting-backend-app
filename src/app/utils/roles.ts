import { Role } from "@prisma/client";

export const userRole = (value: string) => {
  return value === "/registrar" ? Role.REGISTRAR : Role.VOTER;
};
