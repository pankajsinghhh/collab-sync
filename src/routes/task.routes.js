import { Router } from "express";
import {
  createTask,
  deleteTask,
  deleteSubTask,
  getTaskById,
  getTasks,
  updateTask,
  updateSubTask,
  createSubTask,
} from "../controllers/task.controllers.js";
import {
  verifyJWT,
  validateProjectPermission,
} from "../middlewares/auth.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJWT);

router
  .route("/:projectId/tasks")
  .get(validateProjectPermission(AvailableUserRole), getTasks)
  .post(
    validateProjectPermission(AvailableUserRole),
    upload.array("attachments", 5),
    createTask,
  );

router
  .route("/:projectId/tasks/:taskId")
  .get(validateProjectPermission(AvailableUserRole), getTaskById)
  .put(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    upload.array("attachments", 5),
    updateTask,
  )
  .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteTask);

router
  .route("/:projectId/tasks/:taskId/subtasks")
  .post(validateProjectPermission(AvailableUserRole), createSubTask);

router
  .route("/:projectId/tasks/:taskId/subtasks/:subtaskId")
  .put(validateProjectPermission(AvailableUserRole), updateSubTask)
  .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteSubTask);

export default router;