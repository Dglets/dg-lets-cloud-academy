import { Link } from "react-router-dom";

const milestones = [
  { year: "2006", event: "First introduced to computers at Air Force Nursery and Primary School, Oloje, Ilorin, Kwara State — curiosity sparked." },
  { year: "2010s", event: "Secondary school deepened my understanding of computers and technology fundamentals." },
  { year: "2023", event: "Completed a Diploma in Computer Studies, then began learning web development — starting with frontend." },
  { year: "2024", event: "Expanded into backend development and cloud computing, building full-stack skills." },
  { year: "2025", event: "Went deeper into cloud — studying AWS architecture, serverless, and cloud infrastructure." },
  { year: "2026", event: "Earned AWS Cloud Practitioner certificate from AWS Skill Builder and Cloud Engineer certificate from Skulltech under Seyi Tinubu's 10,000 On-Demand Tech Skill Initiative." },
  { year: "2026", event: "Built DG-LETS AGRI AND TECH — a platform integrating technology into agriculture using web dev and cloud skills." },
  { year: "Now", event: "Running DG-LETS Cloud Academy — training others in cloud and tech at affordable prices, driven by a passion for teaching." },
];

const values = [
  { icon: "🎯", title: "Practical First", desc: "Every concept is taught through real-world application, not just slides." },
  { icon: "🌱", title: "Accessible Learning", desc: "Cloud education should be available to everyone, regardless of background or budget." },
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
            From a curious primary school student in Ilorin to a certified cloud engineer and educator — here's the story behind DG-LETS Cloud Academy.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-6 text-slate-300 leading-relaxed">
              <p>
                My curiosity about computers started around <em className="text-blue-400">2006</em>, when I was first introduced to them at <strong className="text-white">Air Force Nursery and Primary School, Oloje, Ilorin, Kwara State</strong>. That early exposure planted a seed that never stopped growing.
              </p>
              <p>
                Through secondary school, I kept learning — building on the fundamentals and developing a genuine love for technology. In <strong className="text-white">2023</strong>, I formalized that passion by completing a <strong className="text-white">Diploma in Computer Studies</strong>, then immediately dove into web development, starting with the frontend.
              </p>
              <p>
                By <strong className="text-white">2024/2025</strong>, I had expanded into backend development and cloud computing — learning how to build full systems from the interface all the way to the infrastructure that powers them.
              </p>
              <p>
                In <strong className="text-white">2026</strong>, I earned two certifications: an <strong className="text-white">AWS Cloud Practitioner</strong> certificate from AWS Skill Builder, and a <strong className="text-white">Cloud Engineer</strong> certificate from Skulltech — part of <em className="text-blue-400">Seyi Tinubu's 10,000 On-Demand Tech Skill Initiative</em>.
              </p>
              <p>
                I also built <strong className="text-white">DG-LETS AGRI AND TECH</strong> — a platform that combines my web development and cloud skills to integrate technology into agriculture, solving real problems with real tools.
              </p>
              <p>
                But beyond building, I'm driven by a deep passion for <strong className="text-white">teaching and imparting knowledge</strong>. With experience as an educator and a belief that tech should be accessible to all, I built this platform to train others at affordable prices — so more people can benefit from the tech world the way I have.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold text-xl mb-6">My Journey Timeline</h3>
              {milestones.map(({ year, event }, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {year === "Now" ? "🚀" : year === "2010s" ? "10s" : year.slice(2)}
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

      {/* Certifications */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card border-blue-500/20 text-center">
              <div className="text-5xl mb-4">🏅</div>
              <h3 className="text-white font-bold text-xl mb-2">AWS Cloud Practitioner</h3>
              <p className="text-slate-400 text-sm mb-4">Issued by AWS Skill Builder — covering cloud concepts, core services, security, architecture, pricing, and support.</p>
              <div className="flex flex-wrap justify-center gap-2">
                {["EC2", "S3", "Lambda", "DynamoDB", "CloudFront", "IAM", "API Gateway", "CloudFormation"].map((s) => (
                  <span key={s} className="badge bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs px-3 py-1">{s}</span>
                ))}
              </div>
            </div>
            <div className="card border-purple-500/20 text-center">
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-white font-bold text-xl mb-2">Cloud Engineer</h3>
              <p className="text-slate-400 text-sm mb-4">Issued by Skulltech under Seyi Tinubu's <em className="text-purple-400">10,000 On-Demand Tech Skill Initiative</em> — hands-on cloud engineering training.</p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Cloud Architecture", "AWS Services", "Serverless", "DevOps", "Infrastructure", "Security"].map((s) => (
                  <span key={s} className="badge bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs px-3 py-1">{s}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-10 text-center">
            <Link to="/enroll" className="btn-primary">Start Your Own Journey</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
