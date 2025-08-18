type GoalProps = { calorieGoal: number; proteinGoal: number };

const GoalDisplay = ({ calorieGoal, proteinGoal }: GoalProps) => (
  <div className="bg-bgCard backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-borderLight hover:shadow-2xl hover:shadow-shadowDark transition-all duration-300">
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primaryAlt rounded-xl flex items-center justify-center">
        <span className="text-xl">🎯</span>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-textPrimary">Your Daily Nutrition Goal</h3>
        <p className="text-sm text-textPrimary">Set specific goals in your profile!</p>
      </div>
    </div>
    <div className="space-y-3">
      <div className="text-center">
        <p className="text-2xl font-bold bg-primary bg-clip-text text-transparent">
          {calorieGoal.toLocaleString()}
        </p>
        <p className="text-xs text-textPrimary font-medium">CALORIE GOAL</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold bg-primary bg-clip-text text-transparent">
          {proteinGoal.toLocaleString()}
        </p>
        <p className="text-xs text-textPrimary font-medium">PROTEIN GOAL</p>
      </div>
    </div>
  </div>
);

export default GoalDisplay;