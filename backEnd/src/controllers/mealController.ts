import { Request, Response } from "express";
import { pool } from "../db";

export const getMealsByUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Get only today's meals for the user
    const mealsResult = await pool.query(
      "SELECT * FROM meals WHERE user_id = $1 AND date = $2 ORDER BY date DESC",
      [userId, today]
    );
    
    const meals = mealsResult.rows;

    if (meals.length === 0) {
      return res.status(200).json([]);
    }

    // Get all meal IDs to fetch foods in one query
    const mealIds = meals.map(meal => meal.id);
    
    // Fetch all foods for these meals
    const foodsResult = await pool.query(
      "SELECT * FROM foods WHERE meal_id = ANY($1::int[])",
      [mealIds]
    );

    // Group foods by meal_id
    const foodsByMeal = foodsResult.rows.reduce((acc, food) => {
      if (!acc[food.meal_id]) {
        acc[food.meal_id] = [];
      }
      acc[food.meal_id].push(food);
      return acc;
    }, {} as Record<number, any[]>);

    // Attach foods to their respective meals and ensure total_calories is accurate
    const mealsWithFoods = meals.map(meal => {
      const mealFoods = foodsByMeal[meal.id] || [];
      const calculatedTotal = mealFoods.reduce((sum, food) => sum + food.calories, 0);
      
      // If the stored total_calories doesn't match calculated, update it
      if (meal.total_calories !== calculatedTotal) {
        pool.query(
          "UPDATE meals SET total_calories = $1 WHERE id = $2",
          [calculatedTotal, meal.id]
        ).catch(err => console.error("Error updating meal total:", err));
        
        meal.total_calories = calculatedTotal;
      }
      
      return {
        ...meal,
        foods: mealFoods
      };
    });

    res.status(200).json(mealsWithFoods);
  } catch (error) {
    console.error("Error fetching meals:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addMeal = async (req: Request, res: Response) => {
  const { user_id, meal_name, date } = req.body;

  if (!user_id || !meal_name) {
    return res.status(400).json({ error: "Missing fields in request body" });
  }

  try {
    // Use provided date or default to today
    const mealDate = date || new Date().toISOString().split('T')[0];
    
    const result = await pool.query(
      `INSERT INTO meals (user_id, meal_name, date, total_calories)
       VALUES ($1, $2, $3, 0) RETURNING *`,
      [user_id, meal_name, mealDate]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding meal:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMeal = async (req: Request, res: Response) => {
  const { mealId } = req.params;

  try {
    // First delete all foods associated with this meal
    await pool.query("DELETE FROM foods WHERE meal_id = $1", [mealId]);
    
    // Then delete the meal itself
    const result = await pool.query(
      "DELETE FROM meals WHERE id = $1 RETURNING *",
      [mealId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Meal not found" });
    }

    res.status(200).json({ message: "Meal and associated foods deleted successfully" });
  } catch (error) {
    console.error("Error deleting meal:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// NEW: Get meals for a specific date (for future date navigation feature)
export const getMealsByUserAndDate = async (req: Request, res: Response) => {
  const { userId, date } = req.params;
  // console.log("[DEBUG] Fetching meals for user:", userId, "on date:", date);

  try {
    const mealsResult = await pool.query(
      "SELECT * FROM meals WHERE user_id = $1 AND date = $2 ORDER BY date DESC",
      [userId, date]
    );
    
    const meals = mealsResult.rows;

    if (meals.length === 0) {
      return res.status(200).json([]);
    }

    // Get all meal IDs to fetch foods in one query
    const mealIds = meals.map(meal => meal.id);
    
    // Fetch all foods for these meals
    const foodsResult = await pool.query(
      "SELECT * FROM foods WHERE meal_id = ANY($1::int[])",
      [mealIds]
    );

    // Group foods by meal_id
    const foodsByMeal = foodsResult.rows.reduce((acc, food) => {
      if (!acc[food.meal_id]) {
        acc[food.meal_id] = [];
      }
      acc[food.meal_id].push(food);
      return acc;
    }, {} as Record<number, any[]>);

    // Attach foods to their respective meals
    const mealsWithFoods = meals.map(meal => ({
      ...meal,
      foods: foodsByMeal[meal.id] || []
    }));

    res.status(200).json(mealsWithFoods);
  } catch (error) {
    console.error("Error fetching meals:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};