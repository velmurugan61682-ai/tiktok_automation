import React, { useState } from "react";
import { Navbar } from "../../components/Navbar.js";
import { Footer } from "../../components/Footer.js";
import { Mail, Clock, ShieldCheck, Send, CheckCircle2 } from "lucide-react";

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0b10] text-slate-800 dark:text-slate-100 font-sans antialiased selection:bg-[#FE2C55]/20 selection:text-[#FE2C55]">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-[#161823] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden p-8 md:p-14 space-y-10">
          
          {/* Header */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-8 space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-[#FE2C55]/10 text-[#FE2C55] p-3 rounded-2xl">
                <Mail className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Contact Support
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-1">
                  TaQ Bot Official Support & Assistance
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              We are here to help you get the most out of TaQ Bot. Whether you have questions regarding your workspace, TikTok API authorizations, feature inquiries, or billing assistance, drop us a message.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Info Col */}
            <div className="space-y-6">
              <div className="p-6 bg-slate-50 dark:bg-[#101116] rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#FE2C55] shrink-0 mt-1" />
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Official Email Address
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Reach our support team directly via email:
                    </p>
                    <a
                      href="mailto:techvaseegrah@gmail.com"
                      className="inline-block pt-1 text-sm font-extrabold text-[#FE2C55] hover:underline"
                    >
                      techvaseegrah@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="p-5 bg-slate-50 dark:bg-[#101116] rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#FE2C55]" />
                    Response Time SLA
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    We process and respond to all support requests within 24 to 48 business hours.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 dark:bg-[#101116] rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#FE2C55]" />
                    Secure Support Desk
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Your inquiries and communications are handled using TLS encrypted email servers.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Col */}
            <div>
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center p-8 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Message Delivered</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Thank you for contacting TaQ Bot support. Our team will review your inquiry and reply via email.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Priyanjali Sen"
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FE2C55]/20 focus:border-[#FE2C55]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="sen@brand.com"
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FE2C55]/20 focus:border-[#FE2C55]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Message</label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Describe your inquiry or support question..."
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FE2C55]/20 focus:border-[#FE2C55]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#FE2C55] hover:bg-[#e02447] text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    Submit Request
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
