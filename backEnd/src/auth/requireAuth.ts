import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface JwtPayload {
  id: number;
  email?: string; 

}

interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
      req.user = decoded;
      next();
    } catch (err) {
      console.error("JWT verification error:", err);
      return res.status(401).json({ error: "Not authorized" });
    }
  } else {
    return res.status(401).json({ error: "No token provided" });
  }
};
