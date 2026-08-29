import { Router } from "express";
import {
  getStudentRank,
  getStudentWeeklyStanding,
  updateStudentProfile,
} from "../controllers/studentController";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";

const router = Router();

router.use(authenticate, authorize("student"));

router.get("/weekly-rank", getStudentWeeklyStanding);
router.get("/rank", getStudentRank);
router.patch("/profile", updateStudentProfile);

export default router;
