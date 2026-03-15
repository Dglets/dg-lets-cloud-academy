import { useState } from "react";
import { notificationAPI } from "../utils/api";

const programs = [
  {
    icon: "🤖",
    title: "AI & Machine Learning on AWS",
    desc: "Learn to build, train, and deploy machine learning models using AWS SageMaker, Rekognition, Comprehend, and Bedrock. No prior ML experience required.",
    tags: ["SageMaker", "Rekognition", "Comprehend", "Bedrock"],
    color: "border-purple-500/30",
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    accent: "text-purple-400",
  },
  {
    icon: "🔐",
    title: "Cloud Security & DevSecOps",
    desc: "Master cloud security principles, AWS security services, and DevSecOps practices to build and maintain secure cloud infrastructure.",
    tags: ["IAM", "GuardDuty", "WAF", "Security Hub"],
    color: "border-cyan-500/30",
    badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    accent: "text-cyan-400",
  },
  {
    icon: "⚙️",
    title: "DevOps & CI/CD on AWS",
    desc: "Automate software delivery pipelines using AWS CodePipeline, CodeBuild, CodeDeploy, ECS, and Kubernetes on EKS.",
    tags: ["CodePipeline", "ECS", "EKS", "Terraform"],
    color: "border-orange-500/30",
    badge: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    accent: "text-orange-400",
  },
  {
    icon: "📊",
    title: "Data Engineering on AWS",
    desc: "Build scalable data pipelines and analytics platforms using AWS Glue, Redshift, Athena, and Kinesis.",
    tags: ["Glue", "Redshift", "Athena", "Kinesis"],
    color: "border-green-500/30",
    badge: "bg-green-500/10 text-green-400 border-green-500/20",
    accent: "text-green-400",
  },
];

export default function ComingSoon() {
  const [notify, setNotify] = useState(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleNotify = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await notificationAPI.subscribe({ email, program: notify });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => { setNotify(null); setStatus(""); setEmail(""); };

  return (
    <div className="pt-16">
      {notify && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60" onClick={closeModal}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-white font-semibold text-lg">Notify Me</h2>
                <p className="text-slate-400 text-sm mt-1">{notify}</p>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-white text-xl ml-4">✕</button>
            </div>
            {status === "success" ? (
              <div className="text-center py-4">
                <div className="text-3xl mb-2">🎉</div>
                <p className="text-green-400 font-medium">You're on the list!</p>
                <p className="text-slate-400 text-sm mt-1">We'll email you when this program launches.</p>
                <button onClick={closeModal} className="btn-primary mt-4 text-sm px-6 py-2">Done</button>
              </div>
            ) : (
              <form onSubmit={handleNotify} className="space-y-4">
                <input type="email" required placeholder="Enter your email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500" />
                {status === "error" && <p className="text-red-400 text-xs">Something went wrong. Try again.</p>}
                <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-2 text-sm">
                  {submitting ? "Submitting..." : "Notify Me When It Launches"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="py-24 bg-gradient-to-b from-purple-950/20 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="badge bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">Coming Soon</span>
          <h1 className="section-title text-5xl mt-2">Upcoming Programs</h1>
          <p className="section-subtitle mx-auto mt-4">
            We're building more tracks to take your cloud career further. Register your interest and be the first to know when they launch.
          </p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map(({ icon, title, desc, tags, color, badge, accent }) => (
              <div key={title} className={`card border ${color} relative overflow-hidden`}>
                <div className="absolute top-4 right-4">
                  <span className={`badge border ${badge} text-xs`}>Coming Soon</span>
                </div>
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className={`font-bold text-lg mb-2 pr-24 ${accent}`}>{title}</h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">{desc}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {tags.map((t) => (
                    <span key={t} className="badge bg-slate-700 text-slate-300 text-xs px-2 py-1">{t}</span>
                  ))}
                </div>
                <button onClick={() => setNotify(title)} className="btn-outline text-sm py-2 px-5 w-full justify-center">
                  🔔 Notify Me When It Launches
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
