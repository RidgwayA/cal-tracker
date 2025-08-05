import { type FoodType } from "../../types";

type Props = {
  food: FoodType;
  readOnly: boolean;
  onEdit: (food: FoodType) => void;
  onDelete: (foodId: number) => void;
};

const FoodItemRow = ({ food, readOnly, onEdit, onDelete }: Props) => (
  <div className="flex items-center justify-between p-2 bg-white rounded shadow-sm">
    <div>
      <p className="font-medium">{food.name}</p>
      <p className="text-sm text-textPrimary">{food.calories} kcal</p>
    </div>
    {!readOnly && (
      <div className="space-x-2">
        <button onClick={() => onEdit(food)} className="text-primary cursor-pointer font-bold hover:underline">Edit</button>
        <button onClick={() => onDelete(food.id)} className="text-primaryAlt cursor-pointer font-bold hover:underline">Delete</button>
      </div>
    )}
  </div>
);

export default FoodItemRow;