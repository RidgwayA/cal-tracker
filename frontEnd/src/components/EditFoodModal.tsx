import { useState } from "react";
import { type FoodType } from "../types";

type EditFoodProps = {
  food: FoodType;
  onClose: () => void;
  onUpdate: (updatedFood: FoodType) => void;
};

const EditFoodModal = ({ food, onClose, onUpdate }: EditFoodProps) => {
  const [form, setForm] = useState({
    name: food.name,
    calories: food.calories.toString(),
    protein: food.protein.toString(),
    carbs: food.carbs.toString(),
    fat: food.fat.toString(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/foods/${food.id}`, {
      method: "PUT",
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
      const updatedFood = await res.json();
      onUpdate(updatedFood);
      onClose();
    } else {
      alert("Failed to update food");
    }
  };

  return (
    <div className="fixed inset-0 bg-bgDark/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-bgCard rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-borderLight">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-lg">✏️</span>
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Edit Food Item</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-textPrimary hover:text-error hover:bg-bgDark/10 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Food Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-borderLight rounded-lg "
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">Calories</label>
              <input
                name="calories"
                type="number"
                value={form.calories}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-borderLight rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">Protein (g)</label>
              <input
                name="protein"
                type="number"
                step="0.1"
                value={form.protein}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-borderLight rounded-lg "
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">Carbs (g)</label>
              <input
                name="carbs"
                type="number"
                step="0.1"
                value={form.carbs}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-borderLight rounded-lg "
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Fat (g)</label>
              <input
                name="fat"
                type="number"
                step="0.1"
                value={form.fat}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-borderLight rounded-lg "
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 bg-offWhite text-slate-700 rounded-lg hover:bg-error/40 transition-all duration-200 font-medium border border-borderLight cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-3 bg-primary text-textInverse rounded-lg hover:bg-primaryHover transition-all duration-200 font-medium shadow-lg shadow-blue-500/25 cursor-pointer"
            >
              Update Food
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFoodModal;