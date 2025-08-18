import { type MealType } from "../types";

type Props = { meals?: MealType[] };

const DailyTotals = ({ meals = [] }: Props) => {
  
  const totalCalories = meals.reduce((sum, meal) => {
    const mealTotal = (meal.foods ?? []).reduce((fSum, food) => fSum + food.calories, 0);
    return sum + mealTotal;
  }, 0);

  const totalProtien = meals.reduce((sum, meal) => {
    const mealTotal = (meal.foods ?? []).reduce((fSum, food) => fSum + food.protein, 0);
    return sum + mealTotal;
  }, 0);

  return (
    <div className="bg-bgCard backdrop-blur-sm p-6 rounded-2xl shadow-md border border-borderLight hover:shadow-2xl hover:shadow-shadowDark  transition-all duration-300">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primaryAlt/40 to-primaryAlt rounded-xl flex items-center justify-center">
          <span className="text-xl">🔥</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-textPrimary">Todays Snap Shot</h3>
          <p className="text-sm text-textPrimary">Keep up the great work!</p>
        </div>
      </div>
      <div className="space-y-3">
        <div className="text-center">
          <p className="text-2xl font-bold bg-primaryAlt bg-clip-text text-transparent">
            {totalCalories.toLocaleString()}
          </p>
          <p className="text-xs text-textPrimary font-medium">CALORIES</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold bg-primaryAlt bg-clip-text text-transparent">
            {totalProtien.toLocaleString()}
          </p>
          <p className="text-xs text-textPrimary font-medium">PROTEIN</p>
        </div>
      </div>
    </div>
  );
};

export default DailyTotals;
