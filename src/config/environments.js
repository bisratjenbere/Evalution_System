import dotenv from "dotenv";
import Joi from "joi";
dotenv.config();
const environmentSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow("development", "production")
    .default("development"),
  MONGO_URL: Joi.string().required().description("Mongo DB URL is required"),
  PORT: Joi.number().default(5000),
  JWT_SECRET: Joi.string().required("JWT Key is required"),
  JWT_EXPIRES_IN: Joi.string().required("expire date is required"),
  API_KEY: Joi.string().required("cloudnery key is required"),
  API_KEY_SECREAT: Joi.string().required("cloudnery api key is required"),
  CLOUD_NAME: Joi.string().required("cloudnery name is a must"),
})
  .unknown()
  .required();

const { error, value } = environmentSchema.validate(process.env);

if (error) {
  throw new Error(`env vars validation error: ${error.message}`);
}

export const NODE_ENV = value.NODE_ENV;
export const MONGO_URL = value.MONGO_URL;
export const PORT = value.PORT;
export const JWT_KEY = value.JWT_KEY;
export const CLOUD_Name = value.CLOUD_NAME;
export const CLOUD_KEY = value.API_KEY;
export const CLOUD_SECREAT = value.API_KEY_SECREAT;
export const JWT_EXPIRES_IN = value.JWT_EXPIRES_IN;
