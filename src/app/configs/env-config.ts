import dotenv from "dotenv";

dotenv.config({ path: ".env" });
export const PORT = parseInt(process.env.PORT!);
export const SECRET = process.env.SECRET;
/*========== ADMIN CREDENTIALS============== */
export const ADMIN_NAME = process.env.ADMIN_NAME!;
export const ADMIN_ID = process.env.ADMIN_ID!;
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!; 