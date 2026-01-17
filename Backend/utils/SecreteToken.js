import dotenv from "dotenv";
import jwt from "jsonwebtoken"
dotenv.config();

export const createSecretToken = (id) => {
  return jwt.sign({ id }, process.env.SecreteKey, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};