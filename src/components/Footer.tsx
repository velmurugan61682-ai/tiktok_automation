import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, ShieldCheck, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-900 dark:bg-[#0b0b10] text-slate-300 border-t border-slate-800 pt-12 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="TaQ Bot Logo" 
                className="w-8 h-8 rounded-lg object-cover border border-slate-700 shadow-sm"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="font-extrabold text-xl tracking-tight text-white">
                TaQ Bot
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              AI-powered social automation & engagement platform for creators, online brands, and social growth teams.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-[#FE2C55]" />
              <span>Official TikTok OAuth Integrated</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
              Platform Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-medium">
              <li>
                <a href="/#" className="hover:text-[#FE2C55] transition-colors">Home</a>
              </li>
              <li>
                <a href="/#features" className="hover:text-[#FE2C55] transition-colors">Features</a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-[#FE2C55] transition-colors">How It Works</a>
              </li>
              <li>
                <a href="/#integration" className="hover:text-[#FE2C55] transition-colors">TikTok Integration</a>
              </li>
              <li>
                <a href="/#about" className="hover:text-[#FE2C55] transition-colors">About TaQ Bot</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Auth */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
              Legal & Access
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-medium">
              <li>
                <Link to="/privacy-policy" className="hover:text-[#FE2C55] transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-[#FE2C55] transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#FE2C55] transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#FE2C55] transition-colors">Sign In</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#FE2C55] transition-colors">Create Account</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
              Direct Support
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FE2C55] shrink-0" />
                <a href="mailto:techvaseegrah@gmail.com" className="hover:text-[#FE2C55] transition-colors truncate">
                  techvaseegrah@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FE2C55] shrink-0" />
                <a href="tel:+919047484484" className="hover:text-[#FE2C55] transition-colors">
                  +91 90474 84484
                </a>
              </div>
              <p className="text-[11px] text-slate-500 pt-2 leading-relaxed">
                Reach out to our customer engineering team for API integration queries or workspace assistance.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 TaQ Bot. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <Link to="/privacy-policy" className="hover:text-[#FE2C55]">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms-of-service" className="hover:text-[#FE2C55]">Terms of Service</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-[#FE2C55]">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
