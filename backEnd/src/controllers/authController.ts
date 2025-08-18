import { Request, Response } from "express";
import {pool} from "../db";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken";

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, date_of_birth, daily_calorie_goal, daily_protein_goal } = req.body;

  try {
    // Check if user already exists
    const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    // Hash password with stronger salt rounds
    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, date_of_birth, daily_calorie_goal, daily_protein_goal)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, date_of_birth, daily_calorie_goal, daily_protein_goal`,
      [name, email, hashedPassword, date_of_birth, daily_calorie_goal, daily_protein_goal]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Registration error:", process.env.NODE_ENV === 'development' ? err : 'Registration failed');
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

    // Remove password from user object before sending response
    const { password: _, ...userWithoutPassword } = user;
    const token = generateToken(user.id);
    
    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error("Login error:", process.env.NODE_ENV === 'development' ? err : 'Login failed');
    res.status(500).json({ error: "Login failed" });
  }
};

