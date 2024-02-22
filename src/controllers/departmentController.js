import Department from "../models/departmentModel.js";
import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from "./handleFactory.js";

export const deleteDepartment = deleteOne(Department);
export const updateDepartment = updateOne(Department);
export const createDepartment = createOne(Department);
export const getDepartment = getOne(Department, [
  { path: "departmentHead" },
  { path: "collegeId" },
]);
export const getAllDepartment = getAll(Department);
