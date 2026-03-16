import { useState } from "react";
import { Link } from "react-router-dom";
import { studentAPI } from "../utils/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await studentAPI.forgotPassword({ email });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-4">
      <div className="card max-w-md w-full border-slate-700">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl">🔑</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
          <p className="text-slate-400 text-sm mt-1">Enter your email to receive a reset link</p>
        </div>

        {submitted ? (
          <div className="text-center py-4 space-y-4">
            <div className="text-5xl">📧</div>
            <p className="text-green-400 font-medium">Reset link sent!</p>
            <p className="text-slate-400 text-sm">
              If an account exists for <span className="text-white">{email}</span>, you'll receive a password reset email within a few minutes. Check your inbox and spam folder.
            </p>
            <Link to="/student" className="btn-primary text-sm px-6 py-2 inline-block mt-2">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 text-sm">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-field"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            <p className="text-center text-slate-500 text-sm">
              Remember your password?{" "}
              <Link to="/student" className="text-blue-400 hover:text-blue-300">Sign in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
