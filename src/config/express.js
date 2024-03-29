import express from "express";
import * as environments from "../config/environments.js";
import cloudinary from "cloudinary";
import helmet from "helmet";
import mongoSanitazer from "express-mongo-sanitize";
import allRoutes from "./routes.js";
import cookieParser from "cookie-parser";
import AppError from "../utils/appError.js";

import errorHandlerMiddleware from "../middleware/errorHandler.js";
cloudinary.config({
  cloud_name: environments.CLOUD_Name,
  api_key: environments.CLOUD_KEY,
  api_secret: environments.CLOUD_SECREAT,
});
import cors from "cors";
const app = express();
app.use(cors());
app.use(mongoSanitazer());
app.use(express.json());
app.use(helmet());

app.use(cookieParser(environments.JWT_KEY));
app.use("/api/v1", allRoutes);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandlerMiddleware);
export default app;
