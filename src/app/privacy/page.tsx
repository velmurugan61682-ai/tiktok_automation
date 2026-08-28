import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/Navbar.js";
import { Footer } from "../../components/Footer.js";
import { Shield, Eye, Database, Share2, Mail, ArrowLeft, Lock, Trash2, CheckCircle2, UserCheck } from "lucide-react";

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0b10] text-slate-800 dark:text-slate-100 font-sans antialiased selection:bg-[#FE2C55]/20 selection:text-[#FE2C55]">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-[#161823] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden p-8 md:p-14 space-y-10">
          
          {/* Header */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#FE2C55]/10 text-[#FE2C55] p-3 rounded-2xl">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Privacy Policy
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-1">
                  TaQ Bot Platform Privacy Standards • Last Updated: August 2026
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              At TaQ Bot, we take your privacy and data security seriously. This Privacy Policy outlines how we collect, store, process, and protect your information when you use the TaQ Bot SaaS platform and connect your TikTok account.
            </p>
          </div>

          <div className="space-y-8 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            
            {/* Section 1: Information Collected */}
            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#FE2C55]" />
                1. Information We Collect
              </h2>
              <p>We collect only the essential data required to provide our automation and inbox management services:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li><strong className="text-slate-800 dark:text-slate-200">Account Information:</strong> Name, business email address, shop name, contact phone number, and account credentials when you register.</li>
                <li><strong className="text-slate-800 dark:text-slate-200">TikTok Authorization Information:</strong> When you connect your TikTok account through the official TikTok OAuth flow, we receive authorized OAuth access tokens, profile usernames, display names, avatar URLs, and public video identifiers.</li>
                <li><strong className="text-slate-800 dark:text-slate-200">Usage Data:</strong> Workspace configuration settings, comment automation rule criteria, and social inbox interaction records.</li>
              </ul>
            </section>

            {/* Section 2: TikTok Authorization & Tokens */}
            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Database className="w-5 h-5 text-[#FE2C55]" />
                2. TikTok Authorization Information
              </h2>
              <p>
                TaQ Bot connects to TikTok exclusively using official TikTok Developer API endpoints and OAuth 2.0 PKCE protocols.
              </p>
              <div className="p-4 bg-slate-50 dark:bg-[#101116] rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
                <p className="font-semibold text-slate-800 dark:text-slate-200">Our TikTok Data Principles:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>We <strong>never</strong> ask for, receive, or store your personal TikTok account password.</li>
                  <li>We store OAuth tokens securely using industry-standard cryptographic encryption.</li>
                  <li>Tokens are used strictly to perform automations and sync comments requested by you in your dashboard.</li>
                </ul>
              </div>
            </section>

            {/* Section 3: How Data Is Used */}
            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#FE2C55]" />
                3. How We Use Your Data
              </h2>
              <p>Your data is used solely for operating and enhancing the TaQ Bot platform:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li>To authenticate your user identity and grant access to your workspace.</li>
                <li>To execute your configured comment automation rules and AI moderation logic.</li>
                <li>To display live comments, analytics, and social inbox conversations inside your dashboard.</li>
                <li>To send critical account notifications and support communications.</li>
              </ul>
            </section>

            {/* Section 4: Data Sharing & Monetization */}
            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#FE2C55]" />
                4. Data Sharing & Non-Monetization
              </h2>
              <div className="p-4 bg-[#FE2C55]/10 rounded-2xl border border-[#FE2C55]/20 text-xs font-semibold text-[#FE2C55]">
                We NEVER sell, rent, or monetize your personal information or TikTok data under any circumstances.
              </div>
              <p className="text-xs">
                Data is shared strictly with infrastructure service providers (such as cloud database hosting) bound by strict confidentiality agreements required to run the SaaS platform.
              </p>
            </section>

            {/* Section 5: Data Storage & Security */}
            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#FE2C55]" />
                5. Data Storage & Security
              </h2>
              <p className="text-xs">
                We implement technical and organizational security measures, including SSL/TLS transport encryption, encrypted token storage, HMAC signature checks, and access controls to safeguard your data against unauthorized access or disclosure.
              </p>
            </section>

            {/* Section 6: User Rights & Data Deletion */}
            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-[#FE2C55]" />
                6. User Rights & Data Deletion
              </h2>
              <p className="text-xs">
                You retain full control over your data. You may disconnect your TikTok account at any time via your TaQ Bot workspace settings or by revoking app authorization directly inside your TikTok Security settings. To request full deletion of your account and stored data, email support at <a href="mailto:techvaseegrah@gmail.com" className="text-[#FE2C55] font-bold underline">techvaseegrah@gmail.com</a>.
              </p>
            </section>

            {/* Section 7: Contact Information */}
            <section className="p-6 bg-slate-50 dark:bg-[#101116] rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FE2C55]" />
                7. Contact Information
              </h2>
              <p className="text-xs">
                If you have any questions or concerns regarding this Privacy Policy, feel free to reach out to our privacy officer:
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

export default PrivacyPage;
