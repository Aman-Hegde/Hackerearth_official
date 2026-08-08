import { Router, Request, Response } from "express";
import {
  adminAccessTest,
  studentAccessTest,
} from "../controllers/accessTestController";
import { loginUser } from "../controllers/loginController";
import {
  registerStudent,
} from "../controllers/registrationController";
import {
  changeForgottenPassword,
  requestForgotPasswordOtp,
  resendForgotPasswordOtp,
  verifyForgotPasswordOtp,
} from "../controllers/passwordController";
import { getCurrentUser, logoutUser } from "../controllers/sessionController";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { forgotPasswordRateLimit } from "../middleware/forgotPasswordRateLimit";
import { requireRegistrationOpen } from "../middleware/requireRegistrationOpen";

const router = Router();

router.post("/google", (_req: Request, res: Response) => {
  return res.status(501).json({
    success: false,
    message: "Google authentication has not yet been implemented.",
  });
});

router.post("/register", requireRegistrationOpen, registerStudent);

router.post(
  "/forgot-password/request-otp",
  forgotPasswordRateLimit,
  requestForgotPasswordOtp
);

router.post(
  "/forgot-password/resend-otp",
  forgotPasswordRateLimit,
  resendForgotPasswordOtp
);

router.post(
  "/forgot-password/verify-otp",
  forgotPasswordRateLimit,
  verifyForgotPasswordOtp
);

router.post("/forgot-password/change-password", changeForgottenPassword);

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
