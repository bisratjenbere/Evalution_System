import express from "express";

// Routers
import userRouter from "../routes/userRoutes.js";
import courseRouter from "../routes/courseRoute.js";
import departmentRouter from "../routes/departmentRoute.js";
import collegeRouter from "../routes/collegeRoutes.js";
import complaintRouter from "../routes/complaintRoutes.js";
import templateRouter from "../routes/appraisalTemplateRoutes.js";
import reviewRouter from "../routes/reviewRoute.js";
import appraisalCycleRouter from "../routes/appraisalCycleRoutes.js";
import resultRouter from "../routes/resultRoute.js";
import notificationRouter from "../routes/notificationRoute.js";

import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use("/users", userRouter);

const protectedRoutes = [
  { path: "/departments", router: departmentRouter },
  { path: "/colleges", router: collegeRouter },
  { path: "/cycles", router: appraisalCycleRouter },
  { path: "/reviews", router: reviewRouter },
  { path: "/complaints", router: complaintRouter },
  { path: "/courses", router: courseRouter },
  { path: "/results", router: resultRouter },
  { path: "/templates", router: templateRouter },
  { path: "/notification", router: notificationRouter },
];

protectedRoutes.forEach(({ path, router: r }) => {
  router.use(path, authenticateUser, r);
});

export default router;
