import Database from "../configs/db-config";

export default class Vote {
  constructor() {}

  static async cast(candidateId: number) {
    const prisma = Database.open();
    const voted = prisma.vote.create({ data: { candidateId } });
  }
}
