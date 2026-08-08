import { Router } from "express";
import {
  getAdminOverview,
  getRegistrationSettings,
  getStudents,
  exportStudents,
  clearStudentPasswordResetLimit,
  updateRegistrationSettings,
  updateStudentStatus,
} from "../controllers/adminController";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";

const router = Router();

router.use(authenticate, authorize("admin"));

router.get("/overview", getAdminOverview);
router.get("/students", getStudents);
router.get("/students/export", exportStudents);
router.patch("/students/:studentId/status", updateStudentStatus);
router.patch(
  "/students/:studentId/password-reset-limit",
  clearStudentPasswordResetLimit
);
router.get("/settings/registration", getRegistrationSettings);
router.patch("/settings/registration", updateRegistrationSettings);

export default router;
