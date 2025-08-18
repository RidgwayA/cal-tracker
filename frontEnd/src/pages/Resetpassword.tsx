import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const [pwd, setPwd] = useState("");
  const [msg, setMsg] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: pwd }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Password reset! Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMsg(data.error || "Reset failed.");
      }
    } catch {
      setMsg("Server error.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={onSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        <input
          type="password"
          required
          placeholder="New password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Save New Password
        </button>
        {msg && <p className="mt-4 text-center text-red-600">{msg}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
