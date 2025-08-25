import { Request, Response } from "express";
import { pool } from "../db";
import { AuthRequest } from "../auth/requireAuth";

// Helper function to update meal total calories
const updateMealTotalCalories = async (mealId: number) => {
  try {
    const result = await pool.query(
      "SELECT SUM(calories) as total FROM foods WHERE meal_id = $1",
      [mealId]
    );
    
    const totalCalories = result.rows[0].total || 0;
    
    await pool.query(
      "UPDATE meals SET total_calories = $1 WHERE id = $2",
      [totalCalories, mealId]
    );
    
    return totalCalories;
  } catch (error) {
    console.error("Error updating meal total calories:", error);
    throw error;
  }
};

// POST /api/foods/:mealId
export const addFoodToMeal = async (req: AuthRequest, res: Response) => {
  const { mealId } = req.params;
  const { name, calories, protein, carbs = 0, fat = 0, serving_size, serving_count } = req.body;
  const authenticatedUserId = req.user?.id;

  try {
    // First check if the meal belongs to the authenticated user
    const mealOwnerResult = await pool.query(
      "SELECT user_id FROM meals WHERE id = $1",
      [mealId]
    );

    if (mealOwnerResult.rows.length === 0) {
      return res.status(404).json({ error: "Meal not found" });
    }

    const mealOwnerId = mealOwnerResult.rows[0].user_id;
    if (mealOwnerId !== authenticatedUserId) {
      return res.status(403).json({ error: "Access denied: You can only add foods to your own meals" });
    }
    // Insert the new food
    const result = await pool.query(
      `INSERT INTO foods (meal_id, user_id, name, calories, protein, carbs, fat, serving_size, serving_count)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [mealId, authenticatedUserId, name, calories, protein, carbs, fat, serving_size, serving_count]
    );

    // Update the meal's total calories
    await updateMealTotalCalories(Number(mealId));

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding food:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/foods/:mealId
export const getFoodsByMeal = async (req: AuthRequest, res: Response) => {
  const { mealId } = req.params;
  const authenticatedUserId = req.user?.id;

  try {
    // First check if the meal belongs to the authenticated user
    const mealOwnerResult = await pool.query(
      "SELECT user_id FROM meals WHERE id = $1",
      [mealId]
    );

    if (mealOwnerResult.rows.length === 0) {
      return res.status(404).json({ error: "Meal not found" });
    }

    const mealOwnerId = mealOwnerResult.rows[0].user_id;
    if (mealOwnerId !== authenticatedUserId) {
      return res.status(403).json({ error: "Access denied: You can only view foods from your own meals" });
    }
    const result = await pool.query(
      "SELECT * FROM foods WHERE meal_id = $1",
      [mealId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching foods:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT /api/foods/:foodId
export const updateFood = async (req: AuthRequest, res: Response) => {
  const { foodId } = req.params;
  const { name, calories, protein, carbs = 0, fat = 0, serving_size, serving_count } = req.body;
  const authenticatedUserId = req.user?.id;

  try {
    // First get the meal_id and check ownership
    const foodResult = await pool.query(
      "SELECT f.meal_id, m.user_id FROM foods f JOIN meals m ON f.meal_id = m.id WHERE f.id = $1",
      [foodId]
    );

    if (foodResult.rows.length === 0) {
      return res.status(404).json({ error: "Food item not found" });
    }

    const { meal_id: mealId, user_id: mealOwnerId } = foodResult.rows[0];
    
    // Authorization check
    if (mealOwnerId !== authenticatedUserId) {
      return res.status(403).json({ error: "Access denied: You can only update foods in your own meals" });
    }

    // Update the food
    const result = await pool.query(
      `UPDATE foods 
       SET name = $1, calories = $2, protein = $3, carbs = $4, fat = $5, serving_size = $6, serving_count = $7
       WHERE id = $8
       RETURNING *`,
      [name, calories, protein, carbs, fat, serving_size, serving_count, foodId]
    );

    // Update the meal's total calories
    await updateMealTotalCalories(mealId);

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating food:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE /api/foods/:foodId
export const deleteFood = async (req: AuthRequest, res: Response) => {
  const { foodId } = req.params;
  const authenticatedUserId = req.user?.id;

  try {
    // First get the meal_id and check ownership
    const foodResult = await pool.query(
      "SELECT f.meal_id, m.user_id FROM foods f JOIN meals m ON f.meal_id = m.id WHERE f.id = $1",
      [foodId]
    );

    if (foodResult.rows.length === 0) {
      return res.status(404).json({ error: "Food item not found" });
    }

    const { meal_id: mealId, user_id: mealOwnerId } = foodResult.rows[0];
    
    // Authorization check
    if (mealOwnerId !== authenticatedUserId) {
      return res.status(403).json({ error: "Access denied: You can only delete foods from your own meals" });
    }

    // Delete the food
    const result = await pool.query(
      "DELETE FROM foods WHERE id = $1 RETURNING *",
      [foodId]
    );

    // Update the meal's total calories
    await updateMealTotalCalories(mealId);

    res.status(200).json({ message: "Food item deleted successfully" });
  } catch (err) {
    console.error("Error deleting food:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/foods/user/saved - Get all unique food items for a user
export const getUserSavedFoods = async (req: AuthRequest, res: Response) => {
  const authenticatedUserId = req.user?.id;

  try {
    // Get distinct food items for the user, ordered by most recent
    const result = await pool.query(
      `SELECT DISTINCT ON (name, serving_size) 
       id, name, calories, protein, carbs, fat, serving_size, created_at
       FROM foods 
       WHERE user_id = $1 
       ORDER BY name, serving_size, created_at DESC`,
      [authenticatedUserId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching saved foods:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};