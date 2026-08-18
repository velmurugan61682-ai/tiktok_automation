import React from "react";
import { Link } from "react-router-dom";
import { Shield, Eye, Database, Share2, Mail, ArrowLeft } from "lucide-react";

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fafbfc] py-12 px-6 font-sans text-slate-800 antialiased relative overflow-hidden flex flex-col justify-between">
      {/* Decorative gradient blur background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-2xl w-full mx-auto bg-white rounded-3xl border border-slate-150 shadow-xl overflow-hidden relative z-10 p-8 md:p-12">
        {/* Back navigation */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-650 hover:text-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
              Privacy Policy
            </h1>
            <p className="text-slate-400 text-xs mt-1.5 font-medium uppercase tracking-wider">
              Taqbot Privacy Standards
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 space-y-8">
          {/* Intro Section */}
          <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-2">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-500" />
              Respect for Privacy
            </h2>
            <p className="text-slate-655 text-sm leading-relaxed font-medium">
              Taqbot respects user privacy. We are committed to protecting your personal data and ensuring transparency in how we collect and process information.
            </p>
          </div>

          {/* Tokens storage details */}
          <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-2">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-500" />
              Secure Token Management
            </h2>
            <p className="text-slate-655 text-sm leading-relaxed font-medium">
              We only store TikTok OAuth tokens after the user grants explicit permission. These tokens are used solely to run automations and sync integrations on your behalf.
            </p>
          </div>

          {/* Sell statement */}
          <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-2">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-500" />
              No Data Monetization
            </h2>
            <p className="text-slate-655 text-sm leading-relaxed font-medium">
              We never sell user information. Your account settings, profile data, and platform activities remain strictly private and dedicated to your workspace operations.
            </p>
          </div>

          {/* Contact Details */}
          <div className="p-5 bg-indigo-50/30 rounded-2xl border border-indigo-100/50 space-y-3">
            <h2 className="text-sm font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-600" />
              Get In Touch
            </h2>
            <p className="text-indigo-900/80 text-xs font-semibold leading-relaxed">
              If you have any questions, concerns, or requests regarding this Privacy Policy, feel free to contact us:
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Email:</span>
              <a
                href="mailto:techvaseegrah@gmail.com"
                className="text-xs font-bold text-indigo-650 hover:underline transition-all"
              >
                techvaseegrah@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-[10px] text-slate-400 font-bold uppercase tracking-wider relative z-10">
        &copy; {new Date().getFullYear()} Taqbot. All rights reserved.
      </div>
    </div>
  );
};

export default PrivacyPage;
