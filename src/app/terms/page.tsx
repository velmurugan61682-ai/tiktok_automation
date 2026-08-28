import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar.js";
import Footer from "../../components/Footer.js";
import { Scale, Cpu, ShieldAlert, FileSignature, AlertTriangle, ArrowLeft, Mail, Phone } from "lucide-react";

export const TermsPage: React.FC = () => {
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

        {/* Card wrapper */}
        <div className="bg-white dark:bg-[#161823] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden p-6 sm:p-10 space-y-8">
          
          {/* Header */}
          <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className="p-3.5 rounded-2xl bg-[#FE2C55]/10 text-[#FE2C55]">
              <Scale className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Terms of Service
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider mt-1">
                Last Updated: January 2026 • TaQ Bot Platform Terms
              </p>
            </div>
          </div>

          {/* Section 1: Acceptance */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileSignature className="w-4 h-4 text-[#FE2C55]" />
              1. Acceptance of Terms
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
              Welcome to TaQ Bot ("we", "our", or "us"). By registering for, accessing, or using our website at <strong>https://taqbot.com/</strong> and associated automation services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our service.
            </p>
          </section>

          {/* Section 2: Service Provision */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#FE2C55]" />
              2. Description of Service
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
              TaQ Bot provides a cloud-based social engagement CRM platform designed for TikTok creators and businesses. Key capabilities include comment automation rules, AI-driven comment moderation powered by Google Gemini, unified social inbox routing, live agent handover, and analytics reporting.
            </p>
          </section>

          {/* Section 3: User Accounts */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileSignature className="w-4 h-4 text-[#FE2C55]" />
              3. User Accounts & Responsibilities
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li>You must provide accurate, complete registration information and maintain password confidentiality.</li>
                <li>You are solely responsible for all activities and automated responses occurring under your workspace.</li>
                <li>You agree not to configure automation rules that generate misleading, deceptive, offensive, or spam messages.</li>
              </ul>
            </div>
          </section>

          {/* Section 4: Third-Party Integrations & TikTok Compliance */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#FE2C55]" />
              4. TikTok Integration & Third-Party Policy Compliance
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
              TaQ Bot integrates with TikTok via official developer APIs and OAuth authorization. Users must strictly comply with all third-party policies, including the <strong>TikTok Terms of Service</strong> and <strong>TikTok Community Guidelines</strong>. Any breach of third-party platform terms resulting from user-configured automations is the sole responsibility of the user.
            </p>
          </section>

          {/* Section 5: Acceptable Use */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#FE2C55]" />
              5. Acceptable Use Policy
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
              You agree not to misuse the TaQ Bot platform. Prohibited actions include attempting to bypass rate limits, reverse-engineering platform APIs, distributing malicious code, using the service to send unauthorized spam, or violating privacy rights.
            </p>
          </section>

          {/* Section 6: Intellectual Property */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#FE2C55]" />
              6. Intellectual Property
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
              The TaQ Bot brand, website, logo, visual designs, software code, and service architecture are protected by copyright and intellectual property laws. You retain ownership over your custom content, workspace data, and brand materials.
            </p>
          </section>

          {/* Section 7: Service Availability & Disclaimers */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#FE2C55]" />
              7. Service Availability & Limitation of Liability
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
              We strive to maintain high service availability; however, TaQ Bot is provided on an "as is" and "as available" basis without warranties of any kind. We are not liable for indirect or consequential damages resulting from third-party API changes, network outages, or account suspensions.
            </p>
          </section>

          {/* Section 8: Termination */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#FE2C55]" />
              8. Account Termination
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
              We reserve the right to suspend or terminate access to TaQ Bot for any user who violates these Terms of Service, abuses platform resources, or engages in fraudulent activity.
            </p>
          </section>

          {/* Section 9: Contact */}
          <section className="p-6 rounded-2xl bg-slate-50 dark:bg-[#12141f] border border-slate-200 dark:border-slate-800 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#FE2C55]" />
              9. Contact Information
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              For questions regarding these Terms of Service or service agreements, contact us:
            </p>
            <div className="space-y-1.5 text-xs font-bold pt-1">
              <p className="text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#FE2C55]" />
                Support Email: <a href="mailto:techvaseegrah@gmail.com" className="text-[#FE2C55] hover:underline">techvaseegrah@gmail.com</a>
              </p>
              <p className="text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FE2C55]" />
                Phone: <a href="tel:+919047484484" className="text-[#FE2C55] hover:underline">+91 90474 84484</a>
              </p>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;
