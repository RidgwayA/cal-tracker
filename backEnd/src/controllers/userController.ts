import { Request, Response } from "express";
import { pool } from "../db";


export const getUserById = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);

  try {
    const result = await pool.query(
      "SELECT id, name, email, date_of_birth, daily_calorie_goal FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const updateUserPreferences = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const { name, email, date_of_birth, daily_calorie_goal } = req.body;

  const fieldsToUpdate = [];
  const values = [];
  let paramIndex = 1;

  if (name) {
    fieldsToUpdate.push(`name = $${paramIndex++}`);
    values.push(name);
  }
  if (email) {
    fieldsToUpdate.push(`email = $${paramIndex++}`);
    values.push(email);
  }
  if (date_of_birth) {
    fieldsToUpdate.push(`date_of_birth = $${paramIndex++}`);
    values.push(date_of_birth);
  }
  if (daily_calorie_goal !== undefined) {
    fieldsToUpdate.push(`daily_calorie_goal = $${paramIndex++}`);
    values.push(daily_calorie_goal);
  }

  if (fieldsToUpdate.length === 0) {
    return res.status(400).json({ error: "No valid fields provided" });
  }

  const query = `UPDATE users SET ${fieldsToUpdate.join(", ")} WHERE id = $${paramIndex}`;
  values.push(userId);

  try {
    await pool.query(query, values);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update" });
  }
};
