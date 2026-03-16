import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { instructorAPI } from "../utils/api";

export default function InstructorLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await instructorAPI.login(form);
      localStorage.setItem("instructor_token", data.token);
      localStorage.setItem("instructor_info", JSON.stringify(data.instructor));
      navigate("/instructor/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-4">
      <div className="card max-w-md w-full border-slate-700">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">📚</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Instructor Portal</h1>
          <p className="text-slate-400 text-sm mt-1">DG-LETS Cloud Academy</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="instructor@dg-lets.com" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
            <input type="password" required value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="••••••••" className="input-field" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
