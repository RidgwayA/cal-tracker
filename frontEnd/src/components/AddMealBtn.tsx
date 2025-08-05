import { useState } from "react";
import { type MealType } from "../types";

type Props = { setMeals: React.Dispatch<React.SetStateAction<MealType[]>> };

const AddMealBtn = ({ setMeals }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [mealName, setMealName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim()) return;

    setIsLoading(true);
    const userId = localStorage.getItem("userId");
    
    if (!userId) {
      alert("User not logged in");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/meals", {
        method: "POST",
        body: JSON.stringify({ 
          meal_name: mealName, 
          user_id: Number(userId), 
          date: new Date().toISOString().split('T')[0]
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to create meal");
      }

      const newMeal = await res.json();
      setMeals(prev => [...prev, { ...newMeal, foods: [] }]);
      setMealName("");
      setShowModal(false);
    } catch (error) {
      alert("Failed to create meal. Please try again.");
      console.error("Error creating meal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickMealOptions = [
    { name: "Breakfast", icon: "🌅" },
    { name: "Lunch", icon: "☀️" },
    { name: "Dinner", icon: "🌙" },
    { name: "Snack", icon: "🍎" },
  ];

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="px-6 py-3 bg-primary text-textPrimary rounded-xl  hover:bg-primaryHover transition-all duration-200 font-medium shadow-md hover:shadow-primaryHover flex items-center space-x-2 cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Add Meal</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-bgDark/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-bgCard rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-borderLight">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <span className="text-lg">🍽️</span>
                  </div>
                  <h2 className="text-xl font-semibold text-textPrimary">Add New Meal</h2>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setMealName("");
                  }}
                  className="p-2 text-textPrimary hover:bg-bgLight rounded-lg transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">

              <div className="mb-6">
                <p className="text-sm font-medium text-textPrimary mb-3">Quick Options</p>
                <div className="grid grid-cols-2 gap-3">
                  {quickMealOptions.map((option) => (
                    <button
                      key={option.name}
                      onClick={() => setMealName(option.name)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${
                        mealName === option.name
                          ? 'border-primary bg-optionSelected text-primary'
                          : 'border-borderLight hover:border-borderDark'
                      }`}
                    >
                      <span className="text-lg">{option.icon}</span>
                      <span className="font-medium">{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-textPrimary mb-2">
                    Or enter custom meal name
                  </label>
                  <input
                    type="text"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    className="w-full px-4 py-3 border border-borderDark rounded-lg "
                    placeholder="e.g., Post-workout snack"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setMealName("");
                    }}
                    className="px-6 py-3 bg-surface text-textPrimary rounded-lg hover:bg-primaryAlt/30 transition-all duration-200 font-medium border border-borderDark"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={!mealName.trim() || isLoading}
                    className="px-6 py-3 bg-primary  text-textPrimary rounded-lg hover:bg-primaryHover  transition-all duration-200 font-medium shadow-lg hover:shadow-pr disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Meal</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddMealBtn;