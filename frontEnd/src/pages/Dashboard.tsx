import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  addFoodToMeal,
  updateFoodInMeal,
  deleteFoodFromMeal,
  deleteMeal,
} from "../utils/mealHelpers";
import {
  getTodayDate,
  isToday as isTodayDate,
  formatReadableDate,
} from "../utils/dateUtils";
import { fetchMealsForDate, getUserById } from "../services/api";

import CalorieGoalDisplay from "../components/CalorieGoalDisplay";
import CalorieCurrentDisplay from "../components/CalorieCurrentDisplay";
import CalorieProgressDisplay from "../components/CalorieProgressDisplay";
import AddMealBtn from "../components/AddMealBtn";
import MealCard from "../components/MealCard/MealCard";
import DateNavigation from "../components/DateNavigation";

import { type MealType, type FoodType } from "../types";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [meals, setMeals] = useState<MealType[]>([]);
  const [calorieGoal, setCalorieGoal] = useState<number>(2000);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const userIdNum = storedId ? parseInt(storedId) : null;

    if (!token || !userIdNum) {
      navigate("/login");
      return;
    }

    setUserName(storedName || "User");

    fetchMealsForDate(userIdNum, selectedDate).then(setMeals);

    getUserById(userIdNum).then((user) => {
      if (user?.daily_calorie_goal) {
        setCalorieGoal(user.daily_calorie_goal);
      }
    });
  }, [navigate, selectedDate]);

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
  };

  const handleFoodAdded = (mealId: number, newFood: FoodType) => {
    setMeals((prevMeals) => addFoodToMeal(prevMeals, mealId, newFood));
  };

  const handleFoodUpdated = (mealId: number, updatedFood: FoodType) => {
    setMeals((prevMeals) => updateFoodInMeal(prevMeals, mealId, updatedFood));
  };

  const handleFoodDeleted = (mealId: number, foodId: number) => {
    setMeals((prevMeals) => deleteFoodFromMeal(prevMeals, mealId, foodId));
  };

  const handleMealDeleted = (mealId: number) => {
    setMeals((prevMeals) => deleteMeal(prevMeals, mealId));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const totalCalories = meals.reduce((sum, meal) => {
    const mealTotal = (meal.foods ?? []).reduce(
      (fSum, food) => fSum + food.calories,
      0
    );
    return sum + mealTotal;
  }, 0);

  const isToday = isTodayDate(selectedDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-bgDark to-bgLight">

      <header className="bg-surface backdrop-blur-sm border-b border-borderLight sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-textPrimary">
                Hello, {userName}!
              </h1>
              <p className="text-sm text-textPrimary/80">
                Welcome to your personal calorie tracker, where you can keep
                track of the nutritional infomation from the foods you eat!
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/profile")}
                className="px-4 py-2 bg-primary text-textInverse rounded-lg hover:bg-primaryHover transition-all duration-200 font-medium shadow-lg shadow-primary/25 cursor-pointer"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-surface text-textPrimary rounded-lg hover:bg-bgLight transition-all duration-200 font-medium border border-borderLight shadow-sm cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <DateNavigation
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <CalorieCurrentDisplay meals={meals} />
          <CalorieGoalDisplay calorieGoal={calorieGoal} />
          <CalorieProgressDisplay
            totalCalories={totalCalories}
            calorieGoal={calorieGoal}
          />
        </div>

        {isToday && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-textInverse">
                Today's Meals
              </h2>
              <AddMealBtn setMeals={setMeals} />
            </div>
          </div>
        )}

        {!isToday && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-textInverse">
                Meals for {formatReadableDate(selectedDate)}
              </h2>
              <div className="text-sm text-textPrimary bg-warningBg px-3 py-1 rounded-lg border border-warningBorder">
                📖 View Only - Historical Data
              </div>
            </div>
          </div>
        )}

        {meals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <span className="text-3xl">🍽️</span>
            </div>
            <h3 className="text-lg font-medium text-textInverse mb-2">
              {isToday ? "No meals yet" : "No meals recorded"}
            </h3>
            <p className="text-textInverse/80 mb-4">
              {isToday
                ? "Start tracking your nutrition by adding your first meal"
                : "No meals were recorded for this date"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {meals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onFoodAdded={isToday ? handleFoodAdded : undefined}
                onFoodUpdated={isToday ? handleFoodUpdated : undefined}
                onFoodDeleted={isToday ? handleFoodDeleted : undefined}
                onMealDeleted={isToday ? handleMealDeleted : undefined}
                readOnly={!isToday}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
