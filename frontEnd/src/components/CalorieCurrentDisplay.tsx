import { type MealType } from "../types";

type Props = { meals?: MealType[] };

const CalorieCurrentDisplay = ({ meals = [] }: Props) => {
  const totalCalories = meals.reduce((sum, meal) => {
    const mealTotal = (meal.foods ?? []).reduce((fSum, food) => fSum + food.calories, 0);
    return sum + mealTotal;
  }, 0);

  return (
    <div className="bg-bgCard backdrop-blur-sm p-6 rounded-2xl shadow-md border border-borderLight hover:shadow-2xl hover:shadow-shadowDark  transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primaryAlt/40 to-primaryAlt rounded-xl flex items-center justify-center">
          <span className="text-xl">🔥</span>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold bg-primaryAlt bg-clip-text text-transparent">
            {totalCalories.toLocaleString()}
          </p>
          <p className="text-xs text-textPrimary font-medium">CALORIES</p>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-textPrimary">Consumed Today</h3>
      <p className="text-sm text-textPrimary">Keep up the great work!</p>
    </div>
  );
};

export default CalorieCurrentDisplay;
