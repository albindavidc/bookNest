import { Request, Response, NextFunction } from "express";

export const ensureAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if ((req.session as any)?.isAuthenticated) {
    next();
    return;
  }
  res.status(401).json({
    message: "Unauthorized. Please login with other email IDs",
  });
  return;
};
