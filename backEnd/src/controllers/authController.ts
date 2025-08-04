import { Request, Response } from "express";
import {pool} from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken } from "../uitls/generateToken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, date_of_birth } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, date_of_birth)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, date_of_birth`,
      [name, email, hashedPassword, date_of_birth]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Registration error:", err); // 
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

