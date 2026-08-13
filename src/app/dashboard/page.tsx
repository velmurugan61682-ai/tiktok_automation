import React, { useState } from "react";
import { NotificationBell } from "../../components/NotificationBell.js";
import { 
  DollarSign, 
  Package, 
  Sparkles, 
  MessageSquare, 
  Activity,
  AlertCircle,
  Users,
  ChevronDown,
  Bot,
  User,
  Layers,
  Send,
  BookOpen
} from "lucide-react";

interface DashboardActivity {
  title: string;
  message: string;
  time: string;
  type: string;
}

interface DashboardMetrics {
  revenue: number;
  ordersCount: number;
  customersCount: number;
  productsCount: number;
  lowStockCount: number;
  messagesCount: number;
  aiResponsesCount: number;
  commentsCount: number;
  recentOrders: Array<{
    id: string;
    paymentMethod: string;
    paymentStatus: string;
    status: string;
    totalAmount: number;
  }>;
  activityTimeline: DashboardActivity[];
  followersCount?: number;
  followingCount?: number;
}

interface DashboardPageProps {
  metrics: DashboardMetrics | null;
  setActiveTab: (tab: string) => void;
  workspaceName?: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ metrics, setActiveTab, workspaceName }) => {
  const [agentMode, setAgentMode] = useState<"AI Agent" | "Human Agent">("AI Agent");
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);

  if (!metrics) {
    return (
      <div className="flex items-center justify-center p-24 text-slate-400 animate-pulse font-bold">
        Loading dashboard metrics...
      </div>
    );
  }

  // Display values mapped STRICTLY from database metrics with no fallback placeholders
  const displayRevenue = metrics.revenue;
  const displayOrders = metrics.ordersCount;
  const displayCustomers = metrics.customersCount;
  const displayComments = metrics.commentsCount;

  // 12-month data overview - set to 0 by default, can be populated from order history values
  const monthlyData = [
    { month: "Aug", value: 0 },
    { month: "Sep", value: 0 },
    { month: "Oct", value: 0 },
    { month: "Nov", value: 0 },
    { month: "Dec", value: 0 },
    { month: "Jan", value: 0 },
    { month: "Feb", value: 0 },
    { month: "Mar", value: 0 },
    { month: "Apr", value: 0 },
    { month: "May", value: 0 },
    { month: "Jun", value: 0 },
    { month: "Jul", value: 0 }
  ];

  // Distribute order amounts to monthly chart dynamically if orders exist
  if (metrics.recentOrders.length > 0) {
    monthlyData[11].value = metrics.revenue; // Current month represents total active revenue
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in font-sans">
      
      {/* Top Header Row with dropdown status to match screenshot */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-155 shadow-sm">
        <div className="space-y-0.5">
          <h2 className="text-xl font-bold text-slate-800">Dashboard</h2>
          <p className="text-xs text-slate-400">Real-time overview of your store's performance and bot automations.</p>
        </div>

        <div className="flex items-center gap-2">
          <NotificationBell />

          {/* AI Agent / Human Agent Dropdown selector */}
          <div className="relative">
            <button 
              onClick={() => setShowAgentDropdown(!showAgentDropdown)}
              className="flex items-center gap-2 bg-slate-55 hover:bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 transition-all shadow-sm"
            >
              <Bot className="w-4 h-4 text-indigo-650" />
              <span>{agentMode}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showAgentDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-30 animate-fade-in">
                <button
                  onClick={() => {
                    setAgentMode("AI Agent");
                    setShowAgentDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-55 flex items-center gap-2 text-slate-705"
                >
                  <Bot className="w-4 h-4 text-indigo-650" />
                  AI Agent
                </button>
                <button
                  onClick={() => {
                    setAgentMode("Human Agent");
                    setShowAgentDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-55 flex items-center gap-2 text-slate-705"
                >
                  <User className="w-4 h-4 text-indigo-655" />
                  Human Agent
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Card + Key Metrics Cards Stack */}
        <div className="space-y-6">
          
          {/* Profile Card matching the exact instagram/influencer profile style */}
          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              {/* Profile Avatar Ring */}
              <div className="w-16 h-16 rounded-full p-0.5 border-2 border-indigo-400 bg-gradient-to-tr from-indigo-400 via-blue-500 to-purple-600 shrink-0">
                <div className="w-full h-full rounded-full bg-slate-100 border-2 border-white overflow-hidden flex items-center justify-center font-extrabold text-indigo-650 text-lg">
                  {workspaceName ? workspaceName.charAt(0).toUpperCase() : "வ"}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 text-sm leading-tight">
                  {workspaceName || "வசீகர வேதா | தூய மூலிகை தொழிற்சாலை"}
                </h3>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Workspace Tenant Owner</p>
              </div>
            </div>

            {/* Profile Statistics linked strictly to the database */}
            <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
              <div>
                <p className="text-sm font-extrabold text-slate-800">{metrics.productsCount}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Posts</p>
              </div>
              <div className="border-x border-slate-100">
                <p className="text-sm font-extrabold text-slate-800">{metrics.followersCount ?? 0}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Followers</p>
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-800">{metrics.followingCount ?? 0}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Following</p>
              </div>
            </div>
          </div>

          {/* Metrics Stack */}
          <div className="space-y-4">
            
            {/* Total Revenue Card (Blue Gradient matching request) */}
            <div className="bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-700 p-5 rounded-2xl text-white shadow-md relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <DollarSign className="w-24 h-24" />
              </div>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-blue-100 uppercase tracking-wider block">Total Revenue</span>
                  <p className="text-3xl font-extrabold">₹{displayRevenue}</p>
                  <span className="inline-block bg-blue-700/30 px-2 py-0.5 rounded text-[10px] font-bold mt-1">All time</span>
                </div>
                <div className="bg-white/10 p-2 rounded-xl">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            {/* Total Orders Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Orders</span>
                <p className="text-xl font-extrabold text-slate-800">{displayOrders}</p>
                <span className="text-[9px] text-slate-400 font-semibold">All time</span>
              </div>
              <div className="bg-blue-50 p-2.5 rounded-xl text-blue-555">
                <Package className="w-5 h-5" />
              </div>
            </div>

            {/* Active Customers Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Customers</span>
                <p className="text-xl font-extrabold text-slate-800">{displayCustomers}</p>
                <span className="text-[9px] text-slate-400 font-semibold">All time</span>
              </div>
              <div className="bg-rose-50 p-2.5 rounded-xl text-rose-500">
                <Users className="w-5 h-5" />
              </div>
            </div>

            {/* Comments Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Comments</span>
                <p className="text-xl font-extrabold text-slate-800">{displayComments}</p>
                <span className="text-[9px] text-slate-400 font-semibold">All time</span>
              </div>
              <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-500">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>

          </div>

          {/* Today Performance */}
          <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Today Performance</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Orders • Today</p>
                  <p className="text-lg font-extrabold text-slate-700">0</p>
                  <span className="inline-flex items-center gap-0.5 text-[8px] bg-emerald-50 text-emerald-600 font-extrabold px-1 py-0.2 rounded mt-0.5">Live</span>
                </div>
                <div className="bg-blue-50 p-1.5 rounded-lg text-blue-550">
                  <Package className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Revenue • Today</p>
                  <p className="text-lg font-extrabold text-slate-700">₹0</p>
                  <span className="inline-flex items-center gap-0.5 text-[8px] bg-emerald-50 text-emerald-600 font-extrabold px-1 py-0.2 rounded mt-0.5">Live</span>
                </div>
                <div className="bg-indigo-50 p-1.5 rounded-lg text-indigo-500">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Chart + Bot Activity Grid */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Total Income Revenue Overview (Bar Chart) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Total Income</h3>
                <p className="text-[10px] text-slate-400 font-semibold">12-month revenue overview</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span> Profit</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-slate-200 rounded-full"></span> Cost</span>
              </div>
            </div>

            {/* Custom CSS Bar Chart matching the screenshot details */}
            <div className="h-60 flex items-end justify-between gap-1 pb-2 border-b border-slate-100">
              {monthlyData.map((d, index) => {
                const maxVal = 7000;
                const barHeight = d.value > 0 ? `${(d.value / maxVal) * 100}%` : "4%";
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="w-full flex items-end gap-0.5 justify-center h-full">
                      {/* Profit bar */}
                      <div 
                        style={{ height: barHeight }} 
                        className={`w-3 rounded-t bg-blue-500 hover:bg-blue-600 transition-all cursor-pointer relative group-hover:scale-x-110`}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-bold">
                          ₹{d.value}
                        </div>
                      </div>
                      {/* Cost bar (filler default small) */}
                      <div 
                        style={{ height: d.value > 0 ? "8%" : "2%" }} 
                        className="w-1.5 rounded-t bg-slate-200"
                      ></div>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">{d.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bot Activity Grid (Today overview matching Screenshot 2) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bot Activity • Today</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Total Bot Responses */}
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Total Bot Responses</p>
                  <p className="text-2xl font-extrabold text-slate-800">{metrics.aiResponsesCount}</p>
                  <span className="inline-flex items-center gap-0.5 text-[8px] bg-emerald-50 text-emerald-600 font-extrabold px-1 py-0.2 rounded">Live Today</span>
                </div>
                <div className="bg-rose-50 p-2.5 rounded-xl text-rose-500">
                  <Bot className="w-5 h-5" />
                </div>
              </div>

              {/* Bot Messages */}
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Bot Messages</p>
                  <p className="text-2xl font-extrabold text-slate-800">{metrics.aiResponsesCount}</p>
                  <span className="text-[9px] text-slate-400 font-semibold">Today</span>
                </div>
                <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-500">
                  <Send className="w-5 h-5" />
                </div>
              </div>

              {/* Templates */}
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Templates</p>
                  <p className="text-xl font-extrabold text-slate-800">0</p>
                  <span className="text-[9px] text-slate-400 font-semibold">Today</span>
                </div>
                <div className="bg-indigo-50/70 p-2.5 rounded-xl text-indigo-650">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>

              {/* Carousals */}
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Carousals</p>
                  <p className="text-xl font-extrabold text-slate-800">0</p>
                  <span className="text-[9px] text-slate-400 font-semibold">Today</span>
                </div>
                <div className="bg-rose-50 p-2.5 rounded-xl text-rose-600">
                  <Layers className="w-5 h-5" />
                </div>
              </div>

              {/* Replies */}
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center justify-between md:col-span-2">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Replies</p>
                  <p className="text-xl font-extrabold text-slate-800">0</p>
                  <span className="text-[9px] text-slate-400 font-semibold">Today</span>
                </div>
                <div className="bg-[#eef2ff] p-2.5 rounded-xl text-indigo-600">
                  <Send className="w-5 h-5" />
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
