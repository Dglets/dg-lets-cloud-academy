import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-extrabold text-blue-600/20 mb-4">404</div>
        <h1 className="text-3xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-slate-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary">← Back to Home</Link>
      </div>
    </div>
  );
}
