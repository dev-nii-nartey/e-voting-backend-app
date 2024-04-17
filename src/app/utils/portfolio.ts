import { Portfolio } from "@prisma/client";

export const aspiringPosition = (position: string): Portfolio => {
  switch (position) {
    case "PRESIDENT":
      return Portfolio.PRESIDENT;
    case "VICE PRESIDENT":
      return Portfolio.VICE_PRESIDENT;
    case "GENERAL SECRETARY":
      return Portfolio.GENERAL_SECRETARY;
    case "FINANCIAL SECRETARY":
      return Portfolio.FINANCIAL_SECRETARY;
    case "ORGANIZER":
      return Portfolio.ORGANIZER;
    case "WOMENS COMMISSIONER":
      return Portfolio.WOMENS_COMMISSIONER;
    default:
      throw new Error(`${position}  is an invalid input`)
  }
};
