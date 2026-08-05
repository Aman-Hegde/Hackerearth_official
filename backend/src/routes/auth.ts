import { Router, Request, Response } from "express";
import {
  adminAccessTest,
  studentAccessTest,
} from "../controllers/accessTestController";
import { loginUser } from "../controllers/loginController";
import {
  registerStudent,
  requestRegistrationOtp,
  resendRegistrationOtp,
  verifyRegistrationOtp,
} from "../controllers/registrationController";
import { getCurrentUser, logoutUser } from "../controllers/sessionController";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { requireRegistrationOpen } from "../middleware/requireRegistrationOpen";

const router = Router();

const passwordResetUnavailable = (_req: Request, res: Response) => {
  return res.status(503).json({
    success: false,
    code: "PASSWORD_RESET_TEMPORARILY_UNAVAILABLE",
    message:
      "Password reset by email is temporarily unavailable. Please contact a HackerEarth Hub administrator.",
  });
};

router.post("/google", (_req: Request, res: Response) => {
  return res.status(501).json({
    success: false,
    message: "Google authentication has not yet been implemented.",
  });
});

router.post("/register", requireRegistrationOpen, registerStudent);

router.post(
  "/register/request-otp",
  requireRegistrationOpen,
  requestRegistrationOtp
);

router.post("/register/resend-otp", resendRegistrationOtp);

router.post("/register/verify-otp", verifyRegistrationOtp);

router.post("/forgot-password/request-otp", passwordResetUnavailable);

router.post("/forgot-password/resend-otp", passwordResetUnavailable);

router.post("/forgot-password/verify-otp", passwordResetUnavailable);

router.post("/forgot-password/change-password", passwordResetUnavailable);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.get("/me", authenticate, getCurrentUser);

router.get(
  "/test/student",
  authenticate,
  authorize("student", "admin"),
  studentAccessTest
);

router.get("/test/admin", authenticate, authorize("admin"), adminAccessTest);

export default router;
