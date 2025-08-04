-- Calorie Tracker Database Schema

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    daily_calorie_goal INTEGER DEFAULT 2000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create meals table
CREATE TABLE meals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    meal_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    total_calories INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create foods table
CREATE TABLE foods (
    id SERIAL PRIMARY KEY,
    meal_id INTEGER REFERENCES meals(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    calories INTEGER NOT NULL,
    protein INTEGER DEFAULT 0,
    carbs INTEGER DEFAULT 0,
    fat INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);