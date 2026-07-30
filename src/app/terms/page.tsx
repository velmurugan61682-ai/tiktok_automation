import React from "react";
import { Link } from "react-router-dom";
import { Scale, Cpu, ShieldAlert, FileSignature, ArrowLeft } from "lucide-react";

export const TermsPage: React.FC = () => {
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
            <Scale className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
              Terms of Service
            </h1>
            <p className="text-slate-400 text-xs mt-1.5 font-medium uppercase tracking-wider">
              TikTokAuto Platform Terms
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 space-y-8">
          {/* Service provision */}
          <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-2">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-500" />
              Creator Automation Tools
            </h2>
            <p className="text-slate-655 text-sm leading-relaxed font-medium">
              TikTokAuto provides advanced automation tools for creators. These tools are designed to streamline content management, comment moderation, and inbox interactions.
            </p>
          </div>

          {/* Third party compliance */}
          <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-2">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-500" />
              Platform Compliance
            </h2>
            <p className="text-slate-655 text-sm leading-relaxed font-medium">
              Users must strictly comply with the TikTok Terms of Service. Any violation of third-party policies is the sole responsibility of the user.
            </p>
          </div>

          {/* Content responsibility */}
          <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-2">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <FileSignature className="w-4 h-4 text-indigo-500" />
              User Content Responsibility
            </h2>
            <p className="text-slate-655 text-sm leading-relaxed font-medium">
              Users are completely responsible for their own content, campaigns, and direct messages sent or automated via the TikTokAuto platform.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-[10px] text-slate-400 font-bold uppercase tracking-wider relative z-10">
        &copy; {new Date().getFullYear()} TikTokAuto. All rights reserved.
      </div>
    </div>
  );
};

export default TermsPage;
