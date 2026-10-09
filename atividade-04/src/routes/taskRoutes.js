import { Router } from "express";
import asyncHandler from "../middlewares/asyncHandler.js";
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  replaceTask,
  updateTask,
} from "../controllers/taskController.js";

const router = Router();

router.get("/", asyncHandler(listTasks));
router.get("/:id", asyncHandler(getTask));
router.post("/", asyncHandler(createTask));
router.put("/:id", asyncHandler(replaceTask));
router.patch("/:id", asyncHandler(updateTask));
router.delete("/:id", asyncHandler(deleteTask));

export default router;
