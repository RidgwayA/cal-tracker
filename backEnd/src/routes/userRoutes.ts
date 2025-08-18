import express from "express";
import { getUserById, updateUserPreferences } from "../controllers/userController";
import { validateUserPreferences } from "../middleware/validation";

const router = express.Router();

// Get user by ID
router.get("/:id", getUserById);

// Update user preferences with validation
router.put("/:id/preferences", validateUserPreferences, updateUserPreferences);

export default router;
