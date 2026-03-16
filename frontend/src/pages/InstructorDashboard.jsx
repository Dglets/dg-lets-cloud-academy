import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { instructorAPI, studentAPI } from "../utils/api";

const tabs = ["Students", "Assignments", "Tests", "Grade Book"];

export default function InstructorDashboard() {
  const [activeTab, setActiveTab] = useState("Students");
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [tests, setTests] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [instructor, setInstructor] = useState(null);
  const [gradeModal, setGradeModal] = useState(null); // { type: "assignment"|"test", item }
  const [gradeForm, setGradeForm] = useState({ studentId: "", studentName: "", studentEmail: "", score: "", maxScore: "", feedback: "" });
  const [submitting, setSubmitting] = useState(false);
  const [gradeMsg, setGradeMsg] = useState("");
  const [filterStudent, setFilterStudent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("instructor_token");
    const info = localStorage.getItem("instructor_info");
    if (!token) return navigate("/instructor");
    if (info) setInstructor(JSON.parse(info));
    fetchAll();
  }, [navigate]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [s, a, t, g] = await Promise.all([
        studentAPI.getAll(),
        studentAPI.getAssignments(),
        studentAPI.getTests(),
        instructorAPI.getGrades(),
      ]);
      setStudents(s.data || []);
      setAssignments(a.data || []);
      setTests(t.data || []);
      setGrades(g.data || []);
    } catch (err) {
      console.error("fetchAll error:", err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("instructor_token");
    localStorage.removeItem("instructor_info");
    navigate("/instructor");
  };

  const openGradeModal = (type, item) => {
    setGradeModal({ type, item });
    setGradeForm({ studentId: "", studentName: "", studentEmail: "", score: "", maxScore: item.maxScore || "100", feedback: "" });
    setGradeMsg("");
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setGradeMsg("");
    try {
      await instructorAPI.submitGrade({
        ...gradeForm,
        refId: gradeModal.item.id,
        refTitle: gradeModal.item.title,
        refType: gradeModal.type,
        program: gradeModal.item.program,
      });
      setGradeMsg("success");
      await fetchAll();
    } catch (err) {
      setGradeMsg(err.response?.data?.error || "Failed to submit grade");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const scoreColor = (score, max) => {
    const pct = (score / max) * 100;
    if (pct >= 70) return "text-green-400";
    if (pct >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const filteredGrades = filterStudent
    ? grades.filter((g) => g.studentId === filterStudent)
    : grades;

  const renderStudents = () => {
    if (students.length === 0) return <div className="text-center text-slate-400 py-12">No students enrolled yet.</div>;
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 text-left">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Program</th>
              <th className="pb-3 pr-4">Level</th>
              <th className="pb-3">Grades</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {students.map((s) => {
              const studentGrades = grades.filter((g) => g.studentId === s.id);
              const avg = studentGrades.length
                ? Math.round(studentGrades.reduce((acc, g) => acc + (g.score / g.maxScore) * 100, 0) / studentGrades.length)
                : null;
              return (
                <tr key={s.id} className="text-slate-300">
                  <td className="py-3 pr-4 font-medium text-white">{s.fullName}</td>
                  <td className="py-3 pr-4">{s.email}</td>
                  <td className="py-3 pr-4 text-xs">{s.program || "—"}</td>
                  <td className="py-3 pr-4 capitalize">
                    <span className="badge bg-blue-500/10 text-blue-400 border border-blue-500/20">{s.experienceLevel}</span>
                  </td>
                  <td className="py-3">
                    {avg !== null ? (
                      <span className={`font-semibold ${scoreColor(avg, 100)}`}>{avg}% avg</span>
                    ) : (
                      <span className="text-slate-500 text-xs">No grades yet</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderAssignments = () => {
    if (assignments.length === 0) return <div className="text-center text-slate-400 py-12">No assignments posted yet.</div>;
    return (
      <div className="space-y-3">
        {assignments.map((a) => (
          <div key={a.id} className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-white font-medium">{a.title}</div>
                <div className="text-slate-400 text-xs mt-1">
                  {a.program} · Posted {formatDate(a.createdAt)}
                  {a.dueDate && <span className="text-yellow-400 ml-2">· Due: {a.dueDate}</span>}
                </div>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed">{a.description}</p>
              </div>
              <button onClick={() => openGradeModal("assignment", a)}
                className="ml-4 flex-shrink-0 text-xs bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded px-3 py-1.5 transition-colors">
                + Grade Student
              </button>
            </div>
            {/* Mini grade list for this assignment */}
            {grades.filter((g) => g.refId === a.id).length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <div className="text-slate-400 text-xs mb-2">Graded students:</div>
                <div className="flex flex-wrap gap-2">
                  {grades.filter((g) => g.refId === a.id).map((g) => (
                    <span key={g.id} className="text-xs bg-slate-700 rounded px-2 py-1">
                      <span className="text-white">{g.studentName}</span>
                      <span className={`ml-1 font-semibold ${scoreColor(g.score, g.maxScore)}`}>{g.score}/{g.maxScore}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderTests = () => {
    if (tests.length === 0) return <div className="text-center text-slate-400 py-12">No tests posted yet.</div>;
    return (
      <div className="space-y-3">
        {tests.map((t) => (
          <div key={t.id} className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-white font-medium">{t.title}</div>
                <div className="text-slate-400 text-xs mt-1">
                  {t.program} · Posted {formatDate(t.createdAt)}
                  {t.duration && <span className="text-blue-400 ml-2">· {t.duration}</span>}
                </div>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed">{t.description}</p>
                {t.link && <a href={t.link} target="_blank" rel="noreferrer" className="text-blue-400 text-xs mt-1 hover:underline">Test Link ↗</a>}
              </div>
              <button onClick={() => openGradeModal("test", t)}
                className="ml-4 flex-shrink-0 text-xs bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded px-3 py-1.5 transition-colors">
                + Grade Student
              </button>
            </div>
            {grades.filter((g) => g.refId === t.id).length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <div className="text-slate-400 text-xs mb-2">Graded students:</div>
                <div className="flex flex-wrap gap-2">
                  {grades.filter((g) => g.refId === t.id).map((g) => (
                    <span key={g.id} className="text-xs bg-slate-700 rounded px-2 py-1">
                      <span className="text-white">{g.studentName}</span>
                      <span className={`ml-1 font-semibold ${scoreColor(g.score, g.maxScore)}`}>{g.score}/{g.maxScore}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderGradeBook = () => (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <select value={filterStudent} onChange={(e) => setFilterStudent(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-purple-500">
          <option value="">All Students</option>
          {students.map((s) => <option key={s.id} value={s.id}>{s.fullName}</option>)}
        </select>
        <span className="text-slate-400 text-sm">{filteredGrades.length} record{filteredGrades.length !== 1 ? "s" : ""}</span>
      </div>
      {filteredGrades.length === 0 ? (
        <div className="text-center text-slate-400 py-12">No grades recorded yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-left">
                <th className="pb-3 pr-4">Student</th>
                <th className="pb-3 pr-4">Assessment</th>
                <th className="pb-3 pr-4">Type</th>
                <th className="pb-3 pr-4">Score</th>
                <th className="pb-3 pr-4">Feedback</th>
                <th className="pb-3">Graded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredGrades.map((g) => (
                <tr key={g.id} className="text-slate-300">
                  <td className="py-3 pr-4 font-medium text-white">{g.studentName}</td>
                  <td className="py-3 pr-4">{g.refTitle}</td>
                  <td className="py-3 pr-4">
                    <span className={`badge border ${g.refType === "test" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}`}>
                      {g.refType}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`font-semibold ${scoreColor(g.score, g.maxScore)}`}>{g.score}/{g.maxScore}</span>
                    <span className="text-slate-500 text-xs ml-1">({Math.round((g.score / g.maxScore) * 100)}%)</span>
                  </td>
                  <td className="py-3 pr-4 text-slate-400 text-xs max-w-xs truncate">{g.feedback || "—"}</td>
                  <td className="py-3 text-slate-400">{formatDate(g.gradedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="pt-16 min-h-screen">
      {/* Grade Modal */}
      {gradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60" onClick={() => setGradeModal(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-white font-semibold text-lg">Grade Student</h2>
                <p className="text-slate-400 text-sm mt-0.5">{gradeModal.item.title}</p>
              </div>
              <button onClick={() => setGradeModal(null)} className="text-slate-400 hover:text-white text-xl ml-4">✕</button>
            </div>

            {gradeMsg === "success" ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-green-400 font-medium">Grade submitted!</p>
                <div className="flex gap-2 mt-4 justify-center">
                  <button onClick={() => { setGradeMsg(""); setGradeForm({ studentId: "", studentName: "", studentEmail: "", score: "", maxScore: gradeModal.item.maxScore || "100", feedback: "" }); }}
                    className="btn-outline text-sm px-4 py-2">Grade Another</button>
                  <button onClick={() => setGradeModal(null)} className="btn-primary text-sm px-4 py-2">Done</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGradeSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Select Student</label>
                  <select required value={gradeForm.studentId}
                    onChange={(e) => {
                      const s = students.find((s) => s.id === e.target.value);
                      setGradeForm((f) => ({ ...f, studentId: e.target.value, studentName: s?.fullName || "", studentEmail: s?.email || "" }));
                    }}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-purple-500 w-full">
                    <option value="">— Select a student —</option>
                    {students.map((s) => <option key={s.id} value={s.id}>{s.fullName}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Score</label>
                    <input required type="number" min="0" value={gradeForm.score}
                      onChange={(e) => setGradeForm((f) => ({ ...f, score: e.target.value }))}
                      placeholder="e.g. 85" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Max Score</label>
                    <input required type="number" min="1" value={gradeForm.maxScore}
                      onChange={(e) => setGradeForm((f) => ({ ...f, maxScore: e.target.value }))}
                      placeholder="e.g. 100" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Feedback (optional)</label>
                  <textarea rows={3} value={gradeForm.feedback}
                    onChange={(e) => setGradeForm((f) => ({ ...f, feedback: e.target.value }))}
                    placeholder="Write feedback for the student..."
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-purple-500 w-full resize-none" />
                </div>
                {gradeMsg && <p className="text-red-400 text-xs">{gradeMsg}</p>}
                <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-2.5 text-sm">
                  {submitting ? "Submitting..." : "Submit Grade"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Instructor Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">
              {instructor ? `Welcome, ${instructor.fullName}` : "DG-LETS Cloud Academy"}
              {instructor?.subject && <span className="text-purple-400 ml-2">· {instructor.subject}</span>}
            </p>
          </div>
          <button onClick={logout} className="btn-outline text-sm py-2 px-4">Sign Out</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Students", value: students.length, color: "text-blue-400" },
            { label: "Assignments", value: assignments.length, color: "text-yellow-400" },
            { label: "Tests", value: tests.length, color: "text-purple-400" },
            { label: "Grades Given", value: grades.length, color: "text-green-400" },
          ].map((s) => (
            <div key={s.label} className="card">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-slate-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="card">
          <div className="flex gap-1 mb-6 border-b border-slate-700 pb-4 flex-wrap">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700"
                }`}>
                {tab}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="text-center text-slate-400 py-12">Loading...</div>
          ) : (
            <>
              {activeTab === "Students" && renderStudents()}
              {activeTab === "Assignments" && renderAssignments()}
              {activeTab === "Tests" && renderTests()}
              {activeTab === "Grade Book" && renderGradeBook()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
