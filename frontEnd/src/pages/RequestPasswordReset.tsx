import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RequestPasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(
        res.ok
          ? "Check your email for reset link."
          : data.error || "Failed to send reset."
      );
    } catch {
      setMessage("Server error. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bgDark to to-bgLight">
      <form
        onSubmit={onSubmit}
        className="bg-textInverse/80 p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold text-center">Password Reset</h2>
        <p className="m-2">
          Enter your email and if you are registered we will email you a reset
          link!
        </p>
        <input
          type="email"
          required
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primaryHover text-textInverse py-2 rounded"
        >
          Send Reset Link
        </button>
        {message && <p className="mt-4 text-center text-success">{message}</p>}
        <p className="mt-4 text-center text-sm">
          <span
            className="text-primary underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default RequestPasswordReset;
