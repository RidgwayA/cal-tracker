import express from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { forgotPassword, resetPassword } from "../controllers/forgotPassword";


const router = express.Router();


router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/request-reset", forgotPassword);

router.post("/reset-password", resetPassword);

export default router;
