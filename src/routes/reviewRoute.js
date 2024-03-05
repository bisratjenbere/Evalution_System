import express from "express";
import {
  reviewByPeer,
  reviewBySelf,
  reviewByHead,
  reviewByDean,
  reviewByTeamLeader,
  reviewByDirector,
  reviewByStudent,
} from "../controllers/reviewController.js";

import { authorizePermissions } from "../middleware/authMiddleware.js";
const evaluationRouter = express.Router();
evaluationRouter.route("/self").post(reviewBySelf);
evaluationRouter.route("/by-peer/:id").post(reviewByPeer);
evaluationRouter
  .route("/by-head/:id")
  .post(authorizePermissions("head"), reviewByHead);
evaluationRouter
  .route("/by-dean/:id")
  .post(authorizePermissions("dean"), reviewByDean);
evaluationRouter
  .route("/by-team-leader/:id")
  .post(authorizePermissions("teamLeader"), reviewByTeamLeader);
evaluationRouter
  .route("/director/:id")
  .post(authorizePermissions("director"), reviewByDirector);
evaluationRouter
  .route("/student/:id")
  .post(authorizePermissions("student"), reviewByStudent);
export default evaluationRouter;
