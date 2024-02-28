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

router.use("/users", userRouter);
router.use("/departments", authenticateUser, departmentRouter);
router.use("/colleges", authenticateUser, collegeRouter);
router.use("/cycles", authenticateUser, appraisalCycleRouter);
router.use("/complaints", authenticateUser, complaintRouter);
router.use("/courses", authenticateUser, courseRouter);
router.use("/templetes", authenticateUser, apprisalTempleteRouter);

export default router;
