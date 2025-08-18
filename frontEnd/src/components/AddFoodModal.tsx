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
    serving_size: "",
    serving_count: "1",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const servingCount = Number(form.serving_count);
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/foods/${mealId}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify({
        name: form.name,
        calories: Number(form.calories) * servingCount,
        protein: Number(form.protein) * servingCount,
        carbs: (Number(form.carbs) || 0) * servingCount,
        fat: (Number(form.fat) || 0) * servingCount,
        serving_size: form.serving_size,
        serving_count: servingCount,
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
    <div className="fixed inset-0 bg-myBlack/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-bgCard rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[95vh] sm:max-h-[90vh] md:max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-3 sm:p-4 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold text-textPrimary cursor-pointer">
            Add Food
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-textPrimary hover:text-error hover:bg-bgDark/10 rounded-lg transition-all duration-200 cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-3 sm:p-4"
          id="add-food-form"
        >
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-textPrimary mb-1">
                Food Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-borderDark rounded-lg "
                placeholder="e.g., Chicken Breast"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-textPrimary mb-1">
                  Serving Size
                </label>
                <input
                  name="serving_size"
                  value={form.serving_size}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-borderDark rounded-lg"
                  placeholder="e.g., 100g, 1 cup"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-textPrimary mb-1">
                  Servings
                </label>
                <input
                  name="serving_count"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={form.serving_count}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-borderDark rounded-lg"
                  placeholder="1"
                  required
                />
              </div>
            </div>
            <div>
              <p>Nutritional Facts are Per Serving</p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-textPrimary mb-1">
                Calories
              </label>
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-textPrimary mb-1">
                  Protein
                </label>
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
                <label className="block text-xs sm:text-sm font-medium text-textPrimary mb-1">
                  Carbs
                </label>
                <input
                  name="carbs"
                  type="number"
                  step="0.1"
                  value={form.carbs}
                  onChange={handleChange}
                  className="w-full px-2 py-2 text-sm border border-borderDark rounded "
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-textPrimary mb-1">
                  Fat
                </label>
                <input
                  name="fat"
                  type="number"
                  step="0.1"
                  value={form.fat}
                  onChange={handleChange}
                  className="w-full px-2 py-2 text-sm border border-borderDark rounded "
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </form>

        <div className="p-3 sm:p-4 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-3 py-2 bg-offWhite text-textPrimary rounded-lg hover:bg-error/40 border-1 font-medium text-sm cursor-pointer"
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
