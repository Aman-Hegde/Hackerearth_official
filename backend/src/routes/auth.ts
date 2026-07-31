import { Router, Request, Response } from "express";

const router = Router();

router.post("/google", (_req: Request, res: Response) => {
  return res.status(501).json({
    message: "Google authentication has not yet been implemented.",
  });
});

export default router;
