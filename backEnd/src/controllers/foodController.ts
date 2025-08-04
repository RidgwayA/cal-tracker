import { Request, Response } from "express";
import { pool } from "../db";

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
export const addFoodToMeal = async (req: Request, res: Response) => {
  const { mealId } = req.params;
  const { name, calories, protein, carbs, fat } = req.body;

  try {
    // Insert the new food
    const result = await pool.query(
      `INSERT INTO foods (meal_id, name, calories, protein, carbs, fat)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [mealId, name, calories, protein, carbs, fat]
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
export const getFoodsByMeal = async (req: Request, res: Response) => {
  const { mealId } = req.params;

  try {
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
export const updateFood = async (req: Request, res: Response) => {
  const { foodId } = req.params;
  const { name, calories, protein, carbs, fat } = req.body;

  try {
    // First get the meal_id for this food
    const foodResult = await pool.query(
      "SELECT meal_id FROM foods WHERE id = $1",
      [foodId]
    );

    if (foodResult.rows.length === 0) {
      return res.status(404).json({ error: "Food item not found" });
    }

    const mealId = foodResult.rows[0].meal_id;

    // Update the food
    const result = await pool.query(
      `UPDATE foods 
       SET name = $1, calories = $2, protein = $3, carbs = $4, fat = $5
       WHERE id = $6
       RETURNING *`,
      [name, calories, protein, carbs, fat, foodId]
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
export const deleteFood = async (req: Request, res: Response) => {
  const { foodId } = req.params;

  try {
    // First get the meal_id for this food
    const foodResult = await pool.query(
      "SELECT meal_id FROM foods WHERE id = $1",
      [foodId]
    );

    if (foodResult.rows.length === 0) {
      return res.status(404).json({ error: "Food item not found" });
    }

    const mealId = foodResult.rows[0].meal_id;

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