import { Router, Request, Response } from "express";
import {
  adminAccessTest,
  studentAccessTest,
} from "../controllers/accessTestController";
import { loginUser } from "../controllers/loginController";
import {
  requestRegistrationOtp,
  resendRegistrationOtp,
  verifyRegistrationOtp,
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

const router = Router();

router.post("/google", (_req: Request, res: Response) => {
  return res.status(501).json({
    success: false,
    message: "Google authentication has not yet been implemented.",
  });
});

router.post("/register/request-otp", requestRegistrationOtp);

router.post("/register/resend-otp", resendRegistrationOtp);

router.post("/register/verify-otp", verifyRegistrationOtp);

router.post("/forgot-password/request-otp", requestForgotPasswordOtp);

router.post("/forgot-password/resend-otp", resendForgotPasswordOtp);

router.post("/forgot-password/verify-otp", verifyForgotPasswordOtp);

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
