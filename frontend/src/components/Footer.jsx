import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DG</span>
              </div>
              <span className="font-bold text-white text-lg">
                DG-LETS <span className="text-blue-400">Cloud Academy</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Empowering the next generation of cloud engineers through practical, industry-aligned training programs.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">LinkedIn</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">Twitter</a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">GitHub</a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              {[["Home", "/"], ["About", "/about"], ["Program", "/program"], ["Blog", "/blog"], ["Contact", "/contact"]].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-slate-400 hover:text-white text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Get Started</h4>
            <ul className="space-y-2">
              {[["Enroll as Student", "/enroll"], ["Partner as Startup", "/partner"], ["Admin Dashboard", "/admin"]].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-slate-400 hover:text-white text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} DG-LETS Cloud Academy. All rights reserved.</p>
          <p className="text-slate-500 text-sm">Built with ☁️ on AWS</p>
        </div>
      </div>
    </footer>
  );
}
