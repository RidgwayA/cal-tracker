
import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import userRoutes from "./routes/userRoutes";
import mealRoutes from "./routes/mealRoutes";
import foodRoutes from "./routes/foodRoutes";
import authRoutes from "./routes/authRoutes";
import { protect } from "./auth/requireAuth";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
      fontSrc: ["'self'"],
      connectSrc: ["'self'"],
    }
  },
  crossOriginEmbedderPolicy: false // Allow serving React app
}));

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window per IP
  message: { error: 'Too many authentication attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window per IP
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' })); // Add size limit

// API Routes with rate limiting
app.use("/api/auth", authLimiter, authRoutes); // Auth routes with strict rate limiting
app.use("/api/users", apiLimiter, protect, userRoutes); // Protected with general rate limiting
app.use("/api/meals", apiLimiter, protect, mealRoutes); // Protected with general rate limiting
app.use("/api/foods", apiLimiter, protect, foodRoutes); // Protected with general rate limiting

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