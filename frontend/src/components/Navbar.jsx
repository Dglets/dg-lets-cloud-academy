import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/program", label: "Program" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DG</span>
            </div>
            <span className="font-bold text-white text-lg hidden sm:block">
              DG-LETS <span className="text-blue-400">Cloud Academy</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "text-blue-400 bg-blue-500/10" : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate("/enroll")} className="btn-primary text-sm py-2 px-4">
              Enroll Now
            </button>
            <button onClick={() => navigate("/partner")} className="btn-secondary text-sm py-2 px-4">
              Partner With Us
            </button>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm font-medium ${
                  isActive ? "text-blue-400 bg-blue-500/10" : "text-slate-300"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <Link to="/enroll" onClick={() => setOpen(false)} className="btn-primary text-sm justify-center">
              Enroll Now
            </Link>
            <Link to="/partner" onClick={() => setOpen(false)} className="btn-secondary text-sm justify-center">
              Partner With Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
