type GoalProps = { calorieGoal: number };

const CalorieGoalDisplay = ({ calorieGoal }: GoalProps) => (
  <div className="bg-bgCard backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-borderLight hover:shadow-2xl hover:shadow-shadowDark transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primaryAlt rounded-xl flex items-center justify-center">
        <span className="text-xl">🎯</span>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold bg-primary  bg-clip-text text-transparent">
          {calorieGoal.toLocaleString()}
        </p>
        <p className="text-xs text-textPrimary font-medium">GOAL</p>
      </div>
    </div>
    <h3 className="text-lg font-semibold text-textPrimary">Your Daily Nutrition Goal</h3>
    <p className="text-sm text-textPrimary">You can edit this in your profile.</p>
  </div>
);

export default CalorieGoalDisplay;