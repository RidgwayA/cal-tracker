import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])/.test(pwd)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(pwd)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(pwd)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setSuccess("Password reset successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.error || "Reset failed. Please try again.");
      }
    } catch {
      setError("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bgDark to-bgLight flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-3xl font-bold text-textPrimary">
            Reset Your Password
          </h1>
          <p className="text-textPrimary/80 mt-2">Enter your new secure password</p>
        </div>

        <form onSubmit={onSubmit} className="bg-myWhite/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-borderLight">
          {error && (
            <div className="mb-6 p-4 bg-errorBg border border-errorBorder rounded-lg">
              <p className="text-error text-sm font-medium">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm font-medium">{success}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">New Password</label>
              <input
                type="password"
                required
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-borderDark rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-bgCard text-textPrimary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">Confirm New Password</label>
              <input
                type="password"
                required
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-borderDark rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-bgCard text-textPrimary"
              />
            </div>

            {/* Password requirements */}
            <div className="bg-bgCard/50 p-4 rounded-lg border border-borderLight">
              <h3 className="text-sm font-medium text-textPrimary mb-2">Password Requirements:</h3>
              <ul className="text-xs text-textPrimary/80 space-y-1">
                <li className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <span>At least 8 characters long</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${/(?=.*[a-z])/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <span>One lowercase letter</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${/(?=.*[A-Z])/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <span>One uppercase letter</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${/(?=.*\d)/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <span>One number</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 px-6 py-3 bg-primary text-textInverse rounded-lg hover:bg-primaryHover transition-all duration-200 font-medium shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Resetting Password...</span>
              </>
            ) : (
              <span>Reset Password</span>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-textPrimary">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-primary hover:text-primaryHover font-medium underline underline-offset-2"
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

export default ResetPassword;