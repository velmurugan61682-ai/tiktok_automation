import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext.js";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ChatPage } from "../app/chat/page.js";
import { ProductsPage } from "../app/products/page.js";
import { OrdersPage } from "../app/orders/page.js";
import { AutomationPage } from "../app/automation/page.js";
import { CustomersPage } from "../app/customers/page.js";
import { DashboardPage } from "../app/dashboard/page.js";
import { 
  Building2, 
  LayoutDashboard, 
  MessageSquare, 
  ShoppingBag, 
  Package, 
  Users, 
  Sparkles, 
  Settings, 
  LogOut, 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Activity, 
  ArrowRight,
  RefreshCw,
  Bell,
  Check,
  Bot,
  BookOpen,
  FileText,
  Plus,
  Layers,
  Shield,
  User
} from "lucide-react";

interface Metrics {
  revenue: number;
  ordersCount: number;
  customersCount: number;
  productsCount: number;
  lowStockCount: number;
  messagesCount: number;
  aiResponsesCount: number;
  commentsCount: number;
  recentOrders: any[];
  activityTimeline: any[];
}

export const TenantDashboard: React.FC = () => {
  const { user, token, logout, exitImpersonation } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getTabFromPath = (path: string) => {
    switch (path) {
      case "/dashboard":
        return "dashboard";
      case "/live-chat":
        return "chat";
      case "/products":
        return "products";
      case "/orders":
        return "orders";
      case "/customers":
        return "customers";
      case "/comments_chat":
        return "automation";
      case "/settings":
        return "settings";
      default:
        return "dashboard";
    }
  };

  const activeTab = getTabFromPath(location.pathname);

  const setActiveTab = (tab: string) => {
    switch (tab) {
      case "dashboard":
        navigate("/dashboard");
        break;
      case "chat":
        navigate("/live-chat");
        break;
      case "products":
        navigate("/products");
        break;
      case "orders":
        navigate("/orders");
        break;
      case "customers":
        navigate("/customers");
        break;
      case "automation":
        navigate("/comments_chat");
        break;
      case "settings":
        navigate("/settings");
        break;
      default:
        navigate("/dashboard");
    }
  };

  const [metrics, setMetrics] = useState<Metrics | null>(null);
  
  // TikTok connection states matching database sync
  const [tiktokConnected, setTiktokConnected] = useState(false);
  const [tiktokUsername, setTiktokUsername] = useState("");
  const [tiktokConnectedAt, setTiktokConnectedAt] = useState("");
  const [tiktokFollowers, setTiktokFollowers] = useState(0);
  const [tiktokFollowing, setTiktokFollowing] = useState(0);
  const [tiktokLikes, setTiktokLikes] = useState(0);
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [showTikTokLoginModal, setShowTikTokLoginModal] = useState(false);
  const [oauthStep, setOauthStep] = useState<"authorize" | "login" | "consent" | "callback">("authorize");
  const [tempUsername, setTempUsername] = useState("");
  const [tiktokAuthUrl, setTiktokAuthUrl] = useState("https://www.tiktok.com/v2/auth/authorize/");
  const [tiktokLoginUrl, setTiktokLoginUrl] = useState("https://www.tiktok.com/login");
  const [tiktokRedirectUri, setTiktokRedirectUri] = useState(`${window.location.origin}/api/tiktok/oauth/callback`);
  const [tiktokClientKey, setTiktokClientKey] = useState("sbawfeqyhmuf4nrhdk");
  const [settingsSubTab, setSettingsSubTab] = useState("connected_accounts");
  const [tiktokScope, setTiktokScope] = useState("user.info.basic,user.info.profile,user.info.stats,video.list");

  // Template settings state
  const [aiTemplateEnabled, setAiTemplateEnabled] = useState(false);
  const [aiTemplateText, setAiTemplateText] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/workspace/settings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAiTemplateEnabled(data.aiTemplateEnabled);
        setAiTemplateText(data.aiTemplateText || "");
      }

      // Load connected accounts from db
      const resTiktok = await fetch("/api/tiktok/accounts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resTiktok.ok) {
        const accounts = await resTiktok.json();
        const activeTiktok = accounts.find((ca: any) => ca.platform === "TIKTOK" && ca.status === "CONNECTED");
        if (activeTiktok) {
          setTiktokConnected(true);
          setTiktokUsername(activeTiktok.username);
          setTiktokConnectedAt(activeTiktok.connectedAt || "Not Available");
          setTiktokFollowers(activeTiktok.followerCount || 0);
          setTiktokFollowing(activeTiktok.followingCount || 0);
          setTiktokLikes(activeTiktok.likesCount || 0);
        } else {
          setTiktokConnected(false);
          setTiktokUsername("");
          setTiktokConnectedAt("");
          setTiktokFollowers(0);
          setTiktokFollowing(0);
          setTiktokLikes(0);
        }
      }

      // Fetch TikTok environment configurations
      const resConfig = await fetch("/api/tiktok/config", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resConfig.ok) {
        const configData = await resConfig.json();
        setTiktokAuthUrl(configData.authUrl);
        setTiktokLoginUrl(configData.loginUrl);
        setTiktokRedirectUri(configData.redirectUri);
        setTiktokClientKey(configData.clientKey);
        if (configData.scope) {
          setTiktokScope(configData.scope);
        }
      } else {
        const errorData = await resConfig.json().catch(() => ({}));
        if (errorData.error) {
          alert(`Configuration Error: ${errorData.error}`);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await fetch("/api/workspace/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          aiTemplateEnabled,
          aiTemplateText
        })
      });
      if (res.ok) {
        alert("Template settings saved successfully!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingSettings(false);
    }
  };

  const loadMetrics = async () => {
    try {
      const res = await fetch("/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMetrics(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (activeTab === "settings") {
      loadSettings();
    }
  }, [activeTab, token]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connectedParam = params.get("connected");
    const usernameParam = params.get("username");
    const errorParam = params.get("error");
    const descParam = params.get("description") || params.get("message");
    
    if (connectedParam === "true" && usernameParam) {
      setTiktokConnected(true);
      setTiktokUsername(usernameParam);
      window.history.replaceState({}, document.title, window.location.pathname);
      alert(`TikTok account @${usernameParam} successfully authorized and connected!`);
    } else if (errorParam) {
      window.history.replaceState({}, document.title, window.location.pathname);
      alert(`TikTok Connection Failed: ${errorParam}${descParam ? ` - ${descParam}` : ""}`);
    }
  }, [location.search]);

  useEffect(() => {
    loadMetrics();
    // Refresh metrics on tab view
    if (activeTab === "dashboard") {
      loadMetrics();
    }
  }, [activeTab, token]);

  useEffect(() => {
    if (showTikTokLoginModal) {
      setOauthStep("authorize");
    }
  }, [showTikTokLoginModal]);

  useEffect(() => {
    if (showTikTokLoginModal && oauthStep === "authorize") {
      const timer = setTimeout(() => {
        setOauthStep("login");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showTikTokLoginModal, oauthStep]);

  // Removed simulated mock OAuth callback useEffect to allow natural redirect flow

  const handleDisconnectTikTok = async () => {
    try {
      // Find connected account id first
      const resAcc = await fetch("/api/tiktok/accounts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resAcc.ok) {
        const accounts = await resAcc.json();
        const activeTiktok = accounts.find((ca: any) => ca.platform === "TIKTOK" && ca.status === "CONNECTED");
        if (activeTiktok) {
          await fetch("/api/tiktok/disconnect", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ id: activeTiktok.id })
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
    setTiktokConnected(false);
    setTiktokUsername("");
    alert("TikTok Account Disconnected!");
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans antialiased text-slate-900 overflow-hidden">
      
      {/* 1. Side navigation menu */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="flex h-16 items-center px-6 border-b border-slate-150">
            <img src="/logo.png" alt="TikTok Automation Logo" className="h-8 w-8 rounded-lg object-cover shadow-sm border border-slate-200" />
            <span className="ml-3 text-base font-extrabold tracking-tight text-slate-800">TikTok Automation</span>
          </div>

          {/* Nav List */}
          <nav className="py-4 space-y-0.5">
            <div className="px-6 mb-2 mt-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Workspace</p>
            </div>
            
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center px-6 py-2 text-xs font-semibold border-r-4 transition-all ${
                activeTab === "dashboard"
                  ? "text-indigo-600 bg-indigo-50/70 border-indigo-600 font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 mr-3 opacity-80" />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab("chat")}
              className={`w-full flex items-center px-6 py-2 text-xs font-semibold border-r-4 transition-all ${
                activeTab === "chat"
                  ? "text-indigo-600 bg-indigo-50/70 border-indigo-600 font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent"
              }`}
            >
              <MessageSquare className="w-4 h-4 mr-3 opacity-80" />
              Social Inbox
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center px-6 py-2 text-xs font-semibold border-r-4 transition-all ${
                activeTab === "products"
                  ? "text-indigo-600 bg-indigo-50/70 border-indigo-600 font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent"
              }`}
            >
              <ShoppingBag className="w-4 h-4 mr-3 opacity-80" />
              Product Catalog
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center px-6 py-2 text-xs font-semibold border-r-4 transition-all ${
                activeTab === "orders"
                  ? "text-indigo-600 bg-indigo-50/70 border-indigo-600 font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent"
              }`}
            >
              <Package className="w-4 h-4 mr-3 opacity-80" />
              Order Listings
            </button>

            <div className="px-6 mb-2 mt-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Management</p>
            </div>

            <button
              onClick={() => setActiveTab("customers")}
              className={`w-full flex items-center px-6 py-2 text-xs font-semibold border-r-4 transition-all ${
                activeTab === "customers"
                  ? "text-indigo-600 bg-indigo-50/70 border-indigo-600 font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent"
              }`}
            >
              <Users className="w-4 h-4 mr-3 opacity-80" />
              Customer Profiles
            </button>

            <button
              onClick={() => setActiveTab("automation")}
              className={`w-full flex items-center px-6 py-2 text-xs font-semibold border-r-4 transition-all ${
                activeTab === "automation"
                  ? "text-indigo-600 bg-indigo-50/70 border-indigo-600 font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent"
              }`}
            >
              <Sparkles className="w-4 h-4 mr-3 opacity-80" />
              TikTok Automation
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center px-6 py-2 text-xs font-semibold border-r-4 transition-all ${
                activeTab === "settings"
                  ? "text-indigo-600 bg-indigo-50/70 border-indigo-600 font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent"
              }`}
            >
              <Settings className="w-4 h-4 mr-3 opacity-80" />
              Settings & Channels
            </button>
          </nav>
        </div>

        {/* User profile at bottom */}
        <div className="p-4 border-t border-slate-150 bg-slate-50 space-y-2">
          {user?.isImpersonated && (
            <button
              onClick={exitImpersonation}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg transition-all"
            >
              Exit Impersonation
            </button>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center overflow-hidden mr-2">
              <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-300">
                {user?.name.charAt(0) || "U"}
              </div>
              <div className="ml-2 overflow-hidden">
                <p className="text-xs font-bold text-slate-700 truncate leading-tight">{user?.name || "User"}</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Tenant Admin</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Primary Layout Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Floating Impersonation Alert Banner */}
        {user?.isImpersonated && (
          <div className="bg-amber-500 text-white px-6 py-2 flex items-center justify-between text-xs font-extrabold animate-pulse">
            <span>⚠️ ADMIN VIEW IMPERSONATION ACTIVE: Modifying data live for tenant workspace: "{user.name}"</span>
            <button
              onClick={exitImpersonation}
              className="bg-white text-amber-700 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
            >
              Exit Workspace
            </button>
          </div>
        )}

        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Active Workspace</span>
            <span className="bg-slate-100 text-slate-700 font-bold text-xs px-2.5 py-1 rounded-lg border border-slate-200">
              {user?.name}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Simulation Status Dot */}
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-xl text-[10px] font-extrabold">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              TikTok Gateway: Online
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
              {user?.name.charAt(0) || "U"}
            </div>
          </div>
        </header>

        {/* Content Panel Tab routing */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === "dashboard" ? (
            <DashboardPage 
              metrics={metrics} 
              setActiveTab={setActiveTab} 
              workspaceName={user?.name} 
            />
          ) : activeTab === "chat" ? (
            <ChatPage />
          ) : activeTab === "products" ? (
            <ProductsPage />
          ) : activeTab === "orders" ? (
            <OrdersPage />
          ) : activeTab === "customers" ? (
            <CustomersPage />
          ) : activeTab === "automation" ? (
            <AutomationPage />
          ) : (
            /* Settings Panel with Channels Integration */
            <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden font-sans text-slate-800 antialiased max-w-6xl mx-auto shadow-sm">
              
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-850">Settings</h2>
                </div>
              </div>

              {/* Body: Two columns layout */}
              <div className="flex flex-col md:flex-row min-h-[550px]">
                
                {/* Left side sub-menu categories list */}
                <div className="w-full md:w-64 border-r border-slate-150 bg-slate-50/50 p-4 space-y-5">
                  
                  {/* Category: TIKTOK */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block px-3 mb-1.5">TIKTOK</span>
                    <button
                      onClick={() => setSettingsSubTab("connected_accounts")}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                        settingsSubTab === "connected_accounts"
                          ? "bg-indigo-50/50 text-indigo-650 font-bold border-l-4 border-indigo-600 pl-2"
                          : "text-slate-500 hover:text-slate-850 hover:bg-slate-50"
                      }`}
                    >
                      <Bot className="w-4 h-4 mt-0.5" />
                      <div className="leading-tight">
                        <p className="text-xs">Manage Connected Accounts</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">View and manage your connected...</p>
                      </div>
                    </button>
                  </div>

                  {/* Category: MESSAGING */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-455 uppercase tracking-wider block px-3 mb-1.5">MESSAGING</span>
                    
                    {/* Flow Studio */}
                    <button
                      onClick={() => setSettingsSubTab("flow_studio")}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                        settingsSubTab === "flow_studio"
                          ? "bg-indigo-50/50 text-indigo-650 font-bold border-l-4 border-indigo-600 pl-2"
                          : "text-slate-500 hover:text-slate-850 hover:bg-slate-50"
                      }`}
                    >
                      <Sparkles className="w-4 h-4 mt-0.5" />
                      <div className="leading-tight">
                        <p className="text-xs">Flow Studio</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">Configure visual chatbot workflow...</p>
                      </div>
                    </button>

                    {/* Templates */}
                    <button
                      onClick={() => setSettingsSubTab("templates")}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                        settingsSubTab === "templates"
                          ? "bg-indigo-50/50 text-indigo-650 font-bold border-l-4 border-indigo-600 pl-2"
                          : "text-slate-500 hover:text-slate-855 hover:bg-slate-50"
                      }`}
                    >
                      <BookOpen className="w-4 h-4 mt-0.5" />
                      <div className="leading-tight">
                        <p className="text-xs">Templates</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">Welcome and product message...</p>
                      </div>
                    </button>

                    {/* Template Message */}
                    <button
                      onClick={() => setSettingsSubTab("template_message")}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                        settingsSubTab === "template_message"
                          ? "bg-indigo-50/50 text-indigo-655 font-bold border-l-4 border-indigo-600 pl-2"
                          : "text-slate-500 hover:text-slate-855 hover:bg-slate-50"
                      }`}
                    >
                      <FileText className="w-4 h-4 mt-0.5" />
                      <div className="leading-tight">
                        <p className="text-xs">Template Message</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">Configure automated message...</p>
                      </div>
                    </button>

                    {/* Icebreaker Configuration */}
                    <button
                      onClick={() => setSettingsSubTab("icebreaker")}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                        settingsSubTab === "icebreaker"
                          ? "bg-indigo-50/50 text-indigo-655 font-bold border-l-4 border-indigo-600 pl-2"
                          : "text-slate-500 hover:text-slate-855 hover:bg-slate-50"
                      }`}
                    >
                      <Plus className="w-4 h-4 mt-0.5" />
                      <div className="leading-tight">
                        <p className="text-xs">Icebreaker Configuration</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">Set up conversation starters</p>
                      </div>
                    </button>

                    {/* Persistent Menu */}
                    <button
                      onClick={() => setSettingsSubTab("persistent_menu")}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                        settingsSubTab === "persistent_menu"
                          ? "bg-indigo-50/50 text-indigo-655 font-bold border-l-4 border-indigo-600 pl-2"
                          : "text-slate-500 hover:text-slate-855 hover:bg-slate-50"
                      }`}
                    >
                      <Settings className="w-4 h-4 mt-0.5" />
                      <div className="leading-tight">
                        <p className="text-xs">Persistent Menu</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">Configure bot system menu option...</p>
                      </div>
                    </button>
                  </div>

                  {/* Category: SYSTEM */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-455 uppercase tracking-wider block px-3 mb-1.5">SYSTEM</span>
                    
                    {/* RAG Dashboard */}
                    <button
                      onClick={() => setSettingsSubTab("rag_dashboard")}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                        settingsSubTab === "rag_dashboard"
                          ? "bg-indigo-50/50 text-indigo-655 font-bold border-l-4 border-indigo-600 pl-2"
                          : "text-slate-500 hover:text-slate-855 hover:bg-slate-50"
                      }`}
                    >
                      <Layers className="w-4 h-4 mt-0.5" />
                      <div className="leading-tight">
                        <p className="text-xs">RAG Dashboard</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">Test & manage your RAG pipeline...</p>
                      </div>
                    </button>

                    {/* API Key */}
                    <button
                      onClick={() => setSettingsSubTab("api_key")}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                        settingsSubTab === "api_key"
                          ? "bg-indigo-50/50 text-indigo-655 font-bold border-l-4 border-indigo-600 pl-2"
                          : "text-slate-500 hover:text-slate-850 hover:bg-slate-50"
                      }`}
                    >
                      <Shield className="w-4 h-4 mt-0.5" />
                      <div className="leading-tight">
                        <p className="text-xs">API Key</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">Manage your API access keys</p>
                      </div>
                    </button>
                  </div>

                  {/* Category: ACCOUNT */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-455 uppercase tracking-wider block px-3 mb-1.5">ACCOUNT</span>
                    
                    {/* Account Profile */}
                    <button
                      onClick={() => setSettingsSubTab("account_profile")}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                        settingsSubTab === "account_profile"
                          ? "bg-indigo-50/50 text-indigo-650 font-bold border-l-4 border-indigo-600 pl-2"
                          : "text-slate-500 hover:text-slate-855 hover:bg-slate-50"
                      }`}
                    >
                      <User className="w-4 h-4 mt-0.5" />
                      <div className="leading-tight">
                        <p className="text-xs">Account Profile</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">Manage account profile...</p>
                      </div>
                    </button>
                  </div>

                </div>

                {/* Right side active settings page container */}
                <div className="flex-1 p-8 bg-white">
                  {settingsSubTab === "connected_accounts" && (
                    <div className="flex flex-col items-center justify-center py-12 max-w-md mx-auto space-y-6 text-center animate-fade-in">
                      
                      {/* Brand Logo Display Circle */}
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 via-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-md relative overflow-hidden shrink-0">
                        {tiktokConnected ? "✓" : "T"}
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-slate-805">
                          {tiktokConnected ? "Connected to TikTok" : "Connect TikTok"}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {tiktokConnected 
                            ? `Your workspace is currently linked with TikTok profile @${tiktokUsername}. Orders, products, comments, and story replies will sync automatically.` 
                            : "Automate your TikTok interactions, DMs, and comment moderator features with TikTok Automation!"}
                        </p>
                      </div>

                      {/* Connection status options */}
                      {tiktokConnected ? (
                        <div className="space-y-4 w-full max-w-sm mx-auto text-left">
                          <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-3.5">
                            
                            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold">
                              <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[10px]">✓</span>
                              <span>TikTok Connected</span>
                            </div>

                            <div className="border-t border-slate-100 pt-3 space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-400 font-semibold">Account:</span>
                                <span className="text-slate-800 font-bold">@{tiktokUsername}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-400 font-semibold">Connected:</span>
                                <span className="text-slate-800 font-bold">{tiktokConnectedAt}</span>
                              </div>
                              <div className="flex justify-between text-xs border-t border-slate-50 pt-2">
                                <span className="text-slate-400 font-semibold">Followers:</span>
                                <span className="text-emerald-600 font-bold">{tiktokFollowers}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-400 font-semibold">Following:</span>
                                <span className="text-slate-800 font-bold">{tiktokFollowing}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-400 font-semibold">Likes:</span>
                                <span className="text-slate-800 font-bold">{tiktokLikes}</span>
                              </div>
                            </div>

                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                const redirectTarget = `${tiktokAuthUrl}?client_key=${tiktokClientKey}&redirect_uri=${encodeURIComponent(tiktokRedirectUri)}&response_type=code&scope=${encodeURIComponent(tiktokScope)}&state=${user?.workspaceId || "ws-1"}`;
                                window.location.href = redirectTarget;
                              }}
                              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors text-center"
                            >
                              Reconnect
                            </button>
                            <button
                              onClick={handleDisconnectTikTok}
                              className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl text-xs transition-colors text-center"
                            >
                              Disconnect
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            const redirectTarget = `${tiktokAuthUrl}?client_key=${tiktokClientKey}&redirect_uri=${encodeURIComponent(tiktokRedirectUri)}&response_type=code&scope=${encodeURIComponent(tiktokScope)}&state=${user?.workspaceId || "ws-1"}`;
                            window.location.href = redirectTarget;
                          }}
                          className="w-full py-3 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                        >
                          Connect TikTok
                        </button>
                      )}

                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1">
                          <span>🔒</span> Your data is secure with us.
                        </p>
                        <Link to="/privacy" className="text-[10px] text-indigo-650 font-bold hover:underline block">Privacy Policy</Link>
                      </div>

                    </div>
                  )}

                  {/* Other tabs rendering settings */}
                  {(settingsSubTab === "templates" || settingsSubTab === "template_message") && (
                    <div className="space-y-6 max-w-xl animate-fade-in">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">AI Bot Auto-Reply Template Settings</h3>
                        <p className="text-xs text-slate-400 mt-1">Configure workspace-wide automatic templated bot answers for direct messages.</p>
                      </div>
                      
                      <div className="p-5 border border-slate-155 rounded-xl space-y-4 bg-slate-50/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-700">Enable Custom Template Reply</p>
                            <p className="text-[10px] text-slate-405 leading-snug">If enabled, the AI Bot will automatically send your custom template message as reply in Live Chat.</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={aiTemplateEnabled} 
                              onChange={e => setAiTemplateEnabled(e.target.checked)}
                              className="sr-only peer" 
                            />
                            <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Custom Reply Template Text</label>
                          <textarea
                            disabled={!aiTemplateEnabled}
                            value={aiTemplateText}
                            onChange={e => setAiTemplateText(e.target.value)}
                            placeholder="e.g. Thanks for messaging! We've received your query and our team will get back to you shortly. Meanwhile, check out our catalog: https://factory.vaseegrahveda.com"
                            className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl h-24 focus:outline-none resize-none disabled:opacity-50 disabled:bg-slate-50"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={saveSettings}
                            disabled={savingSettings}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition-colors disabled:opacity-50"
                          >
                            {savingSettings ? "Saving Settings..." : "Save Template Settings"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Flow Studio / Icebreaker / Persistent Menu / RAG Dashboard */}
                  {(settingsSubTab === "flow_studio" || settingsSubTab === "icebreaker" || settingsSubTab === "persistent_menu" || settingsSubTab === "rag_dashboard") && (
                    <div className="space-y-4 max-w-xl animate-fade-in">
                      <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                        <Sparkles className="w-5 h-5 animate-pulse" />
                        <span>Interactive Feature Tethered</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        This module is actively integrated with your AI agent pipeline. The workspace triggers real-time direct response webhooks based on comments containing matching keywords.
                      </p>
                      
                      <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl flex justify-between items-center text-xs font-bold text-slate-700">
                        <span>Gateway Sync Agent Mode</span>
                        <span className="text-indigo-600 uppercase">ONLINE</span>
                      </div>
                    </div>
                  )}

                  {/* API Key */}
                  {settingsSubTab === "api_key" && (
                    <div className="space-y-5 max-w-xl animate-fade-in">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">Workspace API Access Keys</h3>
                        <p className="text-xs text-slate-400 mt-1">Authenticate custom external CRM systems with your TikTok automated chatbot channel.</p>
                      </div>

                      <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 flex justify-between items-center text-xs font-mono text-slate-500">
                        <span className="truncate">tok_auth_live_948f29ea18b2c4e578...</span>
                        <button onClick={() => alert("API Token copied!")} className="text-[10px] font-bold text-indigo-600 hover:underline">Copy</button>
                      </div>
                    </div>
                  )}

                  {/* Account Profile / Billing tab */}
                  {settingsSubTab === "account_profile" && (
                    <div className="space-y-6 max-w-xl animate-fade-in">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Account Billing & Plan</h3>
                        <p className="text-xs text-slate-400 mt-1">Check limits, usage quotas, and active subscription packs for your tenant organization.</p>
                      </div>

                      <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-indigo-950">14-Day Free CRM Trial Pack</p>
                          <p className="text-xs text-indigo-700 font-semibold leading-relaxed">TRIAL period is active. Expiring in 14 days. Limit: 100 SMS logs.</p>
                        </div>

                        <button
                          onClick={() => alert("Simulation checkout gateway. Upgraded to Unlimited Commercial PRO plan!")}
                          className="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-indigo-700 shadow-sm shrink-0"
                        >
                          Upgrade to PRO
                        </button>
                      </div>
                    </div>
                  )}

                </div>

              </div>

            </div>
          )}
        </div>
      </div>
           {/* TIKTOK SIMULATED AUTHORIZATION LOGIN MODAL (CHROME POPUP WINDOW STYLING) */}
      {showTikTokLoginModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          
          {/* Chrome simulated window wrapper */}
          <div className="bg-white w-[460px] h-[550px] rounded-lg shadow-2xl border border-slate-300 overflow-hidden flex flex-col animate-in">
            
            {/* 1. Chrome Titlebar */}
            <div className="h-9 bg-[#dee1e6] flex items-center justify-between px-3 shrink-0 select-none">
              <div className="flex items-center gap-1.5">
                {/* Simulated Chrome tab favicon */}
                <div className="w-3.5 h-3.5 rounded-full bg-slate-900 flex items-center justify-center text-[8px] font-extrabold text-white">T</div>
                <span className="text-[11px] text-slate-700 font-medium">Login • TikTok - Google Chrome</span>
              </div>
              
              {/* Window controls */}
              <div className="flex items-center gap-4 text-slate-600">
                <span className="text-xs cursor-pointer font-bold">—</span>
                <span className="text-xs cursor-pointer">☐</span>
                <button 
                  type="button"
                  onClick={() => setShowTikTokLoginModal(false)}
                  className="text-sm font-bold font-mono hover:text-rose-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 2. Chrome Address Bar (Stateful URL) */}
            <div className="h-9 bg-[#f1f3f4] flex items-center gap-2 px-3 border-b border-slate-200 shrink-0 select-none">
              {/* Browser control arrows */}
              <div className="flex items-center gap-2.5 text-slate-400 text-[10px]">
                <span className="cursor-not-allowed">◀</span>
                <span className="cursor-not-allowed">▶</span>
                <span className="cursor-pointer hover:text-slate-600">⟳</span>
              </div>
              
              {/* URL Address container */}
              <div className="flex-1 bg-white border border-slate-200 rounded-full px-3 py-0.5 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono overflow-hidden">
                <span className="text-emerald-600 text-[9px] shrink-0">🔒 Secure</span>
                <span className="truncate">
                  {oauthStep === "authorize" && `${tiktokAuthUrl}?client_key=aw8n9283ha9d&redirect_uri=${tiktokRedirectUri}&response_type=code&scope=user.info.basic,comment.reply`}
                  {oauthStep === "login" && tiktokLoginUrl}
                  {oauthStep === "consent" && `${tiktokAuthUrl}consent?client_key=aw8n9283ha9d&username=${tempUsername}`}
                  {oauthStep === "callback" && `${tiktokRedirectUri}?code=tktk_auth_abc123xyz&username=${tempUsername}`}
                </span>
              </div>
            </div>

            {/* 3. Chrome Window Body */}
            {oauthStep === "authorize" && (
              <div className="flex-1 bg-[#fafafa] p-8 flex flex-col items-center justify-center space-y-4 animate-in">
                <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center relative shadow-md">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-500 animate-ping opacity-60" />
                  <span className="text-white text-3xl font-extrabold tracking-tighter">d</span>
                </div>
                <div className="text-center space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-800">Redirecting to TikTok</h3>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                    Opening official TikTok partner portal services. Please wait...
                  </p>
                </div>
              </div>
            )}

            {oauthStep === "login" && (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formEl = e.currentTarget;
                  const usernameInput = formEl.elements.namedItem("tiktok_username") as HTMLInputElement;
                  const userVal = usernameInput.value;
                  if (!userVal) return;
                  setTempUsername(userVal);
                  setOauthStep("consent");
                }}
                className="flex-1 bg-[#fafafa] p-8 flex flex-col justify-between"
              >
                
                {/* TikTok Logo Glow */}
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-slate-950 flex items-center justify-center relative shadow-md mx-auto my-2">
                    <div className="absolute inset-0 rounded-full border border-cyan-400 animate-pulse opacity-50" />
                    <div className="absolute inset-0.5 rounded-full border border-rose-500 animate-pulse opacity-50" />
                    <span className="text-white text-2xl font-extrabold tracking-tighter">d</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mt-2">Log in to TikTok</h3>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-1">
                    Enter email/username and password to connect your channel gateway.
                  </p>
                </div>

                {/* Inputs */}
                <div className="space-y-3 my-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Username or Email</label>
                    <input
                      name="tiktok_username"
                      type="text"
                      required
                      placeholder="e.g. myshopofficial"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Password</label>
                    <input
                      name="tiktok_password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Submit / Brand footer */}
                <div className="space-y-6">
                  <button
                    type="submit"
                    className="w-full bg-[#161823] hover:bg-slate-900 text-white font-bold py-3 rounded-lg text-xs tracking-wider transition-colors shadow-sm"
                  >
                    Log In
                  </button>

                  <div className="text-center space-y-0.5 select-none opacity-80">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">from</p>
                    <p className="text-[12px] font-extrabold text-[#161823] tracking-tighter">TikTok Shop</p>
                  </div>
                </div>

              </form>
            )}

            {oauthStep === "consent" && (
              <div className="flex-1 bg-[#fafafa] p-8 flex flex-col justify-between animate-in">
                
                <div className="space-y-5">
                  {/* Connection Header and avatars */}
                  <div className="flex items-center justify-center gap-4 py-2">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-lg">
                      T
                    </div>
                    <div className="text-slate-300 font-bold text-sm">◀ ── ▶</div>
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
                      SaaS
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <h3 className="text-sm font-bold text-slate-800">
                      Authorize access to @{tempUsername}?
                    </h3>
                    <p className="text-[10px] text-slate-405 leading-relaxed font-semibold">
                      Your SaaS is requesting permission to access your TikTok account details.
                    </p>
                  </div>

                  {/* Permissions Checklist */}
                  <div className="bg-white border border-slate-150 rounded-xl p-3.5 space-y-2.5 text-[10.5px] text-slate-600">
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-500 font-extrabold">✓</span>
                      <div>
                        <p className="font-bold text-slate-700">Read basic profile info</p>
                        <p className="text-[9.5px] text-slate-400">Access display name, avatar, and handle.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-500 font-extrabold">✓</span>
                      <div>
                        <p className="font-bold text-slate-700">Manage direct messages</p>
                        <p className="text-[9.5px] text-slate-400">Receive DMs, load threads, and automate replies.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-500 font-extrabold">✓</span>
                      <div>
                        <p className="font-bold text-slate-700">Manage video comments</p>
                        <p className="text-[9.5px] text-slate-400">Listen for keyword triggers and add comment replies.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consent actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowTikTokLoginModal(false)}
                    className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-lg text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setOauthStep("callback")}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-colors shadow-sm"
                  >
                    Allow & Authorize
                  </button>
                </div>

              </div>
            )}

            {oauthStep === "callback" && (
              <div className="flex-1 bg-[#fafafa] p-8 flex flex-col items-center justify-center space-y-4 animate-in">
                <div className="w-10 h-10 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin" />
                <div className="text-center space-y-1.5">
                  <h3 className="text-xs font-bold text-slate-800">Completing Authorization Flow</h3>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                    Exchanging authorization code for access tokens and saving to MongoDB...
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
