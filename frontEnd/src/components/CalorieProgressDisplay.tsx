import React from "react";

interface CalorieProgressDisplayProps {
  totalCalories: number;
  calorieGoal: number;
}

const CalorieProgressDisplay: React.FC<CalorieProgressDisplayProps> = ({
  totalCalories,
  calorieGoal,
}) => {
  const progressPercentage = Math.min((totalCalories / calorieGoal) * 100, 100);

  return (
    <div className="bg-surface backdrop-blur-sm p-6 rounded-2xl shadow-xl hover:shadow-shadowDark border border-borderLight">
      <h3 className="text-lg font-semibold text-textPrimary mb-3">Progress</h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-textPrimary/80">Daily Goal</span>
          <span className="font-medium text-textPrimary">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-neutral/30 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-goalStart to-goalEnd h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-textPrimary/70">
          {calorieGoal - totalCalories > 0
            ? `${calorieGoal - totalCalories} kcal remaining`
            : `${totalCalories - calorieGoal} kcal over goal`}
        </p>
      </div>
    </div>
  );
};

export default CalorieProgressDisplay;
