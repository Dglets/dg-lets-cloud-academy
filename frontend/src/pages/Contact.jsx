import useForm from "../hooks/useForm";
import { contactAPI } from "../utils/api";
import FormField from "../components/FormField";
import Alert from "../components/Alert";

const initialValues = { name: "", email: "", subject: "", message: "" };

const validate = (values) => {
  const errors = {};
  if (!values.name.trim()) errors.name = "Name is required";
  if (!values.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.email = "Valid email is required";
  if (!values.message.trim()) errors.message = "Message is required";
  return errors;
};

const contactInfo = [
  { icon: "📧", label: "Email", value: "hello@dg-lets.com", href: "mailto:hello@dg-lets.com" },
  { icon: "💼", label: "LinkedIn", value: "linkedin.com/in/dg-lets", href: "https://linkedin.com" },
  { icon: "🐙", label: "GitHub", value: "github.com/dg-lets", href: "https://github.com" },
  { icon: "🐦", label: "Twitter / X", value: "@dg_lets_cloud", href: "https://twitter.com" },
];

export default function Contact() {
  const { values, errors, setErrors, loading, setLoading, success, setSuccess, apiError, setApiError, handleChange, reset } = useForm(initialValues);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) return setErrors(validationErrors);

    setLoading(true);
    setApiError("");
    try {
      await contactAPI.submit(values);
      setSuccess(true);
      reset();
    } catch (err) {
      setApiError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16">
      <section className="py-24 bg-gradient-to-b from-blue-950/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="badge bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">Get In Touch</span>
            <h1 className="section-title text-5xl mt-2">Contact Us</h1>
            <p className="section-subtitle mx-auto mt-3">
              Have a question about the program, a partnership idea, or just want to say hello? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-8">Reach Out Directly</h2>
              <div className="space-y-4">
                {contactInfo.map(({ icon, label, value, href }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer"
                    className="flex items-center gap-4 card hover:border-blue-500/30 transition-colors group">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <div className="text-slate-400 text-xs">{label}</div>
                      <div className="text-white font-medium group-hover:text-blue-400 transition-colors">{value}</div>
                    </div>
                  </a>
                ))}
              </div>

              <div className="card mt-8 border-blue-500/20">
                <h3 className="text-white font-semibold mb-2">Response Time</h3>
                <p className="text-slate-400 text-sm">
                  We typically respond to all inquiries within <strong className="text-white">1–2 business days</strong>. For urgent matters, reach out directly via email.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-6">Send a Message</h2>
              {success && <Alert type="success" message="Your message has been sent! We'll get back to you soon." />}
              <Alert type="error" message={apiError} />
              <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                <FormField label="Your Name" error={errors.name} required>
                  <input type="text" name="name" value={values.name} onChange={handleChange} placeholder="John Doe" className="input-field" />
                </FormField>

                <FormField label="Email Address" error={errors.email} required>
                  <input type="email" name="email" value={values.email} onChange={handleChange} placeholder="john@example.com" className="input-field" />
                </FormField>

                <FormField label="Subject" error={errors.subject}>
                  <input type="text" name="subject" value={values.subject} onChange={handleChange} placeholder="What's this about?" className="input-field" />
                </FormField>

                <FormField label="Message" error={errors.message} required>
                  <textarea name="message" value={values.message} onChange={handleChange} rows={5} placeholder="Tell us how we can help..." className="input-field resize-none" />
                </FormField>

                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5">
                  {loading ? "Sending..." : "Send Message →"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
