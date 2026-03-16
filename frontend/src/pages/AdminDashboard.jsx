import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { enrollmentAPI, partnershipAPI, contactAPI, blogAPI, notificationAPI, studentAPI } from "../utils/api";

const tabs = ["Enrollments", "Partnerships", "Contacts", "Blogs", "Notifications"];

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  approved: "bg-green-500/10 text-green-400 border-green-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  active: "bg-green-500/10 text-green-400 border-green-500/20",
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Enrollments");
  const [data, setData] = useState({ Enrollments: [], Partnerships: [], Contacts: [], Blogs: [], Notifications: [] });
  const [loading, setLoading] = useState(true);
  const [blogForm, setBlogForm] = useState({ title: "", category: "", excerpt: "", content: "" });
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState(null);
  const [grantModal, setGrantModal] = useState(null);
  const [grantPassword, setGrantPassword] = useState("");
  const [grantLoading, setGrantLoading] = useState(false);
  const [grantMsg, setGrantMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) return navigate("/admin");
    fetchAll();
  }, [navigate]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [enrollments, partnerships, contacts, blogs, notifications] = await Promise.all([
        enrollmentAPI.getAll(),
        partnershipAPI.getAll(),
        contactAPI.getAll(),
        blogAPI.getAll(),
        notificationAPI.getAll(),
      ]);
      setData({
        Enrollments: enrollments.data || [],
        Partnerships: partnerships.data || [],
        Contacts: contacts.data || [],
        Blogs: blogs.data || [],
        Notifications: notifications.data || [],
      });
    } catch {
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin");
  };

  const updateStatus = async (id, status) => {
    await enrollmentAPI.updateStatus(id, status);
    setData((prev) => ({
      ...prev,
      Enrollments: prev.Enrollments.map((e) => (e.id === id ? { ...e, status } : e)),
    }));
  };

  const handleGrantAccess = async (e) => {
    e.preventDefault();
    setGrantLoading(true);
    setGrantMsg("");
    try {
      await studentAPI.grantAccess({ enrollmentId: grantModal.id, password: grantPassword });
      setGrantMsg("success");
      setGrantPassword("");
    } catch (err) {
      setGrantMsg(err.response?.data?.error || "Failed to grant access");
    } finally {
      setGrantLoading(false);
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("Delete this blog post?")) return;
    await blogAPI.delete(id);
    setData((prev) => ({ ...prev, Blogs: prev.Blogs.filter((b) => b.id !== id) }));
  };

  const createPost = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await blogAPI.create(blogForm);
      setBlogForm({ title: "", category: "", excerpt: "", content: "" });
      setShowBlogForm(false);
      await fetchAll();
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const renderTable = () => {
    const items = data[activeTab];
    if (loading) return <div className="text-center text-slate-400 py-12">Loading...</div>;
    if (activeTab === "Blogs") return renderBlogs();
    if (activeTab === "Notifications") return renderNotifications();
    if (items.length === 0) return <div className="text-center text-slate-400 py-12">No {activeTab.toLowerCase()} yet.</div>;

    if (activeTab === "Enrollments") return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 text-left">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Phone</th>
              <th className="pb-3 pr-4">Level</th>
              <th className="pb-3 pr-4">Date</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3">Actions</th>
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
                <td className="py-3 pr-4">
                  <span className={`badge border ${statusColors[item.status] || statusColors.pending}`}>{item.status}</span>
                </td>
                <td className="py-3">
                  {item.status !== "approved" && (
                    <button onClick={() => updateStatus(item.id, "approved")}
                      className="text-xs bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded px-2 py-1 mr-1 transition-colors">
                      Approve
                    </button>
                  )}
                  {item.status !== "rejected" && (
                    <button onClick={() => updateStatus(item.id, "rejected")}
                      className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded px-2 py-1 transition-colors">
                      Reject
                    </button>
                  )}
                  {item.status === "approved" && (
                    <button onClick={() => { setGrantModal(item); setGrantMsg(""); setGrantPassword(""); }}
                      className="text-xs bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded px-2 py-1 ml-1 transition-colors">
                      Grant Access
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    if (activeTab === "Partnerships") return (
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

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 text-left">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Subject</th>
              <th className="pb-3 pr-4">Submitted</th>
              <th className="pb-3">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {items.map((item) => (
              <tr key={item.id} className="text-slate-300">
                <td className="py-3 pr-4 font-medium text-white">{item.name}</td>
                <td className="py-3 pr-4">{item.email}</td>
                <td className="py-3 pr-4">{item.subject || "—"}</td>
                <td className="py-3 pr-4 text-slate-400">{formatDate(item.createdAt)}</td>
                <td className="py-3">
                  <button onClick={() => setModal({ type: "contact", item })}
                    className="text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded px-2 py-1 transition-colors">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderNotifications = () => {
    const items = data.Notifications;
    if (items.length === 0) return <div className="text-center text-slate-400 py-12">No notification signups yet.</div>;
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 text-left">
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Program</th>
              <th className="pb-3">Signed Up</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {items.map((item) => (
              <tr key={item.id} className="text-slate-300">
                <td className="py-3 pr-4 font-medium text-white">{item.email}</td>
                <td className="py-3 pr-4">
                  <span className="badge bg-purple-500/10 text-purple-400 border border-purple-500/20">{item.program}</span>
                </td>
                <td className="py-3 text-slate-400">{formatDate(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderBlogs = () => (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowBlogForm((v) => !v)} className="btn-primary text-sm py-2 px-4">
          {showBlogForm ? "Cancel" : "+ New Post"}
        </button>
      </div>

      {showBlogForm && (
        <form onSubmit={createPost} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="Title" value={blogForm.title}
              onChange={(e) => setBlogForm((f) => ({ ...f, title: e.target.value }))}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500 w-full" />
            <input required placeholder="Category (e.g. AWS, Cloud)" value={blogForm.category}
              onChange={(e) => setBlogForm((f) => ({ ...f, category: e.target.value }))}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500 w-full" />
          </div>
          <input placeholder="Excerpt (short summary)" value={blogForm.excerpt}
            onChange={(e) => setBlogForm((f) => ({ ...f, excerpt: e.target.value }))}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500 w-full" />
          <textarea required rows={6} placeholder="Full content..." value={blogForm.content}
            onChange={(e) => setBlogForm((f) => ({ ...f, content: e.target.value }))}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500 w-full resize-none" />
          <button type="submit" disabled={submitting} className="btn-primary text-sm py-2 px-6">
            {submitting ? "Publishing..." : "Publish Post"}
          </button>
        </form>
      )}

      {data.Blogs.length === 0 ? (
        <div className="text-center text-slate-400 py-12">No blog posts yet.</div>
      ) : (
        <div className="space-y-3">
          {data.Blogs.map((post) => (
            <div key={post.id} className="flex items-start justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
              <div>
                <div className="text-white font-medium">{post.title}</div>
                <div className="text-slate-400 text-xs mt-1">{post.category} · {formatDate(post.createdAt)}</div>
                {post.excerpt && <div className="text-slate-500 text-xs mt-1">{post.excerpt}</div>}
              </div>
              <div className="flex gap-2 ml-4 flex-shrink-0">
                <button onClick={() => setModal({ type: "blog", item: post })}
                  className="text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded px-3 py-1 transition-colors">
                  Read
                </button>
                <button onClick={() => deletePost(post.id)}
                  className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded px-3 py-1 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="pt-16 min-h-screen">
      {grantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60" onClick={() => setGrantModal(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-white font-semibold text-lg">Grant Portal Access</h2>
                <p className="text-slate-400 text-sm mt-1">{grantModal.fullName} · {grantModal.email}</p>
              </div>
              <button onClick={() => setGrantModal(null)} className="text-slate-400 hover:text-white text-xl ml-4">✕</button>
            </div>
            {grantMsg === "success" ? (
              <div className="text-center py-4">
                <div className="text-3xl mb-2">✅</div>
                <p className="text-green-400 font-medium">Access granted!</p>
                <p className="text-slate-400 text-sm mt-1">Student can now log in to the portal.</p>
                <button onClick={() => setGrantModal(null)} className="btn-primary mt-4 text-sm px-6 py-2">Done</button>
              </div>
            ) : (
              <form onSubmit={handleGrantAccess} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Set Portal Password</label>
                  <input type="password" required minLength={6} placeholder="Min 6 characters" value={grantPassword}
                    onChange={(e) => setGrantPassword(e.target.value)}
                    className="input-field" />
                </div>
                {grantMsg && <p className="text-red-400 text-xs">{grantMsg}</p>}
                <button type="submit" disabled={grantLoading} className="btn-primary w-full justify-center py-2 text-sm">
                  {grantLoading ? "Granting..." : "Grant Access"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60" onClick={() => setModal(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-white font-semibold text-lg">
                  {modal.type === "blog" ? modal.item.title : modal.item.subject || "Message"}
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  {modal.type === "blog"
                    ? `${modal.item.category} · ${formatDate(modal.item.createdAt)}`
                    : `${modal.item.name} · ${modal.item.email} · ${formatDate(modal.item.createdAt)}`}
                </p>
              </div>
              <button onClick={() => setModal(null)} className="text-slate-400 hover:text-white text-xl ml-4">✕</button>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
              {modal.type === "blog" ? modal.item.content : modal.item.message}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">DG-LETS Cloud Academy</p>
          </div>
          <button onClick={logout} className="btn-outline text-sm py-2 px-4">Sign Out</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {tabs.map((tab) => (
            <div key={tab} className="card">
              <div className="text-3xl font-bold text-blue-400">{data[tab].length}</div>
              <div className="text-slate-400 text-sm mt-1">{tab}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="flex gap-1 mb-6 border-b border-slate-700 pb-4 flex-wrap">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700"
                }`}>
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
