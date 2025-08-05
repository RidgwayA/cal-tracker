import { type FoodType } from "../../types";

type Props = { foods: FoodType[] };

const MealMacros = ({ foods }: Props) => {
  const total = (key: keyof FoodType) => foods.reduce((sum, f) => sum + Number(f[key]), 0);

  return (
    <div className="grid grid-cols-4 gap-3 p-6 border-b">
      {[
        { label: "Calories", key: "calories", unit: "", color: "text-calories" },
        { label: "Protein", key: "protein", unit: "g", color: "text-protein" },
        { label: "Carbs", key: "carbs", unit: "g", color: "text-carbs" },
        { label: "Fat", key: "fat", unit: "g", color: "text-fat" },
      ].map(({ label, key, unit, color }) => (
        <div key={key} className="text-center bg-bgCard p-3 rounded">
          <p className={`text-lg font-bold ${color}`}>{total(key as keyof FoodType)}{unit}</p>
          <p className="text-xs text-textPrimary">{label}</p>
        </div>
      ))}
    </div>
  );
};

export default MealMacros;