import { Role } from "@prisma/client";
import Database from "../configs/db-config";
import { hashSync } from "bcryptjs";

export default class UserRepository {
  constructor(
    public email: string,
    public password: string,
    public id: string,
    public role: Role,
    public name: string = ""
  ) {}

  async add() {
    try {
      const prisma = Database.open();
      const hashPassword = hashSync(this.password, 10);
      const user = await prisma.user.create({
        data: {
          email: this.email,
          password: hashPassword, 
          id: this.id,
          role: this.role,
          name: this.name,
        },
        select: {
          email: true,
          id: true,
        }, 
      });
      await Database.close();
      return user;
    } catch (error) {
      console.log('this',error)
      throw new Error("Ops something went wrong, failed to register new user");
    }
  }

  static async customUserId(role: string) {
    try {
      const prisma = Database.open();
      let userRole = role;
      const totalNumber = await prisma.user.count();
      userRole = userRole === Role.REGISTRAR ? "REG" : "VTR";
      const userId = `${userRole}-${100 + totalNumber}`;
      await Database.close();
      return userId;
    } catch (error) {
      throw new Error("Ops something went wrong, failed to assign userId");
    }
  }

  static async findByUniqueKey(data: string) {
    try {
      const prisma = Database.open();
      const user = await prisma.user.findFirstOrThrow({
        where: {
          OR: [{ email: data }, { id: data }],
        },
      });
      await Database.close();
      return user;
    } catch (error) {
      throw new Error("Ops something went wrong, failed to find  user");
    }
  }

  static async findUser(data: string) {
    try {
      const prisma = Database.open();
      const user = await prisma.user.findFirst({
        where: {
          OR: [{ email: data }, { id: data }],
        },
      });
      await Database.close();
      return user;
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  }
}