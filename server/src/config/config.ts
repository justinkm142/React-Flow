import { config } from "dotenv";
config({ path: ".env.development.local" });

export const { PORT, MONGO_URL } = process.env;
