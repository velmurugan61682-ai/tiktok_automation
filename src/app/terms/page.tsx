import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/Navbar.js";
import { Footer } from "../../components/Footer.js";
import { Scale, Cpu, ShieldAlert, FileSignature, ArrowLeft, Mail, CheckCircle2, ShieldCheck } from "lucide-react";

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0b10] text-slate-800 dark:text-slate-100 font-sans antialiased selection:bg-[#FE2C55]/20 selection:text-[#FE2C55]">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-[#161823] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden p-8 md:p-14 space-y-10">
          
          {/* Header */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#FE2C55]/10 text-[#FE2C55] p-3 rounded-2xl">
                <Scale className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Terms of Service
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-1">
                  TaQ Bot Platform Agreement • Last Updated: August 2026
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Please read these Terms of Service ("Terms") carefully before accessing or using the TaQ Bot SaaS platform ("Service"). By creating an account or connecting your TikTok profile, you agree to be bound by these Terms.
            </p>
          </div>

          <div className="space-y-8 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            
            {/* Section 1: Service Provision */}
            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#FE2C55]" />
                1. Service Provision & Scope
              </h2>
              <p className="text-xs">
                TaQ Bot provides AI-powered social automation tools designed to assist TikTok creators, brands, and businesses with comment moderation, response automation, and social inbox workflows. Features operate strictly within supported third-party developer APIs.
              </p>
            </section>

            {/* Section 2: User Accounts */}
            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-[#FE2C55]" />
                2. User Accounts & Registration
              </h2>
              <p className="text-xs">
                Users must register a valid account with accurate credentials. You are responsible for safeguarding your login credentials and for all activities that occur under your workspace account.
              </p>
            </section>

            {/* Section 3: Acceptable Use & Conduct */}
            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#FE2C55]" />
                3. Acceptable Use Policy
              </h2>
              <p className="text-xs">You agree NOT to use TaQ Bot to:</p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>Send unsolicited spam, harassing DMs, or deceptive automated messages.</li>
                <li>Violate TikTok Developer Terms, Partner Policies, or Community Guidelines.</li>
                <li>Attempt to bypass rate limits, perform unauthorized security probing, or reverse engineer platform components.</li>
              </ul>
            </section>

            {/* Section 4: TikTok Integration */}
            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#FE2C55]" />
                4. Third-Party & TikTok Integrations
              </h2>
              <p className="text-xs">
                TaQ Bot integrates with third-party platforms including TikTok. You acknowledge that your use of third-party integrations is governed by the respective platform's Terms of Service. TaQ Bot is an independent software tool and is not directly owned by TikTok Inc.
              </p>
            </section>

            {/* Section 5: Intellectual Property */}
            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                5. Intellectual Property
              </h2>
              <p className="text-xs">
                All platform code, interface designs, logos, trademarks, and documentation associated with TaQ Bot are the exclusive intellectual property of the company. Users retain full ownership of their content and brand assets.
              </p>
            </section>

            {/* Section 6: Service Availability & Disclaimer */}
            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                6. Service Availability & Warranties
              </h2>
              <p className="text-xs">
                The platform is provided on an "AS IS" and "AS AVAILABLE" basis. While we strive for 99.9% uptime, we do not guarantee uninterrupted operational availability due to third-party API dependencies or scheduled maintenance.
              </p>
            </section>

            {/* Section 7: Termination */}
            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                7. Termination
              </h2>
              <p className="text-xs">
                We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activities. You may terminate your account at any time by contacting customer support.
              </p>
            </section>

            {/* Section 8: Contact Information */}
            <section className="p-6 bg-slate-50 dark:bg-[#101116] rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FE2C55]" />
                8. Contact Information
              </h2>
              <p className="text-xs">
                For legal inquiries or questions regarding these Terms of Service, please contact us at:
              </p>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Email: <a href="mailto:techvaseegrah@gmail.com" className="text-[#FE2C55] hover:underline">techvaseegrah@gmail.com</a>
              </div>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;
