import { Portfolio } from "@prisma/client";
import Database from "../configs/db-config";

export default class CandidateRepository {
  constructor(
    public name: string,
    public nssNumber: string,
    public institutionAttended: string,
    public qualification: string,
    public posting: string,
    public position: string,
    public contact: string,
    public portfolio: Portfolio,
    public district: string
  ) {}
  async add() {
    try {
      const prisma = Database.open();
      const user = await prisma.candidate.create({
        data: {
          name: this.name,
          nssNumber: this.nssNumber,
          position: this.position,
          qualification: this.qualification,
          institutionAttended: this.institutionAttended,
          posting: this.posting,
          contact: this.contact,
          district: this.district,
          portfolio: this.portfolio,
        },
        select: {
          name: true,
          nssNumber: true,
        },
      });
      await Database.close();
      return user;
    } catch (error) {
      console.log("this", error);
      throw new Error("Ops something went wrong, failed to register new user");
    }
  }

  static async findCandidate(data: string) {
    try {
      const prisma = Database.open();
      const user = await prisma.candidate.findFirst({
        where: { nssNumber: data },
      });
      await Database.close();
      return user;
    } catch (error) {
      throw new Error();
    }
  }


  //ANALYTICS NEED WORK ON
  static async fetchCandidatesAnalytics() {
    try {
      const prisma = Database.open();
      const candidates = await prisma.candidate.findMany({
        include: { votes: true },
      });
      await Database.close();
      const analytics = this.candidatePercentage(candidates);
      return candidates;
    } catch (error) {
      throw new Error();
    }
  }

  private static candidatePercentage(candidates: any) {
    // Calculate the total number of votes
    const totalVotes = candidates.reduce(
      (sum: number, candidate: any) => sum + candidate.votes.length,
      0
    );

    // Calculate the percentage share for each candidate
    const candidatesWithVotePercentage = candidates.map((candidate: any) => {
      const candidateVotes = candidate.votes.length;
      const votePercentage =
        totalVotes > 0 ? (candidateVotes / totalVotes) * 100 : 0;

      return {
        name: candidate.name,
        position: candidate.portfolio,
        totalVotes: candidateVotes,
        votePercentage,
      };
    });
  }
}
