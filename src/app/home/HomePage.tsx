import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar.js";
import Footer from "../../components/Footer.js";
import {
  MessageSquare,
  Bot,
  Zap,
  Inbox,
  Headphones,
  Video,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  UserCheck,
  Sliders,
  Mail,
  Phone,
  HelpCircle,
  TrendingUp,
  Cpu
} from "lucide-react";

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0b10] text-slate-800 dark:text-slate-100 font-sans antialiased transition-colors duration-300">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-b from-white via-slate-50 to-slate-100/60 dark:from-[#12141f] dark:via-[#0b0b10] dark:to-[#0b0b10]">
        
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#FE2C55]/10 dark:bg-[#FE2C55]/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FE2C55]/10 dark:bg-[#FE2C55]/20 border border-[#FE2C55]/20 text-[#FE2C55] text-xs font-bold tracking-wide uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Next-Gen Social Engagement CRM</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              AI-Powered TikTok Automation & Engagement Platform
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
              TaQ Bot helps creators, brands, and agencies manage TikTok engagement, moderate post comments with custom AI rules, automate supported workflows, and handle customer conversations seamlessly.
            </p>

            {/* Hero CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#FE2C55] hover:bg-[#e02447] text-white font-bold text-base transition-all shadow-lg hover:shadow-xl hover:shadow-[#FE2C55]/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white dark:bg-[#181a25] hover:bg-slate-100 dark:hover:bg-[#20222f] text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 font-bold text-base transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Sign In</span>
              </Link>
            </div>

            {/* Key trust bullets */}
            <div className="pt-6 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-semibold flex-wrap">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#FE2C55]" /> Official TikTok OAuth Integration
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#FE2C55]" /> Google Gemini AI Powered
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#FE2C55]" /> No Credit Card Required
              </span>
            </div>

          </div>

          {/* Interactive SaaS Platform Showcase Graphic */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-[#161823]/80 backdrop-blur-xl shadow-2xl p-4 sm:p-6 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-slate-400 font-mono ml-2">taqbot.com/dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                  Live Unified Inbox
                </span>
              </div>
            </div>

            {/* Dashboard Mockup Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {/* Card 1 */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1c1e2d] border border-slate-200/60 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase text-slate-400">Comment Moderation</span>
                  <Bot className="w-4 h-4 text-[#FE2C55]" />
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 bg-white dark:bg-[#12141f] rounded-lg text-xs border border-slate-200/50 dark:border-slate-700/50">
                    <p className="font-semibold text-slate-700 dark:text-slate-200">"Is this available in red?"</p>
                    <p className="text-[11px] text-[#FE2C55] font-bold mt-1">🤖 AI Auto-Replied: "Yes! Red stock is available with 2-day delivery."</p>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-[#12141f] rounded-lg text-xs border border-slate-200/50 dark:border-slate-700/50">
                    <p className="font-semibold text-slate-700 dark:text-slate-200">"Check link in bio spam!!!"</p>
                    <p className="text-[11px] text-rose-500 font-bold mt-1">🛡️ Auto-Moderated: Flagged via keyword rule</p>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1c1e2d] border border-slate-200/60 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase text-slate-400">Social Inbox</span>
                  <Inbox className="w-4 h-4 text-[#FE2C55]" />
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 bg-white dark:bg-[#12141f] rounded-lg text-xs border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100">@sarah_creator</p>
                      <p className="text-[11px] text-slate-400">Inquired about order tracking</p>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Active</span>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-[#12141f] rounded-lg text-xs border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100">@tech_brand</p>
                      <p className="text-[11px] text-slate-400">Comment automation trigger</p>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">Resolved</span>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1c1e2d] border border-slate-200/60 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase text-slate-400">TikTok OAuth Connection</span>
                  <ShieldCheck className="w-4 h-4 text-[#FE2C55]" />
                </div>
                <div className="p-3 bg-white dark:bg-[#12141f] rounded-lg text-xs space-y-2 border border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-200">Connected Account</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FE2C55]/10 text-[#FE2C55]">Verified</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Official TikTok Authorization active. User holds 100% revocation control.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* 2. FEATURES SECTION */}
      <section id="features" className="py-20 bg-white dark:bg-[#12141f] border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs font-extrabold text-[#FE2C55] uppercase tracking-wider">
              Powerful Core Features
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Built for Modern TikTok Engagement
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Explore the officially supported tools included with your TaQ Bot workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#161823] border border-slate-200/80 dark:border-slate-800 hover:border-[#FE2C55]/50 transition-all hover:shadow-lg space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FE2C55]/10 text-[#FE2C55] flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                TikTok Comment Automation
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Set custom keyword rule triggers to automate responses to comments across your connected TikTok account.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#161823] border border-slate-200/80 dark:border-slate-800 hover:border-[#FE2C55]/50 transition-all hover:shadow-lg space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FE2C55]/10 text-[#FE2C55] flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                AI Comment Moderation
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Utilize Google Gemini AI to analyze comment sentiment and moderate repetitive or inappropriate noise.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#161823] border border-slate-200/80 dark:border-slate-800 hover:border-[#FE2C55]/50 transition-all hover:shadow-lg space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FE2C55]/10 text-[#FE2C55] flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Automated Replies
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Configure smart knowledge base answers to instantly address FAQs regarding pricing, shipping, or product details.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#161823] border border-slate-200/80 dark:border-slate-800 hover:border-[#FE2C55]/50 transition-all hover:shadow-lg space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FE2C55]/10 text-[#FE2C55] flex items-center justify-center font-bold">
                <Inbox className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Social Inbox
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                A dual-pane unified conversation manager for organizing visitor inquiries, comments, and customer profiles.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#161823] border border-slate-200/80 dark:border-slate-800 hover:border-[#FE2C55]/50 transition-all hover:shadow-lg space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FE2C55]/10 text-[#FE2C55] flex items-center justify-center font-bold">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Live Chat Handover
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Seamlessly hand over automated conversations to human support agents whenever complex inquiries arise.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#161823] border border-slate-200/80 dark:border-slate-800 hover:border-[#FE2C55]/50 transition-all hover:shadow-lg space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FE2C55]/10 text-[#FE2C55] flex items-center justify-center font-bold">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Story Automation
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Track engagement updates and coordinate response workflows around your latest TikTok video uploads.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#161823] border border-slate-200/80 dark:border-slate-800 hover:border-[#FE2C55]/50 transition-all hover:shadow-lg space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FE2C55]/10 text-[#FE2C55] flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Engagement Management
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Maintain complete visibility over active conversations, pending items, and customer status tags.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#161823] border border-slate-200/80 dark:border-slate-800 hover:border-[#FE2C55]/50 transition-all hover:shadow-lg space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FE2C55]/10 text-[#FE2C55] flex items-center justify-center font-bold">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Analytics & Insights
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                View real-time metric cards showing comment volumes, response rates, and active workspace performance.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-[#0b0b10] border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs font-extrabold text-[#FE2C55] uppercase tracking-wider">
              Simple 4-Step Process
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              How TaQ Bot Works
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Get up and running with TikTok engagement automation in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-white dark:bg-[#161823] border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FE2C55] text-white flex items-center justify-center font-extrabold text-lg shadow-md">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Create Your Account
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Sign up for a TaQ Bot workspace. Your organization is instantly seeded with essential engagement templates.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-white dark:bg-[#161823] border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FE2C55] text-white flex items-center justify-center font-extrabold text-lg shadow-md">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Connect TikTok Official OAuth
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Authorize your TikTok account safely via TikTok's official authorization screen and grant requested permissions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-white dark:bg-[#161823] border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FE2C55] text-white flex items-center justify-center font-extrabold text-lg shadow-md">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Configure Rules & Moderation
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Set custom keyword rules, auto-reply triggers, knowledge base answers, and AI comment moderation settings.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative p-6 rounded-2xl bg-white dark:bg-[#161823] border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FE2C55] text-white flex items-center justify-center font-extrabold text-lg shadow-md">
                4
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Manage From Dashboard
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Monitor live comments, view engagement metrics, and converse with audience members from your unified dashboard.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* 4. TIKTOK INTEGRATION SECTION */}
      <section id="integration" className="py-20 bg-white dark:bg-[#12141f] border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900 dark:bg-[#161823] text-white p-8 md:p-12 shadow-2xl border border-slate-800 space-y-8 relative overflow-hidden">
            
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#FE2C55]/20 text-[#FE2C55]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Secure TikTok Integration
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">
                  Official OAuth 2.0 Protocol & Strict Scope Compliance
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3 p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center gap-2 text-[#FE2C55] font-bold">
                  <Lock className="w-4 h-4" />
                  <span>Official Authorization Portal</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Users connect their TikTok account by redirecting to TikTok's official login portal (<code className="text-[11px] bg-slate-900 px-1.5 py-0.5 rounded text-amber-300">tiktok.com/v2/auth/authorize</code>). TaQ Bot never asks for or stores user TikTok account passwords.
                </p>
              </div>

              <div className="space-y-3 p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center gap-2 text-[#FE2C55] font-bold">
                  <UserCheck className="w-4 h-4" />
                  <span>Transparent Permissions</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Requested permissions (such as <code className="text-[11px] bg-slate-900 px-1.5 py-0.5 rounded text-indigo-300">user.info.basic</code> and <code className="text-[11px] bg-slate-900 px-1.5 py-0.5 rounded text-indigo-300">video.list</code>) are explicitly declared during authorization and strictly used to operate workspace capabilities.
                </p>
              </div>

              <div className="space-y-3 p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center gap-2 text-[#FE2C55] font-bold">
                  <Sliders className="w-4 h-4" />
                  <span>Full User Control</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Users maintain 100% ownership over their TikTok account authorization. You can disconnect your account at any time directly from the TaQ Bot settings panel or TikTok's app permission settings.
                </p>
              </div>

              <div className="space-y-3 p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center gap-2 text-[#FE2C55] font-bold">
                  <Cpu className="w-4 h-4" />
                  <span>No Unsupported API Claims</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  TaQ Bot strictly adheres to official TikTok Developer API rules. We operate within approved scope guidelines and never perform unauthorized actions on user accounts.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 5. ABOUT SECTION */}
      <section id="about" className="py-20 bg-slate-50 dark:bg-[#0b0b10] border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FE2C55]/10 text-[#FE2C55] text-xs font-bold uppercase tracking-wider">
                About TaQ Bot
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Designed to Solve High-Volume Social Engagement Fatigue
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                TaQ Bot was created for TikTok creators, e-commerce brand owners, and social media agencies who face hundreds or thousands of post comments daily.
              </p>
              
              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200 font-medium">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FE2C55] shrink-0 mt-0.5" />
                  <p><strong>What it is:</strong> An integrated social automation platform providing comment moderation, inbox routing, and engagement analytics.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FE2C55] shrink-0 mt-0.5" />
                  <p><strong>Who it is for:</strong> Brands running TikTok content campaigns who want fast response times without manual 24/7 monitoring.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FE2C55] shrink-0 mt-0.5" />
                  <p><strong>Problem it solves:</strong> Eliminates missed customer inquiries, filters out spam, and improves overall social conversion rates.</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-[#161823] border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FE2C55]" />
                Why Choose TaQ Bot?
              </h3>
              <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#12141f] border border-slate-200/60 dark:border-slate-700/60">
                  <span className="font-bold text-slate-900 dark:text-white block mb-1">Instant FAQ Resolution</span>
                  Automatically respond to common customer questions about prices, shipping, or catalog items.
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#12141f] border border-slate-200/60 dark:border-slate-700/60">
                  <span className="font-bold text-slate-900 dark:text-white block mb-1">Human-in-the-Loop Handover</span>
                  Never lose personal connection; agents can step into live conversations with one click.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 6. CONTACT SECTION */}
      <section id="contact" className="py-20 bg-white dark:bg-[#12141f] border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="text-xs font-extrabold text-[#FE2C55] uppercase tracking-wider">
              Get In Touch
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Contact TaQ Bot Support
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Have questions about platform integration, account setup, or enterprise plans? Our engineering team is here to assist.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Contact Details Card */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-[#161823] border border-slate-200/80 dark:border-slate-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Support Channels
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-[#12141f] border border-slate-200/60 dark:border-slate-700/60">
                    <Mail className="w-6 h-6 text-[#FE2C55] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-slate-900 dark:text-white block text-xs uppercase tracking-wider">Support Email</span>
                      <a href="mailto:techvaseegrah@gmail.com" className="text-sm font-bold text-[#FE2C55] hover:underline">
                        techvaseegrah@gmail.com
                      </a>
                      <p className="text-xs text-slate-500 mt-1">For account queries, API help, and privacy requests.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-[#12141f] border border-slate-200/60 dark:border-slate-700/60">
                    <Phone className="w-6 h-6 text-[#FE2C55] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-slate-900 dark:text-white block text-xs uppercase tracking-wider">Direct Phone</span>
                      <a href="tel:+919047484484" className="text-sm font-bold text-[#FE2C55] hover:underline">
                        +91 90474 84484
                      </a>
                      <p className="text-xs text-slate-500 mt-1">Available during business hours.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Looking for quick legal guidelines? Check our <Link to="/privacy-policy" className="text-[#FE2C55] hover:underline font-bold">Privacy Policy</Link> or <Link to="/terms-of-service" className="text-[#FE2C55] hover:underline font-bold">Terms of Service</Link>.
                </p>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-[#161823] border border-slate-200/80 dark:border-slate-800 space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Send Us a Message
              </h3>
              <form onSubmit={(e) => { e.preventDefault(); alert("Thank you! Your message has been sent to techvaseegrah@gmail.com."); }} className="space-y-4 text-xs sm:text-sm">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 uppercase text-[10px]">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#12141f] focus:outline-none focus:ring-2 focus:ring-[#FE2C55]/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 uppercase text-[10px]">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. alex@brand.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#12141f] focus:outline-none focus:ring-2 focus:ring-[#FE2C55]/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 uppercase text-[10px]">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we help your TikTok workspace?"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#12141f] focus:outline-none focus:ring-2 focus:ring-[#FE2C55]/20"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#FE2C55] hover:bg-[#e02447] text-white font-bold transition-all shadow-md cursor-pointer"
                >
                  Send Inquiry
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
