import { Request, Response } from "express";

export const studentAccessTest = (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Student role authorization successful.",
  });
};

export const adminAccessTest = (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Admin role authorization successful.",
  });
};
