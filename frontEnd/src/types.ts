export type FoodType = {
  name: string;
  id: number;
  meal_id: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
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
};