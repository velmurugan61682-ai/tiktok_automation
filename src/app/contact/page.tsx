import React from "react";
import { Link } from "react-router-dom";
import { Mail, Clock, ShieldCheck, ArrowLeft, Send } from "lucide-react";

export const ContactPage: React.FC = () => {
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
            <Mail className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
              Contact Us
            </h1>
            <p className="text-slate-400 text-xs mt-1.5 font-medium uppercase tracking-wider">
              TikTokAuto Support and Inquiries
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 space-y-8">
          {/* Main Contact Card */}
          <div className="p-6 bg-indigo-50/30 rounded-2xl border border-indigo-100/50 space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-indigo-950 uppercase tracking-wider">
                  Support Email
                </h3>
                <p className="text-indigo-900/80 text-xs font-semibold leading-relaxed">
                  For inquiries, API partnerships, feature requests, or technical assistance, send us an email:
                </p>
                <div className="pt-2">
                  <a
                    href="mailto:techvaseegrah@gmail.com"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    techvaseegrah@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* SLA Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-2">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                Response Time
              </h2>
              <p className="text-slate-655 text-xs font-semibold leading-relaxed">
                We generally respond to all support tickets and inquiries within 24 to 48 business hours.
              </p>
            </div>

            <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-2">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                Secure Channels
              </h2>
              <p className="text-slate-655 text-xs font-semibold leading-relaxed">
                Your support emails and communications with us are handled via secure, encrypted email servers.
              </p>
            </div>
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

export default ContactPage;
