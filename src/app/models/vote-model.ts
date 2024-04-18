import Database from "../configs/db-config";

export default class VoteRepository {
  constructor() {}

  static async vote(candidateId: number) {
    try {
      const prisma = Database.open();
      const vote = prisma.vote.create({ data: { candidateId } });
      await Database.close();
      return vote;
    } catch (error) {
      throw new Error(
        "Ops something went wrong, failed to cast vote"
      );
    }
  }
}
