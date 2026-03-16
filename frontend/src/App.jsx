import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AiAssistant from "./components/AiAssistant";
import Home from "./pages/Home";
import About from "./pages/About";
import Program from "./pages/Program";
import Enroll from "./pages/Enroll";
import Partner from "./pages/Partner";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import ComingSoon from "./pages/ComingSoon";
import WebDevelopment from "./pages/WebDevelopment";
import Payment from "./pages/Payment";
import AdminDashboard from "./pages/AdminDashboard";
import StudentLogin from "./pages/StudentLogin";
import StudentDashboard from "./pages/StudentDashboard";
import NotFound from "./pages/NotFound";

const noFooterRoutes = ["/admin", "/admin/dashboard"];

function Layout({ children, pathname }) {
  const showFooter = !noFooterRoutes.includes(pathname);
  return (
    <>
      <Navbar />
      <main>{children}</main>
      {showFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/program" element={<Layout><Program /></Layout>} />
        <Route path="/enroll" element={<Layout><Enroll /></Layout>} />
        <Route path="/partner" element={<Layout><Partner /></Layout>} />
        <Route path="/blog" element={<Layout><Blog /></Layout>} />
        <Route path="/coming-soon" element={<Layout><ComingSoon /></Layout>} />
        <Route path="/web-development" element={<Layout><WebDevelopment /></Layout>} />
        <Route path="/payment" element={<Layout><Payment /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/admin" element={<Layout><AdminLogin /></Layout>} />
        <Route path="/admin/dashboard" element={<Layout><AdminDashboard /></Layout>} />
        <Route path="/student" element={<Layout><StudentLogin /></Layout>} />
        <Route path="/student/dashboard" element={<Layout><StudentDashboard /></Layout>} />
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
      <AiAssistant />
    </BrowserRouter>
  );
}
