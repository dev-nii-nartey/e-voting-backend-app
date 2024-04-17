import { Portfolio } from "@prisma/client";

export const candidatePortfolio = (position: string): Portfolio => {
  switch (position) {
    case "PRESIDENT":
      return Portfolio.PRESIDENT;
    case "VICE_PRESIDENT":
      return Portfolio.VICE_PRESIDENT;
    case "GENERAL_SECRETARY":
      return Portfolio.GENERAL_SECRETARY;
    case "FINANCIAL_SECRETARY":
      return Portfolio.FINANCIAL_SECRETARY;
    case "ORGANIZER":
      return Portfolio.ORGANIZER;
    case "WOMENS_COMMISSIONER":
      return Portfolio.WOMENS_COMMISSIONER;
    default:
      return Portfolio.ORGANIZER;
  }
};
