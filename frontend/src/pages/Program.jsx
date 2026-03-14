import { Link } from "react-router-dom";

const curriculum = [
  {
    week: "Week 1–2",
    title: "Cloud Fundamentals & AWS Setup",
    color: "border-blue-500",
    topics: ["What is Cloud Computing?", "AWS Global Infrastructure", "IAM Users, Roles & Policies", "AWS CLI & Console Setup", "Billing, Pricing & Free Tier"],
  },
  {
    week: "Week 3–4",
    title: "Core AWS Services",
    color: "border-cyan-500",
    topics: ["EC2 — Virtual Servers", "S3 — Object Storage", "RDS & DynamoDB", "Lambda — Serverless Functions", "VPC & Networking Basics"],
  },
  {
    week: "Week 5–6",
    title: "Architecture, Security & Networking",
    color: "border-indigo-500",
    topics: ["Well-Architected Framework", "CloudFront & CDN", "API Gateway", "Security Groups & NACLs", "CloudWatch & Monitoring"],
  },
  {
    week: "Week 7–8",
    title: "Capstone Project & Cert Prep",
    color: "border-purple-500",
    topics: ["Deploy a Full-Stack App on AWS", "CloudFormation / IaC Basics", "AWS Cloud Practitioner Exam Prep", "Portfolio Project Review", "Career Guidance & Next Steps"],
  },
];

const skills = [
  "Deploy and manage EC2 instances",
  "Store and serve files with S3 and CloudFront",
  "Build serverless APIs with Lambda and API Gateway",
  "Manage databases with DynamoDB and RDS",
  "Implement IAM security best practices",
  "Monitor infrastructure with CloudWatch",
  "Design cost-optimized cloud architectures",
  "Prepare for AWS Cloud Practitioner exam",
];

const projects = [
  { title: "Static Website on AWS", desc: "Deploy a responsive website using S3 + CloudFront with custom domain.", tech: ["S3", "CloudFront", "Route 53"] },
  { title: "Serverless REST API", desc: "Build a fully serverless API using Lambda, API Gateway, and DynamoDB.", tech: ["Lambda", "API Gateway", "DynamoDB"] },
  { title: "Full-Stack Cloud App", desc: "Deploy a complete web application with frontend, backend, and database on AWS.", tech: ["EC2", "RDS", "S3", "CloudFront"] },
];

export default function Program() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-b from-blue-950/20 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="badge bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">8-Week Program</span>
          <h1 className="section-title text-5xl mt-2">Cloud Engineering Foundations</h1>
          <p className="section-subtitle mx-auto mt-4">
            A structured, hands-on program that takes you from zero to cloud-ready in 8 weeks.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-slate-400">
            <span>📅 Duration: 8 Weeks</span>
            <span>☁️ Platform: AWS</span>
            <span>🎯 Level: Beginner–Intermediate</span>
            <span>🏅 Cert Prep: Cloud Practitioner</span>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Curriculum Overview</h2>
            <p className="section-subtitle mx-auto">Week-by-week breakdown of what you'll learn.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {curriculum.map(({ week, title, color, topics }) => (
              <div key={week} className={`card border-l-4 ${color}`}>
                <div className="text-blue-400 text-sm font-medium mb-1">{week}</div>
                <h3 className="text-white font-bold text-lg mb-4">{title}</h3>
                <ul className="space-y-2">
                  {topics.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-slate-300 text-sm">
                      <span className="text-blue-400 mt-0.5 flex-shrink-0">→</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="section-title">Skills You'll Gain</h2>
              <p className="text-slate-400 mt-3 mb-8">Graduate with a portfolio of real cloud skills that employers are hiring for right now.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skills.map((skill) => (
                  <div key={skill} className="flex items-start gap-2 text-slate-300 text-sm">
                    <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span> {skill}
                  </div>
                ))}
              </div>
            </div>
            <div className="card border-blue-500/20">
              <h3 className="text-white font-bold text-lg mb-2">Who Is This For?</h3>
              <p className="text-slate-400 text-sm mb-6">This program is designed for:</p>
              <ul className="space-y-3">
                {[
                  "Complete beginners curious about cloud technology",
                  "Developers wanting to add cloud skills to their stack",
                  "IT professionals transitioning to cloud roles",
                  "Entrepreneurs building cloud-based products",
                  "Anyone preparing for AWS certifications",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-300 text-sm">
                    <span className="text-blue-400 flex-shrink-0">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Final Project Examples</h2>
            <p className="section-subtitle mx-auto">Real projects you'll build and deploy on AWS.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map(({ title, desc, tech }) => (
              <div key={title} className="card hover:border-blue-500/30 transition-colors">
                <h3 className="text-white font-bold mb-2">{title}</h3>
                <p className="text-slate-400 text-sm mb-4">{desc}</p>
                <div className="flex flex-wrap gap-2">
                  {tech.map((t) => (
                    <span key={t} className="badge bg-slate-700 text-slate-300 text-xs px-2 py-1">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-900/30 to-cyan-900/20 border-y border-blue-500/10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Enroll?</h2>
          <p className="text-slate-400 mb-8">Secure your spot in the next cohort of Cloud Engineering Foundations.</p>
          <Link to="/enroll" className="btn-primary text-base px-8 py-4">Apply Now →</Link>
        </div>
      </section>
    </div>
  );
}
