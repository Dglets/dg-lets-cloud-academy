import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { paymentAPI } from "../utils/api";

const BANK = {
  name: "Access Bank",
  accountNumber: "1232994549",
  accountName: "Emwenbun Daniel Osadolor",
};

const FEES = {
  "Cloud Engineering Foundations": 65000,
  "Web Development": 50000,
  registration: 10000,
};

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const prefill = location.state || {};

  const [form, setForm] = useState({
    fullName: prefill.fullName || "",
    email: prefill.email || "",
    phone: prefill.phone || "",
    program: prefill.program || "Cloud Engineering Foundations",
    paymentType: "registration",
    referenceNumber: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const programFee = FEES[form.program] || 65000;
  const paymentAmount = form.paymentType === "registration"
    ? FEES.registration
    : form.paymentType === "full"
    ? FEES.registration + programFee
    : programFee;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await paymentAPI.submit({ ...form, amount: `₦${paymentAmount.toLocaleString()}` });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Submission failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-4">
      <div className="card max-w-md w-full text-center border-green-500/20">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-white mb-2">Payment Proof Submitted!</h2>
        <p className="text-slate-400 mb-2">Your payment is being reviewed by the admin.</p>
        <p className="text-slate-400 mb-6">Once verified, your enrollment will be approved and you'll receive portal access.</p>
        <button onClick={() => navigate("/")} className="btn-primary w-full justify-center">Back to Home</button>
      </div>
    </div>
  );

  return (
    <div className="pt-16">
      <section className="py-16 bg-gradient-to-b from-green-950/20 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="badge bg-green-500/10 text-green-400 border border-green-500/20 mb-4">Payment</span>
            <h1 className="section-title text-4xl mt-2">Complete Your Payment</h1>
            <p className="section-subtitle mx-auto mt-3">Transfer to our bank account and submit your payment reference below.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bank Details */}
            <div className="space-y-4">
              <div className="card border-green-500/20">
                <h2 className="text-white font-bold text-lg mb-4">🏦 Bank Details</h2>
                <div className="space-y-3">
                  {[
                    { label: "Bank Name", value: BANK.name },
                    { label: "Account Name", value: BANK.accountName },
                    { label: "Account Number", value: BANK.accountNumber },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-400 text-sm">{label}</span>
                      <span className="text-white font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card border-yellow-500/20">
                <h2 className="text-white font-bold text-lg mb-4">💰 Fee Structure</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-400 text-sm">Registration & Form Fee</span>
                    <span className="text-yellow-400 font-bold">₦10,000</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-400 text-sm">Cloud Engineering Foundations</span>
                    <span className="text-blue-400 font-bold">₦65,000</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-400 text-sm">Web Development Bootcamp</span>
                    <span className="text-orange-400 font-bold">₦50,000</span>
                  </div>
                </div>
                <p className="text-slate-500 text-xs mt-4">* Registration fee is compulsory and must be paid before program fee.</p>
              </div>
            </div>

            {/* Payment Form */}
            <div className="card">
              <h2 className="text-white font-bold text-lg mb-5">📋 Submit Payment Proof</h2>
              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Full Name</label>
                  <input name="fullName" required value={form.fullName} onChange={handleChange} placeholder="John Doe" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Email Address</label>
                  <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="john@example.com" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Phone Number</label>
                  <input name="phone" required value={form.phone} onChange={handleChange} placeholder="+234 800 000 0000" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Program</label>
                  <select name="program" value={form.program} onChange={handleChange} className="input-field">
                    <option value="Cloud Engineering Foundations">Cloud Engineering Foundations</option>
                    <option value="Web Development">Web Development Bootcamp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Payment Type</label>
                  <select name="paymentType" value={form.paymentType} onChange={handleChange} className="input-field">
                    <option value="registration">Registration & Form Fee — ₦10,000</option>
                    <option value="program">Program Fee — ₦{programFee.toLocaleString()}</option>
                    <option value="full">Full Payment (Registration + Program)</option>
                  </select>
                </div>
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <span className="text-slate-400 text-sm">Amount to Pay: </span>
                  <span className="text-green-400 font-bold text-lg">₦{paymentAmount.toLocaleString()}</span>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Payment Reference Number</label>
                  <input name="referenceNumber" required value={form.referenceNumber} onChange={handleChange}
                    placeholder="Enter your bank transfer reference" className="input-field" />
                  <p className="text-slate-500 text-xs mt-1">Find this in your bank transfer receipt or SMS alert.</p>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5">
                  {loading ? "Submitting..." : "Submit Payment Proof →"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
