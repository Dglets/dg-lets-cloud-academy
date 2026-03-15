import { useState, useRef, useEffect } from "react";

const faqs = [
  {
    keywords: ["enroll", "sign up", "register", "join", "apply"],
    answer: "To enroll, click 'Enroll as a Student' on the homepage or visit /enroll. Fill in your name, email, phone, experience level, and preferred start date.",
  },
  {
    keywords: ["program", "curriculum", "course", "learn", "teach", "week", "duration"],
    answer: "The Cloud Engineering Foundations program is 8 weeks long. It covers AWS Core Services, Cloud Architecture, Infrastructure as Code, Security & IAM, and ends with a Capstone Project.",
  },
  {
    keywords: ["partner", "startup", "partnership", "collaborate", "business"],
    answer: "Startups can partner with us via the /partner page. Fill out the partnership form with your company details and area of interest.",
  },
  {
    keywords: ["blog", "article", "post", "read"],
    answer: "Visit the /blog page to read our latest cloud engineering articles and tutorials.",
  },
  {
    keywords: ["contact", "reach", "support", "help", "question", "email"],
    answer: "You can reach us via the /contact page. Fill out the contact form and we'll get back to you shortly.",
  },
  {
    keywords: ["cost", "price", "fee", "pay", "free"],
    answer: "For pricing and enrollment fees, please visit the /enroll page or contact us directly via /contact.",
  },
  {
    keywords: ["admin", "login", "dashboard"],
    answer: "The admin panel is at /admin. It's restricted to authorized administrators only.",
  },
  {
    keywords: ["aws", "amazon", "cloud", "certification", "certificate"],
    answer: "Our program prepares you for AWS Cloud Practitioner and Solutions Architect certifications through hands-on labs and structured study paths.",
  },
  {
    keywords: ["beginner", "experience", "level", "background", "prerequisite"],
    answer: "We welcome all experience levels — beginner, intermediate, and advanced. No prior cloud experience is required for the Foundations program.",
  },
];

function getAnswer(input) {
  const lower = input.toLowerCase();
  for (const faq of faqs) {
    if (faq.keywords.some((kw) => lower.includes(kw))) return faq.answer;
  }
  return "I'm not sure about that. Try visiting our /contact page or ask about enrollment, the program, partnerships, or blog.";
}

const suggestions = ["How do I enroll?", "What does the program cover?", "How can a startup partner?", "Is it beginner-friendly?"];

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! 👋 I'm your DG-LETS assistant. Ask me anything about the platform." },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function send(text) {
    const userMsg = text || input.trim();
    if (!userMsg) return;
    setMessages((prev) => [...prev, { from: "user", text: userMsg }, { from: "bot", text: getAnswer(userMsg) }]);
    setInput("");
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-blue-600">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <span className="text-white font-semibold text-sm">DG-LETS Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white text-lg leading-none">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`text-sm px-3 py-2 rounded-xl max-w-[85%] leading-relaxed ${
                  msg.from === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-slate-800 text-slate-200 rounded-bl-none"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s} onClick={() => send(s)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 rounded-full px-3 py-1 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-3 border-t border-slate-700">
            <input
              className="flex-1 bg-slate-800 text-white text-sm rounded-lg px-3 py-2 outline-none placeholder-slate-500 border border-slate-700 focus:border-blue-500"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button onClick={() => send()}
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-3 py-2 text-sm transition-colors">
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-all"
      >
        {open ? "✕" : "🤖"}
      </button>
    </div>
  );
}
