import express from "express";
import { addFoodToMeal, getFoodsByMeal, updateFood, deleteFood } from "../controllers/foodController";
import { validateFood } from "../middleware/validation";

const router = express.Router();

// Add food to a meal by ID
router.post("/:mealId", validateFood, addFoodToMeal);

// Get foods for a meal
router.get("/:mealId", getFoodsByMeal);

// Update a specific food item
router.put("/:foodId", validateFood, updateFood);

// Delete a specific food item
router.delete("/:foodId", deleteFood);

export default router;