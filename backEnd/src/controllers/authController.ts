import { Request, Response } from "express";
import {pool} from "../db";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken";

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, date_of_birth, daily_calorie_goal, daily_protein_goal } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, date_of_birth, daily_calorie_goal, daily_protein_goal)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, date_of_birth, daily_calorie_goal, daily_protein_goal`,
      [name, email, hashedPassword, date_of_birth, daily_calorie_goal, daily_protein_goal]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Registration error:", err); 
    res.status(500).json({ error: "Registration failed" });
  }
};


export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(user.id);
    res.json({ token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

