import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/Navbar.js";
import { Footer } from "../../components/Footer.js";
import {
  MessageSquare,
  Bot,
  Sparkles,
  Zap,
  ShieldCheck,
  BarChart3,
  Users,
  CheckCircle2,
  ArrowRight,
  Send,
  Lock,
  RefreshCw,
  Sliders,
  Inbox,
  Headphones,
  Check,
  Clock,
  Mail,
  Flame,
  Award
} from "lucide-react";

export const HomePage: React.FC = () => {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactName("");
      setContactEmail("");
      setContactMessage("");
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0b10] text-slate-800 dark:text-slate-100 font-sans antialiased selection:bg-[#FE2C55]/20 selection:text-[#FE2C55]">
      {/* Sticky Header Navigation */}
      <Navbar />

      {/* 1. HERO SECTION */}
      <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background Decorative Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FE2C55]/10 rounded-full filter blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-[#FE2C55]/10 rounded-full filter blur-[90px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm text-xs font-bold text-slate-700 dark:text-slate-200">
              <span className="flex h-2 w-2 rounded-full bg-[#FE2C55] animate-ping"></span>
              <span className="text-[#FE2C55] font-extrabold">TaQ Bot Platform</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span>TikTok Official Integration</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              AI-Powered TikTok Automation & <span className="bg-gradient-to-r from-[#FE2C55] via-rose-500 to-amber-500 bg-clip-text text-transparent">Engagement Platform</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              TaQ Bot helps creators, e-commerce brands, and businesses manage TikTok engagement, moderate comments with AI keyword rules, automate supported reply workflows, and unify social inbox conversations.
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="w-full sm:w-auto bg-[#FE2C55] hover:bg-[#e02447] text-white font-bold text-base px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-[0_0_25px_rgba(254,44,85,0.4)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-base px-8 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all text-center cursor-pointer"
              >
                Sign In
              </Link>
            </div>

            {/* Sub-trust text */}
            <div className="pt-4 flex items-center justify-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#FE2C55]" /> Official TikTok Authorization
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#FE2C55]" /> No Password Sharing Required
              </span>
            </div>
          </div>

          {/* SaaS Interface Mockup Graphic */}
          <div className="mt-14 relative max-w-5xl mx-auto rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xl bg-white dark:bg-[#161823]">
            <div className="bg-slate-100 dark:bg-slate-900 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-semibold text-slate-400 ml-2">TaQ Bot Command Center</span>
              </div>
              <div className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[#FE2C55]/10 text-[#FE2C55]">
                TikTok API Connected
              </div>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mock Card 1 */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#101116] border border-slate-200/60 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Live Comment Moderation</span>
                  <Sparkles className="w-4 h-4 text-[#FE2C55]" />
                </div>
                <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-xs space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200">@tiktok_fan: "Where can I buy this?"</div>
                  <div className="text-[#FE2C55] font-semibold flex items-center gap-1 text-[11px]">
                    <Bot className="w-3.5 h-3.5" /> Auto-Replied with Product Link
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">Rule Match: "buy", "price", "where"</div>
              </div>

              {/* Mock Card 2 */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#101116] border border-slate-200/60 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Social Inbox Handover</span>
                  <Inbox className="w-4 h-4 text-[#FE2C55]" />
                </div>
                <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-xs space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200">Inquiry #4092: Order Status</div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">Handed over to Support Agent</div>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">Real-time status: Active Chat</div>
              </div>

              {/* Mock Card 3 */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#101116] border border-slate-200/60 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Engagement Analytics</span>
                  <BarChart3 className="w-4 h-4 text-[#FE2C55]" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Automated Responses</span>
                    <span className="text-[#FE2C55]">1,482</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#FE2C55] h-full w-[78%] rounded-full"></div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">24/7 Active Automation Engine</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section id="features" className="py-24 bg-white dark:bg-[#0f1017] border-y border-slate-200/60 dark:border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-extrabold text-[#FE2C55] uppercase tracking-widest">Platform Capabilities</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Built for Modern TikTok Creators & Brands
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
              Powerful tools designed strictly within supported platform capabilities to help you scale engagement safely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#161823] border border-slate-200/70 dark:border-slate-800 hover:border-[#FE2C55]/50 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#FE2C55]/10 text-[#FE2C55] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">TikTok Comment Automation</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Automatically detect incoming comments on your TikTok posts and trigger keyword-based response sequences.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#161823] border border-slate-200/70 dark:border-slate-800 hover:border-[#FE2C55]/50 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#FE2C55]/10 text-[#FE2C55] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">AI Comment Moderation</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Filter spam, flag toxic language, and prioritize high-intent product inquiries using intelligent rule scoring.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#161823] border border-slate-200/70 dark:border-slate-800 hover:border-[#FE2C55]/50 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#FE2C55]/10 text-[#FE2C55] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Automated Replies</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Configure instant templates for FAQs, pricing details, discount codes, and store location questions.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#161823] border border-slate-200/70 dark:border-slate-800 hover:border-[#FE2C55]/50 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#FE2C55]/10 text-[#FE2C55] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Inbox className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Social Inbox</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Consolidate conversations into a unified dual-pane dashboard for easy tracking and organization.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#161823] border border-slate-200/70 dark:border-slate-800 hover:border-[#FE2C55]/50 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#FE2C55]/10 text-[#FE2C55] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Headphones className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Live Chat Handover</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Seamlessly transfer complex conversations from automated bots to live support agents at any time.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#161823] border border-slate-200/70 dark:border-slate-800 hover:border-[#FE2C55]/50 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#FE2C55]/10 text-[#FE2C55] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Story Automation</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Manage engagement rules and track response rates for interactive story content and announcements.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#161823] border border-slate-200/70 dark:border-slate-800 hover:border-[#FE2C55]/50 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#FE2C55]/10 text-[#FE2C55] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Sliders className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Engagement Management</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Tag leads, organize customer profiles, and assign support tickets across team members.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#161823] border border-slate-200/70 dark:border-slate-800 hover:border-[#FE2C55]/50 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#FE2C55]/10 text-[#FE2C55] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Analytics & Reporting</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Track comment volume, response resolution times, popular keywords, and engagement growth metrics.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-extrabold text-[#FE2C55] uppercase tracking-widest">Simple Setup</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Get Started in 4 Easy Steps
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
              Connecting your TikTok workspace takes less than two minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-white dark:bg-[#161823] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-full bg-[#FE2C55] text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                  1
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Create your TaQ Bot account</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Sign up for a free workspace account with your business email. No credit card required.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-white dark:bg-[#161823] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-full bg-[#FE2C55] text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                  2
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Connect your TikTok account</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Authorize TaQ Bot securely through official TikTok Login OAuth screen.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-white dark:bg-[#161823] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-full bg-[#FE2C55] text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                  3
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Configure automation settings</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Set up keyword rules, auto-responses, and moderation filters suited to your audience.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative p-6 rounded-2xl bg-white dark:bg-[#161823] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-full bg-[#FE2C55] text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                  4
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Manage engagement dashboard</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Monitor live comment activity, respond via social inbox, and analyze growth.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. TIKTOK INTEGRATION SECTION */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FE2C55]/20 text-[#FE2C55] text-xs font-bold border border-[#FE2C55]/30">
                <ShieldCheck className="w-4 h-4" /> Official Authorization
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Secure TikTok Integration
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed">
                TaQ Bot connects strictly through TikTok's official Developer API and OAuth 2.0 authorization framework. Users connect their TikTok account by logging into TikTok directly on official TikTok domain servers.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-[#FE2C55]/20 text-[#FE2C55] mt-1">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Transparent Scope Permissions</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      We only request explicit permissions authorized by TikTok (such as profile details and video listings) necessary to deliver your requested service.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-[#FE2C55]/20 text-[#FE2C55] mt-1">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Full User Control</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      You retain complete control of your TikTok account. You can revoke authorization at any time directly through TikTok security settings or your TaQ Bot dashboard.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-[#FE2C55]/20 text-[#FE2C55] mt-1">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Zero Account Password Sharing</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      TaQ Bot never asks for, sees, or stores your TikTok password. Authentication is completed securely via official tokens.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Integration Card Mockup */}
            <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FE2C55] text-white flex items-center justify-center font-bold">
                    TT
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">TikTok Developer API</h4>
                    <span className="text-[11px] text-slate-400">OAuth 2.0 PKCE Authorization</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Verified Protocol
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-900/60 rounded-xl flex items-center justify-between text-slate-300">
                  <span>Granted Scopes:</span>
                  <span className="font-mono text-[11px] text-[#FE2C55]">user.info.basic, video.list</span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl flex items-center justify-between text-slate-300">
                  <span>Token Protection:</span>
                  <span className="font-semibold text-slate-200">HMAC-SHA256 Encrypted</span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl flex items-center justify-between text-slate-300">
                  <span>One-Click Disconnect:</span>
                  <span className="font-semibold text-emerald-400">Supported</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 text-center">
                Strict adherence to TikTok Developer Terms & Partner Policy Guidelines.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. ABOUT SECTION */}
      <section id="about" className="py-24 bg-white dark:bg-[#0f1017] border-b border-slate-200/60 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <h2 className="text-xs font-extrabold text-[#FE2C55] uppercase tracking-widest">About TaQ Bot</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Designed to Solve TikTok Engagement Overhead
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium">
                TaQ Bot was created for TikTok creators, digital brands, e-commerce stores, and agency managers who receive thousands of post comments and customer questions daily.
              </p>

              <div className="space-y-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#161823] border border-slate-200/70 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">What Problem We Solve</h4>
                  <p>
                    Manual comment monitoring is slow, overwhelming, and prone to missed customer inquiries. Delayed replies lead to lost sales leads and lower post engagement momentum.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#161823] border border-slate-200/70 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">How TaQ Bot Helps</h4>
                  <p>
                    TaQ Bot provides 24/7 automated monitoring, instant keyword responses, spam moderation, and seamless live human agent handover so your brand never misses an opportunity.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-[#161823] border border-slate-200/80 dark:border-slate-800 space-y-6">
              <h4 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
                Who TaQ Bot Is Designed For
              </h4>

              <ul className="space-y-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#FE2C55] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">TikTok Content Creators:</span> Respond to viral video comments instantly without drowning in notification overload.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#FE2C55] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">TikTok Shop & E-Commerce Brands:</span> Turn comment inquiries into store checkouts with instant product information.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#FE2C55] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Social Media Agencies:</span> Manage multiple brand client accounts from a single central command dashboard.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#FE2C55] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Customer Support Teams:</span> Use unified social inboxing to organize tickets and hand off live chats.
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 6. CONTACT SECTION */}
      <section id="contact" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-4xl mx-auto bg-white dark:bg-[#161823] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-8 sm:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-xs font-extrabold text-[#FE2C55] uppercase tracking-widest mb-1">Get In Touch</h2>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Contact TaQ Bot Support
                  </h3>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Have questions about your account, TikTok API integration, feature availability, or custom enterprise solutions? Send us a message and our team will get back to you promptly.
                </p>

                <div className="space-y-4 text-xs font-semibold">
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <div className="p-2 rounded-xl bg-[#FE2C55]/10 text-[#FE2C55]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Official Support Email</span>
                      <a href="mailto:techvaseegrah@gmail.com" className="text-slate-900 dark:text-white hover:text-[#FE2C55] font-bold">
                        techvaseegrah@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <div className="p-2 rounded-xl bg-[#FE2C55]/10 text-[#FE2C55]">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Support Response SLA</span>
                      <span className="text-slate-900 dark:text-white font-bold">Within 24 business hours</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                {contactSubmitted ? (
                  <div className="h-full flex flex-col items-center justify-center p-6 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">Message Sent Successfully!</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Thank you for contacting TaQ Bot. We will respond to your email shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Your Name</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={e => setContactName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FE2C55]/20 focus:border-[#FE2C55]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Email Address</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={e => setContactEmail(e.target.value)}
                        placeholder="alex@brand.com"
                        className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FE2C55]/20 focus:border-[#FE2C55]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Message / Inquiry</label>
                      <textarea
                        rows={4}
                        required
                        value={contactMessage}
                        onChange={e => setContactMessage(e.target.value)}
                        placeholder="How can we help you?"
                        className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FE2C55]/20 focus:border-[#FE2C55]"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#FE2C55] hover:bg-[#e02447] text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA BANNER SECTION */}
      <section className="py-16 bg-gradient-to-r from-[#FE2C55] via-rose-600 to-amber-600 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Automate Your TikTok Engagement?
          </h2>
          <p className="text-sm sm:text-base text-rose-100 max-w-2xl mx-auto font-medium">
            Launch your TaQ Bot workspace today and experience AI-driven social automation.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-sm px-8 py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-4 h-4 text-[#FE2C55]" />
            </Link>
          </div>
        </div>
      </section>

      {/* Universal SaaS Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
