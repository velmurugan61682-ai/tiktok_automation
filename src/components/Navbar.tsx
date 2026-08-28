import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.js";
import { useTheme } from "./ThemeContext.js";
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ArrowRight, 
  LayoutDashboard
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-[#161823]/80 border-b border-slate-200/60 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="TaQ Bot Logo" 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm group-hover:scale-105 transition-transform" 
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="hidden group-has-[img[style*='display: none']]:flex w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FE2C55] text-white font-extrabold text-lg items-center justify-center shadow-md">
                T
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                TaQ Bot
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FE2C55]/10 text-[#FE2C55] border border-[#FE2C55]/20">
                  AI SaaS
                </span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                TikTok Automation Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <a 
              href="/#features" 
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#FE2C55] dark:hover:text-[#FE2C55] transition-colors rounded-lg hover:bg-slate-100/60 dark:hover:bg-slate-800/50"
            >
              Features
            </a>
            <a 
              href="/#how-it-works" 
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#FE2C55] dark:hover:text-[#FE2C55] transition-colors rounded-lg hover:bg-slate-100/60 dark:hover:bg-slate-800/50"
            >
              How It Works
            </a>
            <a 
              href="/#integration" 
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#FE2C55] dark:hover:text-[#FE2C55] transition-colors rounded-lg hover:bg-slate-100/60 dark:hover:bg-slate-800/50"
            >
              TikTok Integration
            </a>
            <a 
              href="/#about" 
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#FE2C55] dark:hover:text-[#FE2C55] transition-colors rounded-lg hover:bg-slate-100/60 dark:hover:bg-slate-800/50"
            >
              About
            </a>
            <Link 
              to="/contact" 
              className={`px-3.5 py-2 text-xs sm:text-sm font-semibold transition-colors rounded-lg hover:bg-slate-100/60 dark:hover:bg-slate-800/50 ${
                location.pathname === "/contact" 
                  ? "text-[#FE2C55] dark:text-[#FE2C55] font-bold" 
                  : "text-slate-700 dark:text-slate-200 hover:text-[#FE2C55]"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {user ? (
              <Link
                to={user.role === "SUPER_ADMIN" ? "/superadmin" : "/dashboard"}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FE2C55] hover:bg-[#e02447] text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-[#FE2C55] transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FE2C55] hover:bg-[#e02447] text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161823] px-4 pt-2 pb-6 space-y-3 animate-fade-in">
          <div className="flex flex-col space-y-2 pt-2">
            <a
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#FE2C55] rounded-lg"
            >
              Features
            </a>
            <a
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#FE2C55] rounded-lg"
            >
              How It Works
            </a>
            <a
              href="/#integration"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#FE2C55] rounded-lg"
            >
              TikTok Integration
            </a>
            <a
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#FE2C55] rounded-lg"
            >
              About TaQ Bot
            </a>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#FE2C55] rounded-lg"
            >
              Contact Us
            </Link>
            <Link
              to="/privacy-policy"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#FE2C55] rounded-lg"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#FE2C55] rounded-lg"
            >
              Terms of Service
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            {user ? (
              <Link
                to={user.role === "SUPER_ADMIN" ? "/superadmin" : "/dashboard"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-[#FE2C55] text-white font-bold text-sm shadow-md"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-sm text-slate-800 dark:text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-[#FE2C55] text-white font-bold text-sm shadow-md"
                >
                  Get Started Free
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
