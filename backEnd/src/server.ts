
import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import mealRoutes from "./routes/mealRoutes";
import foodRoutes from "./routes/foodRoutes";
import authRoutes from "./routes/authRoutes";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/auth", authRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "API is running 🚀", timestamp: new Date().toISOString() });
});

// Only serve static files in production (Docker)
if (process.env.NODE_ENV === 'production') {
  
  const publicPath = path.join(__dirname, '..', 'public');
  const indexPath = path.join(publicPath, 'index.html');
  

  const fs = require('fs');
  if (!fs.existsSync(publicPath)) {
    console.error("❌ Public directory does not exist:", publicPath);
  } else {
    if (!fs.existsSync(indexPath)) {
      console.error("❌ index.html does not exist:", indexPath);
    } else {
      console.log("✅ index.html exists");
    }
  }
  
  // Serve static files from the frontend build
  app.use(express.static(publicPath));

  // Handle React Router routes - send index.html for any non-API routes
  app.use((req, res, next) => {
    // If it's an API route that doesn't exist, return 404
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    // For all other routes, serve React app
    // console.log(`Serving index.html for route: ${req.path}`);
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('Error serving index.html:', err);
        console.error('Attempted path:', indexPath);
        res.status(500).json({ 
          error: 'Error serving page',
          details: err.message,
          path: indexPath 
        });
      }
    });
  });
} else {
  // Development mode - just show API status
  app.get("/", (req, res) => {
    res.json({ 
      message: "API is running", 
      mode: "development",
      note: "Frontend should be running on Vite dev server: http://localhost:5173"
    });
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Dev Mode: Frontend should be at http://localhost:5173`);
  }
});