import express from "express";
import userRoutes from "../routes/userRoute.js";

const router = express.Router();
console.log("in route");
router.use("/user", userRoutes);

export default router;
