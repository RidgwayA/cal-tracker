export type FoodType = {
  name: string;
  id: number;
  meal_id: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size: string;
  serving_count: number;
};

export type MealType = {
  id: number;
  meal_name: string;
  user_id: number;
  date: string;
  total_calories?: number;
  foods: FoodType[];
};

export type UserType = {
  id: number;
  name: string;
  email: string;
  date_of_birth: string;
  daily_calorie_goal: number;
  daily_protein_goal: number;
};