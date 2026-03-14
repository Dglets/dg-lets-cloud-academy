import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { enrollmentAPI, partnershipAPI, contactAPI } from "../utils/api";

const tabs = ["Enrollments", "Partnerships", "Contacts"];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Enrollments");
  const [data, setData] = useState({ Enrollments: [], Partnerships: [], Contacts: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) return navigate("/admin");

    const fetchAll = async () => {
      try {
        const [enrollments, partnerships, contacts] = await Promise.all([
          enrollmentAPI.getAll(),
          partnershipAPI.getAll(),
          contactAPI.getAll(),
        ]);
        setData({
          Enrollments: enrollments.data || [],
          Partnerships: partnerships.data || [],
          Contacts: contacts.data || [],
        });
      } catch {
        navigate("/admin");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin");
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const renderTable = () => {
    const items = data[activeTab];
    if (loading) return <div className="text-center text-slate-400 py-12">Loading...</div>;
    if (items.length === 0) return <div className="text-center text-slate-400 py-12">No {activeTab.toLowerCase()} yet.</div>;

    if (activeTab === "Enrollments") {
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-left">
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Phone</th>
                <th className="pb-3 pr-4">Level</th>
                <th className="pb-3 pr-4">Preferred Date</th>
                <th className="pb-3">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {items.map((item) => (
                <tr key={item.id} className="text-slate-300">
                  <td className="py-3 pr-4 font-medium text-white">{item.fullName}</td>
                  <td className="py-3 pr-4">{item.email}</td>
                  <td className="py-3 pr-4">{item.phone}</td>
                  <td className="py-3 pr-4 capitalize">
                    <span className="badge bg-blue-500/10 text-blue-400 border border-blue-500/20">{item.experienceLevel}</span>
                  </td>
                  <td className="py-3 pr-4">{item.preferredDate}</td>
                  <td className="py-3 text-slate-400">{formatDate(item.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === "Partnerships") {
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-left">
                <th className="pb-3 pr-4">Company</th>
                <th className="pb-3 pr-4">Contact</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Interest</th>
                <th className="pb-3">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {items.map((item) => (
                <tr key={item.id} className="text-slate-300">
                  <td className="py-3 pr-4 font-medium text-white">{item.companyName}</td>
                  <td className="py-3 pr-4">{item.contactPerson}</td>
                  <td className="py-3 pr-4">{item.email}</td>
                  <td className="py-3 pr-4 text-xs">{item.partnershipInterest}</td>
                  <td className="py-3 text-slate-400">{formatDate(item.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 text-left">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Subject</th>
              <th className="pb-3">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {items.map((item) => (
              <tr key={item.id} className="text-slate-300">
                <td className="py-3 pr-4 font-medium text-white">{item.name}</td>
                <td className="py-3 pr-4">{item.email}</td>
                <td className="py-3 pr-4">{item.subject || "—"}</td>
                <td className="py-3 text-slate-400">{formatDate(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">DG-LETS Cloud Academy</p>
          </div>
          <button onClick={logout} className="btn-outline text-sm py-2 px-4">Sign Out</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {tabs.map((tab) => (
            <div key={tab} className="card">
              <div className="text-3xl font-bold text-blue-400">{data[tab].length}</div>
              <div className="text-slate-400 text-sm mt-1">{tab}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="card">
          <div className="flex gap-1 mb-6 border-b border-slate-700 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                {tab} ({data[tab].length})
              </button>
            ))}
          </div>
          {renderTable()}
        </div>
      </div>
    </div>
  );
}
