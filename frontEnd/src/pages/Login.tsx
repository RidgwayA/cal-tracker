import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const successMessage = location.state?.message;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await loginUser(formData.email, formData.password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id.toString());
      localStorage.setItem("userName", data.user.name);
      navigate("/dashboard");
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bgDark to to-bgLight flex items-center justify-center p-4">
      <div className="max-w-md w-full">

        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">🥗</span>
          </div>
          <h1 className="text-3xl font-bold bg-textPrimary bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-textPrimary mt-2">Sign in to continue your journey</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-myWhite/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-borderLight"
        >
          {successMessage && (
            <div className="mb-6 p-4 bg-successBg border border-successBorder rounded-lg">
              <p className="text-success text-sm font-medium">{successMessage}</p>
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-errorBg border border-errorBorder rounded-lg">
              <p className="text-error text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-textPrimary mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-borderDark rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-textPrimary mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-borderDark rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 px-6 py-3 bg-primary hover:bg-primaryHover text-textInverse rounded-lg transition-all duration-200 font-medium shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-textPrimary">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-primary hover:text-primaryHover font-medium underline underline-offset-2 cursor-pointer"
              >
                Create one here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
