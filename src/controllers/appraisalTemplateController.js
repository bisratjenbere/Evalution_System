import AppraisalTemplate from "../models/apprisalTempleteModel.js";
import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from "./handleFactory.js";

export const getAllAppraisalTemplates = getAll(AppraisalTemplate);

export const createAppraisalTemplate = createOne(AppraisalTemplate);

export const getAppraisalTemplate = getOne(AppraisalTemplate);

export const updateAppraisalTemplate = updateOne(AppraisalTemplate);

export const deleteAppraisalTemplate = deleteOne(AppraisalTemplate);
