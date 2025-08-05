import { type FoodType } from "../types";

type DetailsProps = {
  foods: FoodType[];
  onClose: () => void;
};

const MealDetailsModal = ({ foods, onClose }: DetailsProps) => {
  const totalCalories = foods.reduce((sum, f) => sum + f.calories, 0);
  const protein = foods.reduce((sum, f) => sum + f.protein, 0);
  const carbs = foods.reduce((sum, f) => sum + f.carbs, 0);
  const fat = foods.reduce((sum, f) => sum + f.fat, 0);

  return (
    <div className="fixed inset-0 bg-bgDark/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-bgCard rounded-xl shadow-2xl w-80 max-h-96 flex flex-col">

        <div className="p-4 border-b border-borderLight flex items-center justify-between">
          <h2 className="text-lg font-semibold text-textPrimary">Meal Summary</h2>
            <button
              onClick={onClose}
              className="p-2 text-textPrimary hover:text-error hover:bg-bgDark/10 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">

          <div className="text-center mb-4 p-3 bg-calories/20 rounded-lg">
            <p className="text-2xl font-bold text-calories">{totalCalories}</p>
            <p className="text-sm text-textPrimary">Total Calories</p>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-2 bg-protein/20 rounded">
              <p className="text-lg font-bold text-protein">{protein.toFixed(0)}g</p>
              <p className="text-xs text-textPrimary">Protein</p>
            </div>
            <div className="text-center p-2 bg-carbs/20 rounded">
              <p className="text-lg font-bold text-carbs">{carbs.toFixed(0)}g</p>
              <p className="text-xs text-textPrimary">Carbs</p>
            </div>
            <div className="text-center p-2 bg-fat/20 rounded">
              <p className="text-lg font-bold text-fat">{fat.toFixed(0)}g</p>
              <p className="text-xs text-textPrimary">Fat</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-textPrimary mb-2">
              Items ({foods.length})
            </h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {foods.map((food) => (
                <div key={food.id} className="p-2 bg-neutral/10 rounded text-sm">
                  <div className="font-medium text-textPrimary truncate">{food.name}</div>
                  <div className="text-xs text-textPrimary flex justify-between">
                    <span>{food.calories} cal</span>
                    <span>P:{food.protein}g C:{food.carbs}g F:{food.fat}g</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 ">
          <button 
            onClick={onClose}
            className="w-full px-4 py-2 bg-primary text-textInverse rounded-lg hover:bg-primaryHover transition-colors font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealDetailsModal;