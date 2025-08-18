// src/services/api.ts
import { type MealType, type UserType } from "../types";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    window.location.href = "/login";
    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

// ========== MEALS ==========

export const fetchMealsForDate = async (
  userId: number,
  date: string
): Promise<MealType[]> => {
  try {
    const res = await fetch(`/api/meals/${userId}/${date}`, {
      headers: getAuthHeaders(),
    }); 

    const data = await handleResponse(res);

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
  const res = await fetch(`/api/users/${userId}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

export const updateUserPreferences = async (
  userId: number,
  data: Partial<UserType>
): Promise<void> => {
  const res = await fetch(`/api/users/${userId}/preferences`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  await handleResponse(res);
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
