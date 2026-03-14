import { Link } from "react-router-dom";

const milestones = [
  { year: "2023", event: "Started learning cloud computing fundamentals and web development." },
  { year: "2024", event: "Completed AWS Cloud Practitioner training — understanding core AWS services, pricing, and architecture." },
  { year: "2024", event: "Founded DG-LETS Cloud Academy to share cloud knowledge and help others break into tech." },
  { year: "2025", event: "Actively upskilling toward AWS Solutions Architect certification." },
  { year: "Future", event: "Build a full cloud training ecosystem with startup partnerships and certification programs." },
];

const values = [
  { icon: "🎯", title: "Practical First", desc: "Every concept is taught through real-world application, not just slides." },
  { icon: "🌱", title: "Accessible Learning", desc: "Cloud education should be available to everyone, regardless of background." },
  { icon: "🤝", title: "Community Driven", desc: "Learning is better together — we build a network, not just a course." },
  { icon: "📈", title: "Career Focused", desc: "Every lesson is designed with your career outcome in mind." },
];

export default function About() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-b from-blue-950/20 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="badge bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">About the Instructor</span>
          <h1 className="section-title text-5xl mt-2">My Cloud Journey</h1>
          <p className="section-subtitle mx-auto mt-4">
            From curious learner to cloud instructor — here's the story behind DG-LETS Cloud Academy.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-6 text-slate-300 leading-relaxed">
              <p>
                My journey into cloud computing started with a simple question: <em className="text-blue-400">"How does the internet actually work at scale?"</em> That curiosity led me down a path of learning AWS, understanding distributed systems, and discovering the power of cloud infrastructure.
              </p>
              <p>
                I completed my <strong className="text-white">AWS Cloud Practitioner training</strong>, which gave me a solid foundation in cloud concepts — from core services like EC2, S3, and Lambda, to understanding cloud economics, security, and the shared responsibility model.
              </p>
              <p>
                But I didn't stop there. I'm constantly upskilling, working toward my <strong className="text-white">AWS Solutions Architect certification</strong> — learning how to design resilient, scalable, and cost-optimized cloud architectures.
              </p>
              <p>
                I also bring <strong className="text-white">web development skills</strong> to the table, which means I understand the full stack — from frontend interfaces to backend APIs to the cloud infrastructure that powers them all.
              </p>
              <p>
                DG-LETS Cloud Academy was born from a desire to <strong className="text-white">democratize cloud education</strong> — to give aspiring engineers the practical, structured training they need to land real cloud jobs and build real cloud products.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold text-xl mb-6">My Journey Timeline</h3>
              {milestones.map(({ year, event }, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {year === "Future" ? "🚀" : year.slice(2)}
                    </div>
                    {i < milestones.length - 1 && <div className="w-0.5 h-full bg-slate-700 mt-2" />}
                  </div>
                  <div className="pb-6">
                    <div className="text-blue-400 text-sm font-medium">{year}</div>
                    <div className="text-slate-300 text-sm mt-1">{event}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">My Mission & Values</h2>
            <p className="section-subtitle mx-auto">
              Everything at DG-LETS Cloud Academy is built around these core principles.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon, title, desc }) => (
              <div key={title} className="card text-center">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-slate-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AWS Credentials */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card border-blue-500/20 text-center">
            <div className="text-5xl mb-4">🏅</div>
            <h3 className="text-white font-bold text-2xl mb-2">AWS Cloud Practitioner</h3>
            <p className="text-slate-400 mb-6">
              Certified in AWS fundamentals — cloud concepts, core services, security, architecture, pricing, and support.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["AWS EC2", "Amazon S3", "AWS Lambda", "DynamoDB", "CloudFront", "IAM", "API Gateway", "CloudFormation"].map((skill) => (
                <span key={skill} className="badge bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs px-3 py-1">
                  {skill}
                </span>
              ))}
            </div>
            <div className="mt-8">
              <Link to="/enroll" className="btn-primary">Learn These Skills With Me</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
