import { Role } from "@/services/token.service";
import "express";
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      role?: Role;
    }
  }
}
