import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { studentAPI } from "../utils/api";

const tabs = ["Profile", "Assignments", "Tests", "Tutorials"];

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [profile, setProfile] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [tests, setTests] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("student_token");
    if (!token) return navigate("/student");
    fetchAll();
  }, [navigate]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [p, a, t, tu] = await Promise.all([
        studentAPI.getProfile(),
        studentAPI.getAssignments(),
        studentAPI.getTests(),
        studentAPI.getTutorials(),
      ]);
      setProfile(p.data);
      setAssignments(a.data || []);
      setTests(t.data || []);
      setTutorials(tu.data || []);
    } catch {
      navigate("/student");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("student_token");
    localStorage.removeItem("student_info");
    navigate("/student");
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (loading) return <div className="pt-16 min-h-screen flex items-center justify-center text-slate-400">Loading your portal...</div>;

  return (
    <div className="pt-16 min-h-screen">
      {/* Modal for assignment/test details */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60" onClick={() => setModal(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-white font-semibold text-lg pr-4">{modal.title}</h2>
              <button onClick={() => setModal(null)} className="text-slate-400 hover:text-white text-xl flex-shrink-0">✕</button>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap mb-4">{modal.description}</p>
            {modal.dueDate && <p className="text-yellow-400 text-xs">📅 Due: {modal.dueDate}</p>}
            {modal.duration && <p className="text-blue-400 text-xs">⏱ Duration: {modal.duration}</p>}
            {modal.link && (
              <a href={modal.link} target="_blank" rel="noreferrer" className="btn-primary text-sm py-2 px-4 mt-4 inline-block">
                Start Test →
              </a>
            )}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-2xl">🎓</div>
            <div>
              <h1 className="text-xl font-bold text-white">Welcome, {profile?.fullName}</h1>
              <p className="text-slate-400 text-sm">{profile?.program}</p>
            </div>
          </div>
          <button onClick={logout} className="btn-outline text-sm py-2 px-4">Sign Out</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Assignments", value: assignments.length, color: "text-orange-400" },
            { label: "Tests", value: tests.length, color: "text-red-400" },
            { label: "Tutorials", value: tutorials.length, color: "text-purple-400" },
            { label: "Program", value: profile?.experienceLevel, color: "text-blue-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="card text-center">
              <div className={`text-2xl font-bold capitalize ${color}`}>{value}</div>
              <div className="text-slate-400 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="card">
          <div className="flex gap-1 mb-6 border-b border-slate-700 pb-4 flex-wrap">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700"
                }`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Profile Tab */}
          {activeTab === "Profile" && profile && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Full Name", value: profile.fullName },
                { label: "Email", value: profile.email },
                { label: "Phone", value: profile.phone },
                { label: "Program", value: profile.program },
                { label: "Experience Level", value: profile.experienceLevel },
                { label: "Enrolled On", value: formatDate(profile.enrolledAt) },
                { label: "Access Granted", value: formatDate(profile.accessGrantedAt) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                  <div className="text-slate-400 text-xs mb-1">{label}</div>
                  <div className="text-white font-medium capitalize">{value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === "Assignments" && (
            <div>
              {assignments.length === 0 ? (
                <div className="text-center text-slate-400 py-12">No assignments yet.</div>
              ) : (
                <div className="space-y-3">
                  {assignments.map((a) => (
                    <div key={a.id} className="flex items-start justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
                      <div>
                        <div className="text-white font-medium">{a.title}</div>
                        <div className="text-slate-400 text-xs mt-1">
                          {a.program} · Posted {formatDate(a.createdAt)}
                          {a.dueDate && <span className="text-yellow-400 ml-2">· Due: {a.dueDate}</span>}
                        </div>
                      </div>
                      <button onClick={() => setModal(a)}
                        className="text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded px-3 py-1 ml-4 flex-shrink-0 transition-colors">
                        View
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tests Tab */}
          {activeTab === "Tests" && (
            <div>
              {tests.length === 0 ? (
                <div className="text-center text-slate-400 py-12">No tests available yet.</div>
              ) : (
                <div className="space-y-3">
                  {tests.map((t) => (
                    <div key={t.id} className="flex items-start justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
                      <div>
                        <div className="text-white font-medium">{t.title}</div>
                        <div className="text-slate-400 text-xs mt-1">
                          {t.program} · {formatDate(t.createdAt)}
                          {t.duration && <span className="text-blue-400 ml-2">· {t.duration}</span>}
                        </div>
                      </div>
                      <button onClick={() => setModal(t)}
                        className="text-xs bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded px-3 py-1 ml-4 flex-shrink-0 transition-colors">
                        Take Test
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tutorials Tab */}
          {activeTab === "Tutorials" && (
            <div>
              {tutorials.length === 0 ? (
                <div className="text-center text-slate-400 py-12">No recorded tutorials yet.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tutorials.map((t) => (
                    <div key={t.id} className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                      <div className="aspect-video bg-slate-900 flex items-center justify-center">
                        {t.videoUrl.includes("youtube.com") || t.videoUrl.includes("youtu.be") ? (
                          <iframe
                            className="w-full h-full"
                            src={t.videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                            title={t.title}
                            allowFullScreen
                          />
                        ) : (
                          <a href={t.videoUrl} target="_blank" rel="noreferrer"
                            className="flex flex-col items-center gap-2 text-slate-400 hover:text-white transition-colors">
                            <span className="text-4xl">▶️</span>
                            <span className="text-sm">Watch Tutorial</span>
                          </a>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="text-white font-medium">{t.title}</div>
                        <div className="text-slate-400 text-xs mt-1">
                          {t.week && <span>Week {t.week} · </span>}{t.program}
                          {t.duration && <span className="ml-2">· {t.duration}</span>}
                        </div>
                        {t.description && <p className="text-slate-500 text-xs mt-2">{t.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
