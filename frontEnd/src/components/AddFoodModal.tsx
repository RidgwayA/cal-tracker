import { useState } from "react";
import { type FoodType } from "../types";

type Props = {
  mealId: number;
  onClose: () => void;
  onAdd: (food: FoodType) => void;
};

const AddFoodModal = ({ mealId, onClose, onAdd }: Props) => {
  const [form, setForm] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/foods/${mealId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        calories: Number(form.calories),
        protein: Number(form.protein),
        carbs: Number(form.carbs),
        fat: Number(form.fat),
      }),
    });

    if (res.ok) {
      const newFood = await res.json();
      onAdd(newFood);
      onClose();
    } else {
      alert("Failed to add food");
    }
  };

  return (
    <div className="fixed inset-0 bg-myBlack/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-bgCard rounded-xl shadow-2xl w-80 max-h-96 flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-textPrimary cursor-pointer">Add Food</h2>
            <button
              onClick={onClose}
              className="p-2 text-textPrimary hover:text-error hover:bg-bgDark/10 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4" id="add-food-form">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-textPrimary mb-1">Food Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-borderDark rounded-lg "
                placeholder="e.g., Chicken Breast"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-textPrimary mb-1">Calories</label>
              <input
                name="calories"
                type="number"
                value={form.calories}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-borderDark rounded-lg "
                placeholder="250"
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium text-textPrimary mb-1">Protein (g)</label>
                <input
                  name="protein"
                  type="number"
                  step="0.1"
                  value={form.protein}
                  onChange={handleChange}
                  className="w-full px-2 py-2 text-sm border border-borderDark rounded"
                  placeholder="25"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-textPrimary mb-1">Carbs (g)</label>
                <input
                  name="carbs"
                  type="number"
                  step="0.1"
                  value={form.carbs}
                  onChange={handleChange}
                  className="w-full px-2 py-2 text-sm border border-borderDark rounded "
                  placeholder="5"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-textPrimary mb-1">Fat (g)</label>
                <input
                  name="fat"
                  type="number"
                  step="0.1"
                  value={form.fat}
                  onChange={handleChange}
                  className="w-full px-2 py-2 text-sm border border-borderDark rounded "
                  placeholder="10"
                  required
                />
              </div>
            </div>
          </div>
        </form>

        <div className="p-4 flex gap-2">
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 px-3 py-2 bg-offWhite text-textPrimary rounded-lg hover:bg-primaryHoverAlt/10 border-1 font-medium text-sm cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="add-food-form"
            className="flex-1 px-3 py-2 bg-primary text-textInverse rounded-lg hover:bg-primaryHover font-medium text-sm cursor-pointer"
          >
            Add Food
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFoodModal;