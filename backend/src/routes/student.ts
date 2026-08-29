import { Router } from "express";
import {
  getStudentDomainGroups,
  getStudentRank,
  updateStudentProfile,
} from "../controllers/studentController";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";

const router = Router();

router.use(authenticate, authorize("student"));

router.get("/domain-groups", getStudentDomainGroups);
router.get("/rank", getStudentRank);
router.patch("/profile", updateStudentProfile);

export default router;
