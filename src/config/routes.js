import express from "express";
import userRouter from "../routes/userRoutes.js";
import courseRouter from "../routes/courseRoute.js";
import departmentRouter from "../routes/departmentRoute.js";
import collegeRouter from "../routes/collegeRoutes.js";
import complaintRouter from "../routes/complaintRoutes.js";
import apprisalTempleteRouter from "../routes/appraisalTemplateRoutes.js";
import appraisalCycleRouter from "../routes/appraisalCycleRoutes.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/department", departmentRouter);
router.use("/college", collegeRouter);
router.use("/cycle", appraisalCycleRouter);
router.use("/complaint", complaintRouter);
router.use("/course", courseRouter);
router.use("/templete", apprisalTempleteRouter);

export default router;
