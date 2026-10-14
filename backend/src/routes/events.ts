import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { AUTH_COOKIE_NAME } from "../utils/authCookie";
import { getStudentEvents, registerForEvent } from "../controllers/eventController";

const router = Router();
// Missing credentials are allowed; supplied credentials must still be valid.
router.use((req, res, next) => {
  if (req.headers.authorization !== undefined || req.cookies?.[AUTH_COOKIE_NAME] !== undefined) {
    return authenticate(req, res, next);
  }
  return next();
});
router.get("/", getStudentEvents);
router.post("/:eventId/register", registerForEvent);
export default router;
