import { useState } from "react";
import { type FoodType, type MealType } from "../../types";
import MealHeader from "./MealHeader";
import MealMacros from "./MealMacros";
import FoodList from "./FoodList";
import MealActions from "./MealActions";
import MealDetailsModal from "../MealDetailsModal";
import AddFoodModal from "../AddFoodModal";
import EditFoodModal from "../EditFoodModal";

type Props = {
  meal: MealType;
  onFoodAdded?: (mealId: number, newFood: FoodType) => void;
  onFoodUpdated?: (mealId: number, updatedFood: FoodType) => void;
  onFoodDeleted?: (mealId: number, foodId: number) => void;
  onMealDeleted?: (mealId: number) => void;
  readOnly?: boolean;
};

const MealCard = ({ meal, onFoodAdded, onFoodUpdated, onFoodDeleted, onMealDeleted, readOnly = false }: Props) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showAddFood, setShowAddFood] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodType | null>(null);
  const [foods, setFoods] = useState<FoodType[]>(meal.foods || []);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddFood = (newFood: FoodType) => {
    setFoods(prev => [...prev, newFood]);
    onFoodAdded?.(meal.id, newFood);
  };

  const handleUpdateFood = (updatedFood: FoodType) => {
    setFoods(prev => prev.map(food => food.id === updatedFood.id ? updatedFood : food));
    onFoodUpdated?.(meal.id, updatedFood);
  };

  const handleDeleteFood = async (foodId: number) => {
    if (!confirm("Delete this food item?")) return;
    const res = await fetch(`/api/foods/${foodId}`, { method: "DELETE" });
    if (res.ok) {
      setFoods(prev => prev.filter(food => food.id !== foodId));
      onFoodDeleted?.(meal.id, foodId);
    } else {
      alert("Failed to delete food item");
    }
  };

  const handleDeleteMeal = async () => {
    if (!confirm("Delete this meal and its foods?")) return;
    const res = await fetch(`/api/meals/${meal.id}`, { method: "DELETE" });
    if (res.ok) {
      onMealDeleted?.(meal.id);
    } else {
      alert("Failed to delete meal");
    }
  };

  return (
    <div className="bg-bgCard rounded-2xl shadow-xl border overflow-hidden">
      <MealHeader meal={meal} readOnly={readOnly} onDelete={handleDeleteMeal} />
      <MealMacros foods={foods} />
      <FoodList
        foods={foods}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        readOnly={readOnly}
        onEdit={setEditingFood}
        onDelete={handleDeleteFood}
      />
      <MealActions
        foods={foods}
        readOnly={readOnly}
        onAdd={() => setShowAddFood(true)}
        onViewDetails={() => setShowDetails(true)}
      />
      {showDetails && <MealDetailsModal foods={foods} onClose={() => setShowDetails(false)} />}
      {!readOnly && showAddFood && <AddFoodModal mealId={meal.id} onClose={() => setShowAddFood(false)} onAdd={handleAddFood} />}
      {!readOnly && editingFood && <EditFoodModal food={editingFood} onClose={() => setEditingFood(null)} onUpdate={handleUpdateFood} />}
    </div>
  );
};

export default MealCard;