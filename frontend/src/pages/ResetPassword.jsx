import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { studentAPI } from "../utils/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) setError("Invalid reset link. Please request a new one.");
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setError("Passwords do not match.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    setError("");
    try {
      await studentAPI.resetPassword({ token, password });
      setSuccess(true);
      setTimeout(() => navigate("/student"), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-4">
      <div className="card max-w-md w-full border-slate-700">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Set New Password</h1>
          <p className="text-slate-400 text-sm mt-1">Choose a strong password for your portal account</p>
        </div>

        {success ? (
          <div className="text-center py-4 space-y-4">
            <div className="text-5xl">✅</div>
            <p className="text-green-400 font-medium">Password reset successfully!</p>
            <p className="text-slate-400 text-sm">Redirecting you to login in 3 seconds...</p>
            <Link to="/student" className="btn-primary text-sm px-6 py-2 inline-block">
              Sign In Now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 text-sm">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="input-field"
                disabled={!token}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your password"
                className="input-field"
                disabled={!token}
              />
            </div>
            <button type="submit" disabled={loading || !token} className="btn-primary w-full justify-center py-3">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
            <p className="text-center text-slate-500 text-sm">
              <Link to="/student/forgot-password" className="text-blue-400 hover:text-blue-300">Request a new link</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
