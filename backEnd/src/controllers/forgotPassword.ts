// // controllers/forgotPassword.ts
// import { Request, Response } from "express";
// import { pool } from "../db";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// // FIX: correct the path typo from ../uitls/mailer -> ../utils/mailer
// import { sendResetEmail } from "../uitls/mailer";

// const JWT_SECRET = process.env.JWT_SECRET;
// if (!JWT_SECRET) {
//   // Fail fast at boot if missing; prevents silent undefined secrets
//   throw new Error("JWT_SECRET is not set");
// }
// const RESET_SECRET = `${JWT_SECRET}_reset`;

// /** Safely build an absolute reset link like:
//  *   http://localhost:5173/reset-password/<token>
//  * Uses WHATWG URL to avoid "undefined" host or double-slash issues.
//  */
// function buildResetLink(token: string): string {
//   const base = process.env.FRONTEND_URL;
//   if (!base) {
//     throw new Error("FRONTEND_URL is not set");
//   }
//   let url: URL;
//   try {
//     url = new URL(base); // throws if invalid
//   } catch {
//     throw new Error("FRONTEND_URL is invalid");
//   }

//   // Normalize and append path segments safely
//   const basePath = url.pathname.replace(/\/+$/, ""); // strip trailing slash
//   url.pathname = `${basePath}/reset-password/${encodeURIComponent(token)}`;

//   return url.toString();
// }

// export const forgotPassword = async (req: Request, res: Response) => {
//   try {
//     const { email } = req.body;

//     // Lookup user
//     const userResult = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
//     const user = userResult.rows[0];

//     // (Optional, but recommended): do NOT reveal whether the email exists.
//     // If you prefer your old behavior, change this back to a 400 + message.
//     if (!user) {
//       return res
//         .status(200)
//         .json({ message: "If the email exists, a reset link has been sent." });
//     }

//     // Create short-lived token
//     const token = jwt.sign({ id: user.id }, RESET_SECRET, { expiresIn: "15m" });

//     // Build a safe absolute link
//     const resetLink = buildResetLink(token);

//     // Send email
//     await sendResetEmail(email, resetLink);

//     return res
//       .status(200)
//       .json({ message: "If the email exists, a reset link has been sent." });
//   } catch (err: any) {
//     // Surface misconfiguration clearly; keep generic error for others
//     const msg = err?.message || "Server error";
//     const isConfigError =
//       msg.includes("FRONTEND_URL") || msg.includes("JWT_SECRET") || msg.includes("invalid");

//     if (isConfigError) {
//       return res.status(500).json({ error: msg });
//     }
//     console.error("forgotPassword error:", err);
//     return res.status(500).json({ error: "Failed to send reset email." });
//   }
// };

// export const resetPassword = async (req: Request, res: Response) => {
//   try {
//     const { token, password, newPassword } = req.body;

//     if (!token) {
//       return res.status(400).json({ error: "Token missing" });
//     }

//     const decoded = jwt.verify(token, RESET_SECRET) as { id: number };

//     const rawNew = newPassword ?? password;
//     if (!rawNew) {
//       return res.status(400).json({ error: "Missing new password" });
//     }

//     const hashed = await bcrypt.hash(rawNew, 10);
//     await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashed, decoded.id]);

//     return res.status(200).json({ message: "Password reset successful" });
//   } catch (error) {
//     console.error("Reset error:", error);
//     return res.status(400).json({ error: "Invalid or expired token" });
//   }
// };


// backEnd/src/controllers/forgotPassword.ts
import { Request, Response } from "express";
import { pool } from "../db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendResetEmail } from "../utils/mailer"; // NOTE: utils (not 'uitls')
import { buildResetLinkFromRequest } from "../utils/url";
import dotenv from "dotenv"

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not set");
const RESET_SECRET = `${JWT_SECRET}_reset`;

// POST /api/auth/request-reset
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Silent lookup to avoid account enumeration
    const result = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (user) {
      const token = jwt.sign({ id: user.id }, RESET_SECRET, { expiresIn: "15m" });
      const resetLink = buildResetLinkFromRequest(req, token); // auto-detected base URL
      await sendResetEmail(email, resetLink);
    }

    return res.status(200).json({
      message: "If the email exists, a reset link has been sent.",
    });
  } catch (err) {
    console.error("forgotPassword error:", err);
    return res.status(500).json({ error: "Failed to send reset email." });
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password, newPassword } = req.body;
    if (!token) return res.status(400).json({ error: "Token missing" });

    const { id } = jwt.verify(token, RESET_SECRET) as { id: number };
    const rawNew = newPassword ?? password;
    if (!rawNew) return res.status(400).json({ error: "Missing new password" });

    const hashed = await bcrypt.hash(rawNew, 10);
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashed, id]);

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset error:", error);
    return res.status(400).json({ error: "Invalid or expired token" });
  }
};
