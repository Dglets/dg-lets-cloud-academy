import { Link } from "react-router-dom";
import useForm from "../hooks/useForm";
import { enrollmentAPI } from "../utils/api";
import FormField from "../components/FormField";
import Alert from "../components/Alert";

const curriculum = [
  {
    week: "Week 1–2",
    title: "HTML, CSS & Responsive Design",
    color: "border-orange-500",
    topics: ["HTML5 Semantics & Structure", "CSS3 Flexbox & Grid", "Responsive Design & Media Queries", "Tailwind CSS Basics", "UI/UX Fundamentals"],
  },
  {
    week: "Week 3–4",
    title: "JavaScript & DOM",
    color: "border-yellow-500",
    topics: ["JavaScript ES6+", "DOM Manipulation", "Events & Forms", "Fetch API & REST", "Local Storage & JSON"],
  },
  {
    week: "Week 5–6",
    title: "React & Frontend Frameworks",
    color: "border-blue-500",
    topics: ["React Components & Props", "State & Hooks", "React Router", "API Integration", "Component Libraries"],
  },
  {
    week: "Week 7–8",
    title: "Backend, Databases & Deployment",
    color: "border-green-500",
    topics: ["Node.js & Express", "REST API Development", "MongoDB / PostgreSQL", "Authentication & JWT", "Deploy on AWS / Vercel"],
  },
];

const initialValues = { fullName: "", email: "", phone: "", experienceLevel: "", preferredDate: "", program: "Web Development" };

const validate = (values) => {
  const errors = {};
  if (!values.fullName.trim()) errors.fullName = "Full name is required";
  if (!values.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.email = "Valid email is required";
  if (!values.phone.trim()) errors.phone = "Phone number is required";
  if (!values.experienceLevel) errors.experienceLevel = "Please select your experience level";
  if (!values.preferredDate) errors.preferredDate = "Please select a preferred date";
  return errors;
};

export default function WebDevelopment() {
  const { values, errors, setErrors, loading, setLoading, success, setSuccess, apiError, setApiError, handleChange, reset } = useForm(initialValues);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) return setErrors(validationErrors);
    setLoading(true);
    setApiError("");
    try {
      await enrollmentAPI.submit(values);
      setSuccess(true);
      reset();
    } catch (err) {
      setApiError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-md w-full text-center border-orange-500/20">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">Enrollment Submitted!</h2>
          <p className="text-slate-400 mb-6">Thank you for enrolling in Web Development. We'll review your application and reach out within 2–3 business days.</p>
          <button onClick={() => setSuccess(false)} className="btn-primary w-full justify-center">Submit Another Application</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-orange-950/20 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="badge bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-4">8-Week Program</span>
          <h1 className="section-title text-5xl mt-2">Web Development Bootcamp</h1>
          <p className="section-subtitle mx-auto mt-4">
            Go from zero to full-stack web developer in 8 weeks. Build real projects with HTML, CSS, JavaScript, React, Node.js, and deploy them on the cloud.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-slate-400">
            <span>📅 Duration: 8 Weeks</span>
            <span>💻 Stack: HTML · CSS · JS · React · Node</span>
            <span>🎯 Level: Beginner–Intermediate</span>
            <span>☁️ Deploy on AWS</span>
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
                <div className="text-orange-400 text-sm font-medium mb-1">{week}</div>
                <h3 className="text-white font-bold text-lg mb-4">{title}</h3>
                <ul className="space-y-2">
                  {topics.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-slate-300 text-sm">
                      <span className="text-orange-400 mt-0.5 flex-shrink-0">→</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you'll build */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Projects You'll Build</h2>
            <p className="section-subtitle mx-auto">Real projects for your portfolio.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Portfolio Website", desc: "Build and deploy your personal portfolio using HTML, CSS, and Tailwind.", tech: ["HTML", "CSS", "Tailwind"] },
              { title: "React Dashboard App", desc: "Build a dynamic dashboard with React, hooks, and a public API.", tech: ["React", "JavaScript", "REST API"] },
              { title: "Full-Stack Web App", desc: "Build and deploy a complete app with Node.js backend and React frontend on AWS.", tech: ["Node.js", "React", "AWS"] },
            ].map(({ title, desc, tech }) => (
              <div key={title} className="card hover:border-orange-500/30 transition-colors">
                <h3 className="text-white font-bold mb-2">{title}</h3>
                <p className="text-slate-400 text-sm mb-4">{desc}</p>
                <div className="flex flex-wrap gap-2">
                  {tech.map((t) => <span key={t} className="badge bg-slate-700 text-slate-300 text-xs px-2 py-1">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollment Form */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-title">Enroll Now</h2>
            <p className="section-subtitle mx-auto mt-3">Fill out the form below to apply for the next cohort.</p>
          </div>
          <div className="card">
            <Alert type="error" message={apiError} />
            <form onSubmit={handleSubmit} className="space-y-5 mt-2">
              <FormField label="Full Name" error={errors.fullName} required>
                <input type="text" name="fullName" value={values.fullName} onChange={handleChange} placeholder="John Doe" className="input-field" />
              </FormField>
              <FormField label="Email Address" error={errors.email} required>
                <input type="email" name="email" value={values.email} onChange={handleChange} placeholder="john@example.com" className="input-field" />
              </FormField>
              <FormField label="Phone Number" error={errors.phone} required>
                <input type="tel" name="phone" value={values.phone} onChange={handleChange} placeholder="+1 234 567 8900" className="input-field" />
              </FormField>
              <FormField label="Experience Level" error={errors.experienceLevel} required>
                <select name="experienceLevel" value={values.experienceLevel} onChange={handleChange} className="input-field">
                  <option value="">Select your level</option>
                  <option value="beginner">Beginner — No coding experience</option>
                  <option value="intermediate">Intermediate — Some HTML/CSS/JS knowledge</option>
                  <option value="advanced">Advanced — Looking to go full-stack</option>
                </select>
              </FormField>
              <FormField label="Preferred Program Start Date" error={errors.preferredDate} required>
                <input type="date" name="preferredDate" value={values.preferredDate} onChange={handleChange} className="input-field" min={new Date().toISOString().split("T")[0]} />
              </FormField>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5">
                {loading ? "Submitting..." : "Submit Enrollment Application →"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Also interested in Cloud? */}
      <section className="py-16 bg-gradient-to-r from-blue-900/30 to-cyan-900/20 border-y border-blue-500/10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Also Interested in Cloud Engineering?</h2>
          <p className="text-slate-400 mb-6">Check out our flagship Cloud Engineering Foundations program and launch your AWS career.</p>
          <Link to="/program" className="btn-primary text-base px-8 py-3">View Cloud Program →</Link>
        </div>
      </section>
    </div>
  );
}
