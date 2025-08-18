import React from "react";

interface ProgressDisplayProps {
  totalCalories: number;
  calorieGoal: number;
  totalProtein: number;
  proteinGoal: number;
}

const ProgressBar: React.FC<ProgressDisplayProps> = ({
  totalCalories,
  calorieGoal,
  totalProtein,
  proteinGoal,
}) => {
  const calorieProgressPercentage = Math.min((totalCalories / calorieGoal) * 100, 100);
  const proteinProgressPercentage = Math.min((totalProtein / proteinGoal) * 100, 100);

  return (
    <div className="bg-surface backdrop-blur-sm p-6 rounded-2xl shadow-xl hover:shadow-shadowDark border border-borderLight">
      <h3 className="text-lg font-semibold text-textPrimary mb-3">Progress</h3>
      
      {/* Calorie Progress */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-textPrimary/80">Calorie Goal</span>
          <span className="font-medium text-textPrimary">
            {Math.round(calorieProgressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-neutral/30 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-goalStart/70 to-goalEnd h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${calorieProgressPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-textPrimary/70">
          {calorieGoal - totalCalories > 0
            ? `${calorieGoal - totalCalories} kcal remaining`
            : `${totalCalories - calorieGoal} kcal over goal`}
        </p>
      </div>

      {/* Protein Progress */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-textPrimary/80">Protein Goal</span>
          <span className="font-medium text-textPrimary">
            {Math.round(proteinProgressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-neutral/30 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-goalStart/70 to-goalEnd h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${proteinProgressPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-textPrimary/70">
          {proteinGoal - totalProtein > 0
            ? `${proteinGoal - totalProtein}g remaining`
            : `${totalProtein - proteinGoal}g over goal`}
        </p>
      </div>
    </div>
  );
};

export default ProgressBar;
