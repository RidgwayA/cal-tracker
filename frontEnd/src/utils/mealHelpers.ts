import { type MealType, type FoodType } from "../types";

export const addFoodToMeal = (
  meals: MealType[],
  mealId: number,
  newFood: FoodType
): MealType[] => {
  return meals.map(meal =>
    meal.id === mealId
      ? { ...meal, foods: [...(meal.foods || []), newFood] }
      : meal
  );
};

export const updateFoodInMeal = (
  meals: MealType[],
  mealId: number,
  updatedFood: FoodType
): MealType[] => {
  return meals.map(meal =>
    meal.id === mealId
      ? {
          ...meal,
          foods: (meal.foods || []).map(food =>
            food.id === updatedFood.id ? updatedFood : food
          )
        }
      : meal
  );
};

export const deleteFoodFromMeal = (
  meals: MealType[],
  mealId: number,
  foodId: number
): MealType[] => {
  return meals.map(meal =>
    meal.id === mealId
      ? {
          ...meal,
          foods: (meal.foods || []).filter(food => food.id !== foodId)
        }
      : meal
  );
};

export const deleteMeal = (
  meals: MealType[],
  mealId: number
): MealType[] => {
  return meals.filter(meal => meal.id !== mealId);
};
