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

import {
  validateCourseId,
  validateEvaluationInput,
  validateIdParams,
  ensureUserIsDepartmentHead,
  ensureUserIsPeer,
  ensureUserIsDepartmentMember,
} from "../middleware/validationMiddleware/evalutionValidation.js";
const evaluationRouter = express.Router();
evaluationRouter.route("/self").post(validateEvaluationInput, reviewBySelf);
evaluationRouter
  .route("/by-peer/:id")
  .post(
    validateIdParams,
    validateEvaluationInput,
    ensureUserIsPeer,
    reviewByPeer
  );
evaluationRouter
  .route("/by-head/:id")
  .post(
    authorizePermissions("head"),
    validateIdParams,
    ensureUserIsDepartmentMember,
    validateEvaluationInput,
    reviewByHead
  );
evaluationRouter
  .route("/by-dean/:id")
  .post(
    authorizePermissions("dean"),
    validateIdParams,
    ensureUserIsDepartmentHead,
    validateEvaluationInput,
    reviewByDean
  );
evaluationRouter
  .route("/by-team-leader/:id")
  .post(
    authorizePermissions("teamLeader"),
    validateIdParams,
    ensureUserIsDepartmentMember,
    validateEvaluationInput,
    reviewByTeamLeader
  );
evaluationRouter
  .route("/director/:id")
  .post(
    authorizePermissions("director"),
    validateIdParams,
    ensureUserIsDepartmentHead,
    validateEvaluationInput,
    reviewByDirector
  );
evaluationRouter
  .route("/student/:id")
  .post(
    authorizePermissions("student"),
    validateCourseId,
    validateEvaluationInput,
    reviewByStudent
  );
export default evaluationRouter;
