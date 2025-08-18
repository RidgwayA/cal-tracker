import express from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { forgotPassword, resetPassword } from "../controllers/forgotPassword";
import { 
  validateRegistration, 
  validateLogin, 
  validatePasswordReset, 
  validateNewPassword 
} from "../middleware/validation";

const router = express.Router();

router.post("/register", validateRegistration, registerUser);

router.post("/login", validateLogin, loginUser);

router.post("/request-reset", validatePasswordReset, forgotPassword);

router.post("/reset-password", validateNewPassword, resetPassword);

export default router;
