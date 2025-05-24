import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/express";
import jwt from "jsonwebtoken";

const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  // const authHeader = req.headers.authorization;
  // if (!authHeader?.startsWith("Bearer ")) {
  //   res.status(401).json({ error: "Unauthorized: No token provided" });
  //   return;
  // }

  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    req.userId = payload.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

export default requireAuth;
