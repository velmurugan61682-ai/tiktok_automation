import React from "react";
import { Link } from "react-router-dom";
import { Shield, FileText, Mail, ArrowUpRight } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 dark:bg-[#07070a] text-slate-400 text-sm border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="TaQ Bot Logo"
                className="w-8 h-8 rounded-xl object-cover border border-white/10"
              />
              <span className="font-extrabold text-xl tracking-tight text-white">TaQ Bot</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
              AI-powered social automation platform. Streamline TikTok engagement, comment moderation, customer messaging, and store workflow automation.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-[#FE2C55] transition-colors">Home</Link>
              </li>
              <li>
                <a href="/#features" className="hover:text-[#FE2C55] transition-colors">Features</a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-[#FE2C55] transition-colors">How It Works</a>
              </li>
              <li>
                <a href="/#about" className="hover:text-[#FE2C55] transition-colors">About TaQ Bot</a>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#FE2C55] transition-colors">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Legal & Compliance</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/privacy-policy" className="hover:text-[#FE2C55] transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#FE2C55]" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-[#FE2C55] transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#FE2C55]" />
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#FE2C55] transition-colors">
                  Sign In / Access Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Official Contact</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Have questions regarding our TikTok authorization, features, or support?
            </p>
            <a
              href="mailto:techvaseegrah@gmail.com"
              className="inline-flex items-center gap-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl border border-slate-700 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#FE2C55]" />
              techvaseegrah@gmail.com
            </a>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>Copyright © 2026 TaQ Bot. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms-of-service" className="hover:underline">Terms of Service</Link>
            <span>•</span>
            <Link to="/contact" className="hover:underline">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
