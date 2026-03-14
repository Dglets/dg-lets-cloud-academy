import useForm from "../hooks/useForm";
import { enrollmentAPI } from "../utils/api";
import FormField from "../components/FormField";
import Alert from "../components/Alert";

const initialValues = {
  fullName: "",
  email: "",
  phone: "",
  experienceLevel: "",
  preferredDate: "",
};

const validate = (values) => {
  const errors = {};
  if (!values.fullName.trim()) errors.fullName = "Full name is required";
  if (!values.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.email = "Valid email is required";
  if (!values.phone.trim()) errors.phone = "Phone number is required";
  if (!values.experienceLevel) errors.experienceLevel = "Please select your experience level";
  if (!values.preferredDate) errors.preferredDate = "Please select a preferred date";
  return errors;
};

export default function Enroll() {
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
        <div className="card max-w-md w-full text-center border-green-500/20">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">Enrollment Submitted!</h2>
          <p className="text-slate-400 mb-6">
            Thank you for enrolling. We'll review your application and reach out within 2–3 business days.
          </p>
          <button onClick={() => setSuccess(false)} className="btn-primary w-full justify-center">
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <section className="py-24 bg-gradient-to-b from-blue-950/20 to-transparent">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="badge bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">Student Enrollment</span>
            <h1 className="section-title text-4xl mt-2">Enroll in Cloud Engineering Foundations</h1>
            <p className="section-subtitle mx-auto mt-3">
              Fill out the form below to apply for the next cohort. We'll be in touch shortly.
            </p>
          </div>

          <div className="card">
            <Alert type="error" message={apiError} />
            <form onSubmit={handleSubmit} className="space-y-5 mt-2">
              <FormField label="Full Name" error={errors.fullName} required>
                <input
                  type="text"
                  name="fullName"
                  value={values.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="input-field"
                />
              </FormField>

              <FormField label="Email Address" error={errors.email} required>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="input-field"
                />
              </FormField>

              <FormField label="Phone Number" error={errors.phone} required>
                <input
                  type="tel"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                  className="input-field"
                />
              </FormField>

              <FormField label="Experience Level" error={errors.experienceLevel} required>
                <select name="experienceLevel" value={values.experienceLevel} onChange={handleChange} className="input-field">
                  <option value="">Select your level</option>
                  <option value="beginner">Beginner — No cloud experience</option>
                  <option value="intermediate">Intermediate — Some cloud/IT knowledge</option>
                  <option value="advanced">Advanced — Looking to deepen expertise</option>
                </select>
              </FormField>

              <FormField label="Preferred Program Start Date" error={errors.preferredDate} required>
                <input
                  type="date"
                  name="preferredDate"
                  value={values.preferredDate}
                  onChange={handleChange}
                  className="input-field"
                  min={new Date().toISOString().split("T")[0]}
                />
              </FormField>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5">
                {loading ? "Submitting..." : "Submit Enrollment Application →"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
