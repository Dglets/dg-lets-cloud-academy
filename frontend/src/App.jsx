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
import InstructorLogin from "./pages/InstructorLogin";
import InstructorDashboard from "./pages/InstructorDashboard";
import NotFound from "./pages/NotFound";

const noFooterRoutes = ["/admin", "/admin/dashboard", "/instructor", "/instructor/dashboard"];

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
        <Route path="/" element={<Layout pathname="/"><Home /></Layout>} />
        <Route path="/about" element={<Layout pathname="/about"><About /></Layout>} />
        <Route path="/program" element={<Layout pathname="/program"><Program /></Layout>} />
        <Route path="/enroll" element={<Layout pathname="/enroll"><Enroll /></Layout>} />
        <Route path="/partner" element={<Layout pathname="/partner"><Partner /></Layout>} />
        <Route path="/blog" element={<Layout pathname="/blog"><Blog /></Layout>} />
        <Route path="/coming-soon" element={<Layout pathname="/coming-soon"><ComingSoon /></Layout>} />
        <Route path="/web-development" element={<Layout pathname="/web-development"><WebDevelopment /></Layout>} />
        <Route path="/payment" element={<Layout pathname="/payment"><Payment /></Layout>} />
        <Route path="/contact" element={<Layout pathname="/contact"><Contact /></Layout>} />
        <Route path="/admin" element={<Layout pathname="/admin"><AdminLogin /></Layout>} />
        <Route path="/admin/dashboard" element={<Layout pathname="/admin/dashboard"><AdminDashboard /></Layout>} />
        <Route path="/student" element={<Layout pathname="/student"><StudentLogin /></Layout>} />
        <Route path="/student/dashboard" element={<Layout pathname="/student/dashboard"><StudentDashboard /></Layout>} />
        <Route path="/instructor" element={<Layout pathname="/instructor"><InstructorLogin /></Layout>} />
        <Route path="/instructor/dashboard" element={<Layout pathname="/instructor/dashboard"><InstructorDashboard /></Layout>} />
        <Route path="*" element={<Layout pathname="*"><NotFound /></Layout>} />
      </Routes>
      <AiAssistant />
    </BrowserRouter>
  );
}
