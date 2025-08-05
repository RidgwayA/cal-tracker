import FoodItemRow from "./FoodItemRow";
import { type FoodType } from "../../types";

type Props = {
  foods: FoodType[];
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
  readOnly: boolean;
  onEdit: (food: FoodType) => void;
  onDelete: (foodId: number) => void;
};

const FoodList = ({ foods, isExpanded, setIsExpanded, readOnly, onEdit, onDelete }: Props) => {
  const visibleFoods = isExpanded ? foods : foods.slice(0, 3);
  return (
    <div className="p-6">
      {visibleFoods.map((food) => (
        <FoodItemRow key={food.id} food={food} readOnly={readOnly} onEdit={onEdit} onDelete={onDelete} />
      ))}
      {foods.length > 3 && (
        <button className="text-sm text-primary mt-2" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "Show Less" : `Show ${foods.length - 3} More`}
        </button>
      )}
    </div>
  );
};

export default FoodList;