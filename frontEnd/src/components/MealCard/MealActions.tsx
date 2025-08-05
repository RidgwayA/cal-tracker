import { type FoodType } from "../../types";

type Props = {
  foods: FoodType[];
  readOnly: boolean;
  onAdd: () => void;
  onViewDetails: () => void;
};

const MealActions = ({ foods, readOnly, onAdd, onViewDetails }: Props) => (
  <div className="p-4 flex gap-3">
    {!readOnly && (
      <button onClick={onAdd} className="cursor-pointer flex-1 bg-primary text-textInverse py-2 rounded hover:bg-primaryHover">Add Food</button>
    )}
    {foods.length > 0 && (
      <button onClick={onViewDetails} className="cursor-pointer flex-1 bg-offWhite text-textPrimary py-2 rounded hover:bg-neutral hover:text-textInverse">
        {readOnly ? "View Details" : "Details"}
      </button>
    )}
  </div>
);

export default MealActions;