import { useState } from "react";
import { type FoodType, type MealType } from "../../types";
import MealHeader from "./MealHeader";
import MealMacros from "./MealMacros";
import FoodList from "./FoodList";
import MealActions from "./MealActions";
import MealDetailsModal from "../MealDetailsModal";
import AddFoodModal from "../AddFoodModal";
import EditFoodModal from "../EditFoodModal";
import ConfirmationModal from "../ConfirmationModal";

type Props = {
  meal: MealType;
  onFoodAdded?: (mealId: number, newFood: FoodType) => void;
  onFoodUpdated?: (mealId: number, updatedFood: FoodType) => void;
  onFoodDeleted?: (mealId: number, foodId: number) => void;
  onMealDeleted?: (mealId: number) => void;
};

const MealCard = ({ meal, onFoodAdded, onFoodUpdated, onFoodDeleted, onMealDeleted }: Props) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showAddFood, setShowAddFood] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodType | null>(null);
  const [foods, setFoods] = useState<FoodType[]>(meal.foods || []);
  const [isExpanded, setIsExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    type: 'food' | 'meal';
    id?: number;
    title: string;
    message: string;
  }>({ isOpen: false, type: 'food', title: '', message: '' });

  const handleAddFood = (newFood: FoodType) => {
    setFoods(prev => [...prev, newFood]);
    onFoodAdded?.(meal.id, newFood);
  };

  const handleUpdateFood = (updatedFood: FoodType) => {
    setFoods(prev => prev.map(food => food.id === updatedFood.id ? updatedFood : food));
    onFoodUpdated?.(meal.id, updatedFood);
  };

  const handleDeleteFood = (foodId: number) => {
    const food = foods.find(f => f.id === foodId);
    setConfirmDelete({
      isOpen: true,
      type: 'food',
      id: foodId,
      title: 'Delete Food Item',
      message: `Are you sure you want to delete "${food?.name}"? This action cannot be undone.`
    });
  };

  const confirmDeleteFood = async (foodId: number) => {
    const res = await fetch(`/api/foods/${foodId}`, { method: "DELETE" });
    if (res.ok) {
      setFoods(prev => prev.filter(food => food.id !== foodId));
      onFoodDeleted?.(meal.id, foodId);
    } else {
      alert("Failed to delete food item");
    }
    setConfirmDelete(prev => ({ ...prev, isOpen: false }));
  };

  const handleDeleteMeal = () => {
    setConfirmDelete({
      isOpen: true,
      type: 'meal',
      id: meal.id,
      title: 'Delete Meal',
      message: `Are you sure you want to delete "${meal.meal_name}" and all its food items? This action cannot be undone.`
    });
  };

  const confirmDeleteMeal = async () => {
    const res = await fetch(`/api/meals/${meal.id}`, { method: "DELETE" });
    if (res.ok) {
      onMealDeleted?.(meal.id);
    } else {
      alert("Failed to delete meal");
    }
    setConfirmDelete(prev => ({ ...prev, isOpen: false }));
  };

  const handleConfirmAction = () => {
    if (confirmDelete.type === 'food' && confirmDelete.id) {
      confirmDeleteFood(confirmDelete.id);
    } else if (confirmDelete.type === 'meal') {
      confirmDeleteMeal();
    }
  };

  const handleCancelAction = () => {
    setConfirmDelete(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="bg-bgCard rounded-2xl shadow-xl border overflow-hidden">
      <MealHeader meal={meal} onDelete={handleDeleteMeal} />
      <MealMacros foods={foods} />
      <FoodList
        foods={foods}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        onEdit={setEditingFood}
        onDelete={handleDeleteFood}
      />
      <MealActions
        foods={foods}
        onAdd={() => setShowAddFood(true)}
        onViewDetails={() => setShowDetails(true)}
      />
      {showDetails && <MealDetailsModal foods={foods} onClose={() => setShowDetails(false)} />}
      {showAddFood && <AddFoodModal mealId={meal.id} onClose={() => setShowAddFood(false)} onAdd={handleAddFood} />}
      {editingFood && <EditFoodModal food={editingFood} onClose={() => setEditingFood(null)} onUpdate={handleUpdateFood} />}
      <ConfirmationModal
        isOpen={confirmDelete.isOpen}
        title={confirmDelete.title}
        message={confirmDelete.message}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
        variant="danger"
      />
    </div>
  );
};

export default MealCard;