import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_USER || "thisisasecret";

export interface CustomRequest extends Request {
  id?: string;
}

export function AuthMiddleware(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decodedData = jwt.verify(token, JWT_SECRET) as { id: string };
    req.id = decodedData.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}
