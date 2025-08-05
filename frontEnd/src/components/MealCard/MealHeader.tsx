import { type MealType } from "../../types";

type Props = {
  meal: MealType;
  readOnly: boolean;
  onDelete: () => void;
};

const getMealIcon = (mealName: string) => {
  const name = mealName.toLowerCase();
  if (name.includes("breakfast")) return "🌅";
  if (name.includes("lunch")) return "☀️";
  if (name.includes("dinner")) return "🌙";
  if (name.includes("snack")) return "🍎";
  return "🍽️";
};

const MealHeader = ({ meal, readOnly, onDelete }: Props) => (
  <div className="p-6 border-b">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
          <span>{getMealIcon(meal.meal_name)}</span>
        </div>
        <div>
          <h4 className="text-lg font-semibold">{meal.meal_name}</h4>
          <p className="text-sm text-textPrimary">{meal.foods?.length || 0} items</p>
        </div>
      </div>
      <button onClick={onDelete} disabled={readOnly} className={`p-2 ${readOnly ? "cursor-not-allowed text-textPrimary " : "hover:bg-bgDark/10 rounded cursor-pointer"}`}>
        🗑️
      </button>
    </div>
  </div>
);

export default MealHeader;