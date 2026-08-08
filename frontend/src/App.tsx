// src/App.tsx
import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import PastEvents from "./pages/Events";
import Team from "./pages/Team";
import Domains from "./pages/Domains";
import BlogPostPage from "./pages/BlogPostPage";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
// import About from "./pages/About";
import Contact from "./pages/Contact";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import RegisterOtpPage from "./pages/RegisterOtp";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ForgotPasswordOtpPage from "./pages/ForgotPasswordOtp";
import ChangeForgottenPasswordPage from "./pages/ChangeForgottenPassword";
import SettingsPage from "./pages/Settings";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ScrollToTop from "./components/ScrollTop";
import Sidebar from "./components/Sidebar";
import SpotlightCursor from "./components/CustomCursor";
import { ToastProvider } from "./components/ToastProvider";
import type { UserRole } from "./context/AuthContext";

function AppWrapper() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/register/verify-otp" ||
    location.pathname.startsWith("/forgot-password");
  const isDomainPage = location.pathname.startsWith("/domains");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const AuthLoadingState = () => (
    <div
      className="flex min-h-screen items-center justify-center bg-canvas px-4 text-ink"
      role="status"
      aria-live="polite"
    >
      <span className="rounded-control border border-line bg-surface px-4 py-3 text-sm font-semibold shadow-soft">
        Checking your session...
      </span>
    </div>
  );

  const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) return <AuthLoadingState />;
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
  };

  const RoleRoute = ({ allowedRoles }: { allowedRoles: UserRole[] }) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) return <AuthLoadingState />;
    if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
    if (!allowedRoles.includes(user.role)) {
      return (
        <Navigate
          to={user.role === "admin" ? "/admin/dashboard" : "/student/dashboard"}
          replace
        />
      );
    }

    return <Outlet />;
  };

  useEffect(() => {
    setSidebarOpen(false); // close sidebar on route change
  }, [location]);

  // This effect adds/removes a class to the body to hide the default cursor
  // useEffect(() => {
  //   if (isDark) {
  //     document.body.classList.add('dark-cursor');
  //   } else {
  //     document.body.classList.remove('dark-cursor');
  //   }
  // }, [isDark]);

  return (
    <div
      id="scroll-container"
      className="min-h-screen h-full w-full overflow-y-auto bg-slate-50 dark:bg-gray-950 transition-colors duration-300"
    >
      <SpotlightCursor /> {/* <-- Add the cursor component here */}
      
      {!isAuthPage && <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />}
      {!isAuthPage && <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />}

      <main className="pt-0 transition-all duration-300 ease-in-out">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<PastEvents />} />
          <Route path="/team" element={<Team />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/domains" element={<Domains />} />
            <Route path="/domains/:slug" element={<BlogPostPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="/leaderboard" element={<Navigate to="/" replace />} />
          {/* <Route path="/about" element={<About />} /> */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/verify-otp" element={<RegisterOtpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/forgot-password/verify-otp" element={<ForgotPasswordOtpPage />} />
          <Route path="/forgot-password/change-password" element={<ChangeForgottenPasswordPage />} />
          <Route element={<RoleRoute allowedRoles={["student"]} />}>
            <Route path="/student/dashboard/*" element={<StudentDashboard />} />
          </Route>
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </main>

      {!isAuthPage && !isDomainPage && <Footer />}
    </div>
  );
}

export default function App() { 
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ToastProvider>
            <ScrollToTop />
            <AppWrapper />
          </ToastProvider>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
