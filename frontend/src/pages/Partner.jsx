import useForm from "../hooks/useForm";
import { partnershipAPI } from "../utils/api";
import FormField from "../components/FormField";
import Alert from "../components/Alert";

const initialValues = {
  companyName: "",
  website: "",
  contactPerson: "",
  email: "",
  partnershipInterest: "",
  message: "",
};

const validate = (values) => {
  const errors = {};
  if (!values.companyName.trim()) errors.companyName = "Company name is required";
  if (!values.contactPerson.trim()) errors.contactPerson = "Contact person is required";
  if (!values.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.email = "Valid email is required";
  if (!values.partnershipInterest) errors.partnershipInterest = "Please select a partnership type";
  return errors;
};

const partnershipTypes = [
  "Co-host cloud training programs",
  "Sponsor student cohorts",
  "Provide internship opportunities",
  "Technical mentorship collaboration",
  "Custom cloud training for your team",
  "Other",
];

const benefits = [
  { icon: "🎓", title: "Trained Talent Pipeline", desc: "Get early access to trained cloud engineers from our cohorts." },
  { icon: "📣", title: "Brand Visibility", desc: "Your company featured as a partner across our platform and materials." },
  { icon: "🛠️", title: "Custom Training", desc: "We can design cloud training programs tailored to your team's needs." },
  { icon: "🌐", title: "Community Access", desc: "Connect with our growing network of cloud engineers and tech founders." },
];

export default function Partner() {
  const { values, errors, setErrors, loading, setLoading, success, setSuccess, apiError, setApiError, handleChange, reset } = useForm(initialValues);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) return setErrors(validationErrors);

    setLoading(true);
    setApiError("");
    try {
      await partnershipAPI.submit(values);
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
        <div className="card max-w-md w-full text-center border-green-500/20">
          <div className="text-5xl mb-4">🤝</div>
          <h2 className="text-2xl font-bold text-white mb-2">Partnership Request Received!</h2>
          <p className="text-slate-400 mb-6">
            Thank you for your interest in partnering with DG-LETS Cloud Academy. We'll review your request and reach out within 3–5 business days.
          </p>
          <button onClick={() => setSuccess(false)} className="btn-primary w-full justify-center">
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <section className="py-24 bg-gradient-to-b from-blue-950/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="badge bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">Startup Partnerships</span>
            <h1 className="section-title text-5xl mt-2">Partner With DG-LETS Cloud Academy</h1>
            <p className="section-subtitle mx-auto mt-3">
              Collaborate with us to run cloud training programs, sponsor cohorts, or build a talent pipeline for your startup.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Benefits */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-8">Why Partner With Us?</h2>
              <div className="space-y-4">
                {benefits.map(({ icon, title, desc }) => (
                  <div key={title} className="flex gap-4 card">
                    <span className="text-2xl flex-shrink-0">{icon}</span>
                    <div>
                      <h3 className="text-white font-semibold">{title}</h3>
                      <p className="text-slate-400 text-sm mt-1">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-6">Submit a Partnership Request</h2>
              <Alert type="error" message={apiError} />
              <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                <FormField label="Company Name" error={errors.companyName} required>
                  <input type="text" name="companyName" value={values.companyName} onChange={handleChange} placeholder="Acme Inc." className="input-field" />
                </FormField>

                <FormField label="Company Website" error={errors.website}>
                  <input type="url" name="website" value={values.website} onChange={handleChange} placeholder="https://yourcompany.com" className="input-field" />
                </FormField>

                <FormField label="Contact Person" error={errors.contactPerson} required>
                  <input type="text" name="contactPerson" value={values.contactPerson} onChange={handleChange} placeholder="Jane Smith" className="input-field" />
                </FormField>

                <FormField label="Email Address" error={errors.email} required>
                  <input type="email" name="email" value={values.email} onChange={handleChange} placeholder="jane@company.com" className="input-field" />
                </FormField>

                <FormField label="Partnership Interest" error={errors.partnershipInterest} required>
                  <select name="partnershipInterest" value={values.partnershipInterest} onChange={handleChange} className="input-field">
                    <option value="">Select partnership type</option>
                    {partnershipTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </FormField>

                <FormField label="Message" error={errors.message}>
                  <textarea name="message" value={values.message} onChange={handleChange} rows={4} placeholder="Tell us more about your goals and how you'd like to collaborate..." className="input-field resize-none" />
                </FormField>

                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5">
                  {loading ? "Submitting..." : "Submit Partnership Request →"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
