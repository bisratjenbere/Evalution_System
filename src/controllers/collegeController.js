import College from "../models/collegModel.js";
import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from "./handleFactory.js";

export const getAllColleges = getAll(College);

export const createCollege = createOne(College);

export const getCollege = getOne(College);

export const updateCollege = updateOne(College);

export const deleteCollege = deleteOne(College);
