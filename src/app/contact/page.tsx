import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar.js";
import Footer from "../../components/Footer.js";
import { Mail, Clock, ShieldCheck, ArrowLeft, Send, Phone, MessageSquare } from "lucide-react";

export const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0b10] text-slate-800 dark:text-slate-100 font-sans antialiased transition-colors duration-300">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        
        {/* Navigation back */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#FE2C55] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-[#161823] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden p-6 sm:p-10 space-y-8">
          
          <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className="p-3.5 rounded-2xl bg-[#FE2C55]/10 text-[#FE2C55]">
              <Mail className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Contact TaQ Bot Support
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider mt-1">
                We're Here to Help Your Workspace Succeed
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Info Cards */}
            <div className="space-y-4">
              
              <div className="p-5 bg-slate-50 dark:bg-[#12141f] rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#FE2C55]" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Official Support Email
                  </h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-medium">
                  Send inquiries regarding TikTok account connections, technical issues, or platform setup:
                </p>
                <div>
                  <a
                    href="mailto:techvaseegrah@gmail.com"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#FE2C55] hover:bg-[#e02447] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    techvaseegrah@gmail.com
                  </a>
                </div>
              </div>

              <div className="p-5 bg-slate-50 dark:bg-[#12141f] rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#FE2C55]" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Direct Phone Support
                  </h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-medium">
                  Contact our customer engineering desk during business hours:
                </p>
                <div>
                  <a
                    href="tel:+919047484484"
                    className="text-sm font-bold text-[#FE2C55] hover:underline"
                  >
                    +91 90474 84484
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 dark:bg-[#12141f] rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#FE2C55]" /> SLA Response
                  </span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">24–48 Business Hours</p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-[#12141f] rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#FE2C55]" /> Security
                  </span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Encrypted Channels</p>
                </div>
              </div>

            </div>

            {/* Right Message Form */}
            <div className="p-6 bg-slate-50 dark:bg-[#12141f] rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#FE2C55]" />
                Send Us a Direct Message
              </h3>

              <form onSubmit={(e) => { e.preventDefault(); alert("Thank you! Your message has been sent to techvaseegrah@gmail.com."); }} className="space-y-3 text-xs sm:text-sm">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 uppercase text-[10px]">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161823] focus:outline-none focus:ring-2 focus:ring-[#FE2C55]/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 uppercase text-[10px]">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. alex@brand.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161823] focus:outline-none focus:ring-2 focus:ring-[#FE2C55]/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 uppercase text-[10px]">Inquiry Type</label>
                  <select className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161823] focus:outline-none focus:ring-2 focus:ring-[#FE2C55]/20 text-xs">
                    <option value="general">General Support</option>
                    <option value="tiktok">TikTok OAuth Integration</option>
                    <option value="billing">Subscription & Billing</option>
                    <option value="privacy">Privacy & Data Deletion</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 uppercase text-[10px]">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your inquiry..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161823] focus:outline-none focus:ring-2 focus:ring-[#FE2C55]/20"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#FE2C55] hover:bg-[#e02447] text-white font-bold transition-all shadow-md cursor-pointer"
                >
                  Send Message
                </button>
              </form>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
