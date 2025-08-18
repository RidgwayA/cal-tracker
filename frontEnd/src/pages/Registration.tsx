import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    dailyCalorieGoal: "",
    dailyProteinGoal: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.email !== formData.confirmEmail) {
      setError("Email addresses do not match");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          date_of_birth: formData.dateOfBirth,
          daily_calorie_goal: parseInt(formData.dailyCalorieGoal),
          daily_protein_goal: parseInt(formData.dailyProteinGoal),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      navigate("/login", { 
        state: { message: "Registration successful! Please log in." }
      });
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bgDark to-bgLight flex items-center justify-center p-4">
      <div className="max-w-md w-full">

        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">🥗</span>
          </div>
          <h1 className="text-3xl font-bold text-textPrimary">
            Join calorie tracker
          </h1>
          <p className="text-textPrimary/80 mt-2">Start your nutrition journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-myWhite/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-borderLight">
          {error && (
            <div className="mb-6 p-4 bg-errorBg border border-errorBorder rounded-lg">
              <p className="text-error text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-borderDark rounded-lg bg-bgCard text-textPrimary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-borderDark rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-bgCard text-textPrimary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">Confirm Email Address</label>
              <input
                type="email"
                name="confirmEmail"
                placeholder="Confirm your email"
                value={formData.confirmEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-borderDark rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-bgCard text-textPrimary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a secure password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-borderDark rounded-lg transition-all duration-200 bg-bgCard text-textPrimary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-borderDark rounded-lg transition-all duration-200 bg-bgCard text-textPrimary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-borderDark rounded-lg transition-all duration-200 bg-bgCard text-textPrimary"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">Daily Calorie Goal</label>
                <input
                  type="number"
                  name="dailyCalorieGoal"
                  placeholder="e.g., 2000"
                  value={formData.dailyCalorieGoal}
                  onChange={handleChange}
                  min="1000"
                  max="5000"
                  className="w-full px-4 py-3 border border-borderDark rounded-lg transition-all duration-200 bg-bgCard text-textPrimary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">Daily Protein Goal (g)</label>
                <input
                  type="number"
                  name="dailyProteinGoal"
                  placeholder="e.g., 150"
                  value={formData.dailyProteinGoal}
                  onChange={handleChange}
                  min="50"
                  max="500"
                  className="w-full px-4 py-3 border border-borderDark rounded-lg transition-all duration-200 bg-bgCard text-textPrimary"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 px-6 py-3 bg-primary text-textInverse rounded-lg hover:bg-primaryHover transition-all duration-200 font-medium shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-textPrimary">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-primary hover:text-primaryHover font-medium underline underline-offset-2 cursor-pointer"
              >
                Sign in here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;