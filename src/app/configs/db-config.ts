import { PrismaClient } from "@prisma/client";

export default class Database {
  private static prisma: PrismaClient | undefined;

  private constructor() {}

  static open() {
    if (Database.prisma) {
      return Database.prisma;
    }
    
    Database.prisma = new PrismaClient();
    return Database.prisma;
  }

  static async close() {
    await Database.prisma?.$disconnect();
  }
}