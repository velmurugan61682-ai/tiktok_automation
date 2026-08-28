import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeContext.js";
import { useAuth } from "./AuthContext.js";
import { Sun, Moon, Menu, X, ArrowRight, Sparkles, LayoutDashboard } from "lucide-react";

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (anchorId: string) => {
    setMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate(`/${anchorId}`);
    } else {
      const el = document.querySelector(anchorId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-[#0b0b10]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img
              src="/logo.png"
              alt="TaQ Bot Logo"
              className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-white/10 shadow-sm transition-transform group-hover:scale-105"
            />
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#FE2C55] to-rose-500 opacity-0 group-hover:opacity-30 blur-sm transition-opacity"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              TaQ Bot
              <span className="bg-[#FE2C55]/10 dark:bg-[#FE2C55]/20 text-[#FE2C55] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#FE2C55]/20 uppercase tracking-wide">
                SaaS
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <button
            onClick={() => handleNavClick("#hero")}
            className="hover:text-[#FE2C55] dark:hover:text-[#FE2C55] transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick("#features")}
            className="hover:text-[#FE2C55] dark:hover:text-[#FE2C55] transition-colors cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick("#how-it-works")}
            className="hover:text-[#FE2C55] dark:hover:text-[#FE2C55] transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavClick("#about")}
            className="hover:text-[#FE2C55] dark:hover:text-[#FE2C55] transition-colors cursor-pointer"
          >
            About
          </button>
          <Link
            to="/contact"
            className="hover:text-[#FE2C55] dark:hover:text-[#FE2C55] transition-colors cursor-pointer"
          >
            Contact
          </Link>
        </nav>

        {/* Action Controls & Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {user ? (
            <Link
              to={user.role === "SUPER_ADMIN" ? "/superadmin" : "/dashboard"}
              className="bg-[#FE2C55] hover:bg-[#e02447] text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-700 dark:text-slate-200 hover:text-[#FE2C55] dark:hover:text-[#FE2C55] font-bold text-sm px-4 py-2 rounded-xl transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="bg-[#FE2C55] hover:bg-[#e02447] text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-[0_0_20px_rgba(254,44,85,0.35)] transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#161823] border-b border-slate-200 dark:border-slate-800 px-6 py-6 space-y-4 animate-fade-in shadow-xl">
          <div className="flex flex-col space-y-3 font-semibold text-slate-700 dark:text-slate-200 text-base">
            <button
              onClick={() => handleNavClick("#hero")}
              className="text-left py-2 hover:text-[#FE2C55] transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick("#features")}
              className="text-left py-2 hover:text-[#FE2C55] transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick("#how-it-works")}
              className="text-left py-2 hover:text-[#FE2C55] transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick("#about")}
              className="text-left py-2 hover:text-[#FE2C55] transition-colors"
            >
              About
            </button>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#FE2C55] transition-colors"
            >
              Contact Support
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
            {user ? (
              <Link
                to={user.role === "SUPER_ADMIN" ? "/superadmin" : "/dashboard"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#FE2C55] text-white font-bold text-center py-3 rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-center py-3 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-[#FE2C55] text-white font-bold text-center py-3 rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
