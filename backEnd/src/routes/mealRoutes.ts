import { Router } from "express";
import {
  addMeal,
  deleteMeal,
  getMealsByUser,
  getMealsByUserAndDate,
} from "../controllers/mealController";

const router = Router();

// Add a new meal
router.post("/", addMeal);

// Delete a meal and all its foods
router.delete("/:mealId", deleteMeal);

// Get all meals for a user
router.get("/user/:userId", getMealsByUser);

// Get meals for a user on a specific date
// router.get("/user/:userId/date/:date", getMealsByUserAndDate);
router.get("/:userId/:date", getMealsByUserAndDate);


export default router;
