import express from "express";
import userRouter from "../routes/userRoutes.js";
import courseRouter from "../routes/courseRoute.js";
import departmentRouter from "../routes/departmentRoute.js";
import collegeRouter from "../routes/collegeRoutes.js";
import complaintRouter from "../routes/complaintRoutes.js";
import apprisalTempleteRouter from "../routes/appraisalTemplateRoutes.js";
import appraisalCycleRouter from "../routes/appraisalCycleRoutes.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
const router = express.Router();

router.use("/user", userRouter);
router.use("/department", authenticateUser, departmentRouter);
router.use("/college", authenticateUser, collegeRouter);
router.use("/cycle", authenticateUser, appraisalCycleRouter);
router.use("/complaint", authenticateUser, complaintRouter);
router.use("/course", authenticateUser, courseRouter);
router.use("/templete", authenticateUser, apprisalTempleteRouter);

export default router;
