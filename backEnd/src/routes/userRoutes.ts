import express from "express";
import { getUserById, updateUserPreferences, } from "../controllers/userController";
import bcrypt from "bcrypt";
import { pool } from "../db";

const router = express.Router();

// Use controller functions
router.get("/:id", getUserById);
router.put("/:id/preferences", updateUserPreferences);

// ⬇️ Register route (copy of what's in full controller)
router.post("/register", async (req, res) => {
  const { name, email, password, date_of_birth, daily_calorie_goal } = req.body;

  try {
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, date_of_birth, daily_calorie_goal)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name`,
      [name, email, hashedPassword, date_of_birth, daily_calorie_goal]
    );

    res.status(201).json({
      message: "User registered",
      userId: result.rows[0].id,
      name: result.rows[0].name,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
