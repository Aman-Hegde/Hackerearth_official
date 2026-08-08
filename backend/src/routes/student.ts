import { Router } from "express";
import { getStudentDomainGroups } from "../controllers/studentController";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";

const router = Router();

router.use(authenticate, authorize("student"));

router.get("/domain-groups", getStudentDomainGroups);

export default router;
