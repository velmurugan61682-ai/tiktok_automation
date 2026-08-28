import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar.js";
import Footer from "../../components/Footer.js";
import { Shield, Eye, Database, Share2, Mail, Lock, UserCheck, Trash2, Phone, ArrowLeft } from "lucide-react";

export const PrivacyPage: React.FC = () => {
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
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Privacy Policy
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider mt-1">
                Last Updated: January 2026 • TaQ Bot Platform Data Standards
              </p>
            </div>
          </div>

          {/* Section 1: Overview */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#FE2C55]" />
              1. Overview & Commitment
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
              TaQ Bot ("we", "our", or "us") respects your privacy. This Privacy Policy explains how we collect, use, store, protect, and manage your information when you use our SaaS web application platform at <strong>https://taqbot.com/</strong> and related services. By accessing or using TaQ Bot, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          {/* Section 2: Information We Collect */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-[#FE2C55]" />
              2. Information We Collect
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>We collect only necessary information to operate your TaQ Bot workspace:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li>
                  <strong>Account & Workspace Information:</strong> Name, email address, password hash, shop/brand name, phone number, and subscription billing details.
                </li>
                <li>
                  <strong>TikTok Authorization Data:</strong> When you connect your TikTok account via TikTok's official OAuth flow, we securely store authorization tokens, granted scopes, and basic profile info (such as <code className="text-[11px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">open_id</code>, <code className="text-[11px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">display_name</code>, <code className="text-[11px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">avatar_url</code>, and follower/video counts).
                </li>
                <li>
                  <strong>Automation & Comment Rules:</strong> Custom knowledge base items, keyword triggers, and engagement logs created within your workspace.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: TikTok OAuth Integration & Security */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#FE2C55]" />
              3. TikTok Authorization & OAuth Security
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
              Account connection occurs exclusively through TikTok's official OAuth 2.0 authorization endpoints. 
              <strong> We never request, collect, or store your personal TikTok login credentials or passwords.</strong> 
              OAuth state tokens are cryptographically signed using HMAC validation to protect against CSRF attacks.
            </p>
          </section>

          {/* Section 4: How Data Is Used */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#FE2C55]" />
              4. How We Use Your Data
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>Your data is strictly used for platform operations:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li>Executing configured comment automation rules and AI moderation workflows.</li>
                <li>Displaying active conversations inside your workspace Social Inbox.</li>
                <li>Providing analytics metrics regarding engagement volume and response rates.</li>
                <li>Communicating critical workspace updates and billing notifications.</li>
              </ul>
            </div>
          </section>

          {/* Section 5: Data Sharing & Non-Monetization */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#FE2C55]" />
              5. Data Sharing & Non-Monetization
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
              <strong>We never sell, rent, or monetize user data or TikTok authorization credentials to third parties.</strong> Data is shared only with trusted infrastructure providers (e.g. secure database hosting and Google Gemini AI processing for comment moderation) solely to deliver platform functionality.
            </p>
          </section>

          {/* Section 6: Data Storage & Retention */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-[#FE2C55]" />
              6. Data Security & Storage
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
              We employ industry-standard administrative, technical, and physical safeguards—including SSL/TLS encryption in transit and standard hashing protocols at rest—to prevent unauthorized access or disclosure of your account data.
            </p>
          </section>

          {/* Section 7: User Rights & Data Deletion */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-[#FE2C55]" />
              7. User Rights & Data Deletion
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
              You retain total control over your TikTok authorization. You can revoke TikTok account access at any time from your TikTok account security settings or by clicking "Disconnect" inside TaQ Bot. To request permanent deletion of your workspace data, contact our support team at <strong>techvaseegrah@gmail.com</strong>.
            </p>
          </section>

          {/* Section 8: Contact Information */}
          <section className="p-6 rounded-2xl bg-slate-50 dark:bg-[#12141f] border border-slate-200 dark:border-slate-800 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#FE2C55]" />
              8. Contact Us Regarding Privacy
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              If you have any questions, concerns, or data deletion requests regarding this Privacy Policy, reach out to us directly:
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

export default PrivacyPage;
