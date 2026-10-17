import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { AUTH_COOKIE_NAME } from "../utils/authCookie";
import { getStudentEvents, registerForEvent } from "../controllers/eventController";
import {
  createEventTeam,
  getMyEventTeam,
  joinEventTeam,
  previewEventTeamInvitation,
} from "../controllers/eventTeamController";
import {
  invitationPreviewRateLimit,
  publicTeamRegistrationRateLimit,
} from "../middleware/eventTeamRateLimit";

const router = Router();
// Missing credentials are allowed; supplied credentials must still be valid.
router.use((req, res, next) => {
  if (req.headers.authorization !== undefined || req.cookies?.[AUTH_COOKIE_NAME] !== undefined) {
    return authenticate(req, res, next);
  }
  return next();
});
router.get("/", getStudentEvents);
router.get("/:eventId/team", getMyEventTeam);
router.get(
  "/:eventId/teams/invitations/:invitationCode",
  invitationPreviewRateLimit,
  previewEventTeamInvitation
);
router.post(
  "/:eventId/teams",
  publicTeamRegistrationRateLimit,
  createEventTeam
);
router.post(
  "/:eventId/teams/join",
  publicTeamRegistrationRateLimit,
  joinEventTeam
);
router.post("/:eventId/register", registerForEvent);
export default router;
