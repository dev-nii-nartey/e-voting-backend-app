import jwt from "jsonwebtoken";
import { SECRET } from "../configs/env-config";


export const generateAccessToken = async (payload: Object) => {
  const token = jwt.sign(payload, SECRET!);
  return token;
};

export const verifyAccessToken = async (token: string) => {
  const verifyToken = jwt.verify(token, SECRET!);
  return verifyToken;
};

export const generateRefreshToken = async (payload: Object) => {
  const token = jwt.sign(payload, SECRET!);
  return token;
};

export const verifyRefreshToken = async (token: string) => {
  const verifyToken = jwt.verify(token, SECRET!);
  return verifyToken;
};