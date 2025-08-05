// src/services/api.ts
import { type MealType, type UserType } from "../types";

// ========== MEALS ==========

export const fetchMealsForDate = async (
  userId: number,
  date: string
): Promise<MealType[]> => {
  try {
    const res = await fetch(`/api/meals/${userId}/${date}`); 

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("Expected array, got:", data);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error fetching meals:", error);
    return [];
  }
};

// ========== USER ==========

export const getUserById = async (userId: number): Promise<UserType> => {
  const res = await fetch(`/api/users/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};

export const updateUserPreferences = async (
  userId: number,
  data: Partial<UserType>
): Promise<void> => {
  const res = await fetch(`/api/users/${userId}/preferences`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update preferences");
};

// ========== AUTH ==========

export const loginUser = async (email: string, password: string) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Login failed");
  }

  return response.json();
};
