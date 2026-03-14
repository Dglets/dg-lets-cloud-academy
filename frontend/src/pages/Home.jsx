import { Link } from "react-router-dom";

const benefits = [
  { icon: "☁️", title: "AWS-Aligned Curriculum", desc: "Learn cloud concepts mapped directly to AWS certifications and real-world use cases." },
  { icon: "🛠️", title: "Hands-On Projects", desc: "Build and deploy real cloud infrastructure — not just theory." },
  { icon: "🚀", title: "Career-Ready Skills", desc: "Graduate with skills employers are actively hiring for in cloud engineering." },
  { icon: "🤝", title: "Startup Partnerships", desc: "Collaborate with startups to solve real cloud challenges during training." },
  { icon: "📜", title: "Certification Prep", desc: "Structured path toward AWS Cloud Practitioner and Solutions Architect exams." },
  { icon: "🌍", title: "Community Access", desc: "Join a growing network of cloud engineers, mentors, and tech founders." },
];

const stats = [
  { value: "8 Weeks", label: "Program Duration" },
  { value: "AWS", label: "Cloud Provider" },
  { value: "100%", label: "Hands-On Learning" },
  { value: "∞", label: "Career Potential" },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-blue-300 text-sm font-medium">Now Enrolling — Cloud Engineering Foundations</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            Launch Your Career in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Cloud Engineering
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            DG-LETS Cloud Academy delivers practical, AWS-focused cloud training designed to take you from beginner to job-ready cloud engineer in 8 weeks.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/enroll" className="btn-primary text-base px-8 py-4">
              Enroll as a Student →
            </Link>
            <Link to="/partner" className="btn-secondary text-base px-8 py-4">
              Partner as a Startup
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-3xl mx-auto">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold text-blue-400">{value}</div>
                <div className="text-slate-400 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Why Learn Cloud Computing?</h2>
            <p className="section-subtitle mx-auto">
              Cloud skills are the most in-demand in tech. Here's what you gain at DG-LETS Cloud Academy.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map(({ icon, title, desc }) => (
              <div key={title} className="card hover:border-blue-500/30 transition-colors group">
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-400 transition-colors">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="badge bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">Featured Program</span>
              <h2 className="section-title mt-2">Cloud Engineering Foundations</h2>
              <p className="text-slate-400 mt-4 leading-relaxed">
                An intensive 8-week program covering core AWS services, cloud architecture principles, and hands-on deployment. Designed for beginners and career-switchers ready to break into cloud.
              </p>
              <ul className="mt-6 space-y-3">
                {["AWS Core Services (EC2, S3, Lambda, RDS)", "Cloud Architecture & Best Practices", "Infrastructure as Code with CloudFormation", "Security, IAM & Compliance Basics", "Final Capstone Project Deployment"].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-300 text-sm">
                    <span className="text-blue-400 mt-0.5">✓</span> {item}
                  </li>
                ))}
              </ul>
              <div className="flex gap-4 mt-8">
                <Link to="/program" className="btn-primary">View Full Curriculum</Link>
                <Link to="/enroll" className="btn-outline">Enroll Now</Link>
              </div>
            </div>
            <div className="card border-blue-500/20">
              <div className="space-y-4">
                {[
                  { week: "Weeks 1–2", topic: "Cloud Fundamentals & AWS Setup", color: "bg-blue-500" },
                  { week: "Weeks 3–4", topic: "Core AWS Services Deep Dive", color: "bg-cyan-500" },
                  { week: "Weeks 5–6", topic: "Architecture, Security & Networking", color: "bg-indigo-500" },
                  { week: "Weeks 7–8", topic: "Capstone Project & Certification Prep", color: "bg-purple-500" },
                ].map(({ week, topic, color }) => (
                  <div key={week} className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg">
                    <div className={`w-2 h-10 ${color} rounded-full flex-shrink-0`} />
                    <div>
                      <div className="text-xs text-slate-400">{week}</div>
                      <div className="text-white font-medium text-sm">{topic}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-blue-900/30 to-cyan-900/20 border-y border-blue-500/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Your Cloud Journey?</h2>
          <p className="text-slate-400 text-lg mb-8">
            Join the next cohort of DG-LETS Cloud Academy and build the skills that power the modern internet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/enroll" className="btn-primary text-base px-8 py-4">Get Started Today</Link>
            <Link to="/contact" className="btn-outline text-base px-8 py-4">Ask a Question</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
