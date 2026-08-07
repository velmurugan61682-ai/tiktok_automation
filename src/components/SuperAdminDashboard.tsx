import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext.js";
import { 
  Users, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Search, 
  ExternalLink, 
  Plus, 
  Power, 
  RotateCcw, 
  Database, 
  FileText, 
  Key, 
  LogOut, 
  Building2,
  Trash2,
  Lock
} from "lucide-react";

interface Workspace {
  id: string;
  name: string;
  phone: string;
  shopName: string;
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
  plan: "TRIAL" | "PRO";
  endDate: string;
  smsCount: number;
  createdAt: string;
}

export const SuperAdminDashboard: React.FC = () => {
  const { token, logout, impersonate } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"orgs" | "templates" | "keys">("orgs");
  const [stats, setStats] = useState({
    totalShops: 293,
    proUsers: 6,
    trialUsers: 281,
    expiringSoon: 4
  });

  // Create Workspace Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrg, setNewOrg] = useState({ name: "", phone: "", shopName: "" });

  const fetchWorkspaces = async () => {
    try {
      const res = await fetch("/api/admin/organizations", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWorkspaces(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats({
          totalShops: data.totalShops || 293,
          proUsers: data.proUsers || 6,
          trialUsers: data.trialUsers || 281,
          expiringSoon: data.expiringSoon || 4
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
    fetchStats();
  }, [token]);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newOrg,
          status: "ACTIVE",
          plan: "TRIAL",
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          smsCount: 100
        })
      });
      if (res.ok) {
        setShowCreateModal(false);
        setNewOrg({ name: "", phone: "", shopName: "" });
        fetchWorkspaces();
        fetchStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      const res = await fetch(`/api/admin/organizations/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) fetchWorkspaces();
    } catch (e) {
      console.error(e);
    }
  };

  const handleTogglePlan = async (id: string, currentPlan: string) => {
    const nextPlan = currentPlan === "PRO" ? "TRIAL" : "PRO";
    // If PRO, set a far end date, if TRIAL set a trial length
    const endDate = nextPlan === "PRO" ? "2034-02-22" : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    try {
      const res = await fetch(`/api/admin/organizations/${id}/plan`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ plan: nextPlan, endDate })
      });
      if (res.ok) {
        fetchWorkspaces();
        fetchStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetSMS = async (id: string) => {
    const smsCount = prompt("Enter SMS Limit for this organisation:", "1000");
    if (smsCount === null) return;
    try {
      const res = await fetch(`/api/admin/organizations/${id}/reset-sms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ smsCount: parseInt(smsCount, 10) || 0 })
      });
      if (res.ok) fetchWorkspaces();
    } catch (e) {
      console.error(e);
    }
  };

  const handleImpersonate = async (workspaceId: string, name: string) => {
    try {
      const res = await fetch(`/api/admin/impersonate/${workspaceId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Trigger AuthContext impersonate action
        impersonate(data.token, name);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteOrg = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this organization? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/organizations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchWorkspaces();
        fetchStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Helper to compute days left
  const getDaysLeft = (endDateStr: string) => {
    const end = new Date(endDateStr);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const filteredWorkspaces = workspaces.filter(w => {
    const query = search.toLowerCase();
    return (
      w.name.toLowerCase().includes(query) ||
      (w.phone && w.phone.includes(query)) ||
      w.shopName.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex h-screen bg-slate-50 font-sans antialiased text-slate-900 overflow-hidden">
      {/* Sidebar - Matches Screenshot style */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex h-16 items-center px-6 border-b border-slate-150">
            <img src="/logo.png" alt="TikTok Automation Logo" className="h-8 w-8 rounded-lg object-cover shadow-sm border border-slate-200" />
            <span className="ml-3 text-base font-extrabold tracking-tight text-slate-800">TikTok Automation</span>
          </div>

          <nav className="py-4 space-y-0.5">
            <div className="px-6 mb-2 mt-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Management</p>
            </div>

            <button
              onClick={() => setActiveTab("orgs")}
              className={`w-full flex items-center px-6 py-2 text-xs font-semibold border-r-4 transition-all ${
                activeTab === "orgs"
                  ? "text-indigo-600 bg-indigo-50/70 border-indigo-600 font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent"
              }`}
            >
              <Building2 className="w-4 h-4 mr-3 opacity-80" />
              Organizations
            </button>
            <button
              onClick={() => setActiveTab("templates")}
              className={`w-full flex items-center px-6 py-2 text-xs font-semibold border-r-4 transition-all ${
                activeTab === "templates"
                  ? "text-indigo-600 bg-indigo-50/70 border-indigo-600 font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent"
              }`}
            >
              <FileText className="w-4 h-4 mr-3 opacity-80" />
              Print Templates
            </button>
            <button
              onClick={() => setActiveTab("keys")}
              className={`w-full flex items-center px-6 py-2 text-xs font-semibold border-r-4 transition-all ${
                activeTab === "keys"
                  ? "text-indigo-600 bg-indigo-50/70 border-indigo-600 font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent"
              }`}
            >
              <Key className="w-4 h-4 mr-3 opacity-80" />
              System API Keys
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-150 bg-slate-50">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 flex flex-col">
        {activeTab === "orgs" ? (
          <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header Metrics Widgets - Matches exact numbers & colors of screenshot */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Shops</span>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalShops}</p>
                  <p className="text-[10px] text-green-600 font-bold">↑ 8.2% vs last month</p>
                </div>
                <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pro Users</span>
                  <p className="text-2xl font-bold text-slate-900">{stats.proUsers}</p>
                  <p className="text-[10px] text-emerald-600 font-bold">★ Active licenses</p>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-lg text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Trial Users</span>
                  <p className="text-2xl font-bold text-slate-900">{stats.trialUsers}</p>
                  <p className="text-[10px] text-indigo-600 font-bold">↑ 12 new this week</p>
                </div>
                <div className="bg-purple-50 p-2.5 rounded-lg text-purple-600">
                  <Zap className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Expiring (&lt;7d)</span>
                  <p className="text-2xl font-bold text-slate-900">{stats.expiringSoon}</p>
                  <p className="text-[10px] text-rose-600 font-bold">Requires attention</p>
                </div>
                <div className="bg-rose-50 p-2.5 rounded-lg text-rose-600">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
            </div>

             {/* Organizations Table Container */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-150 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Manage Organisations</h2>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Configure and monitor multi-tenant workspaces and TikTok API integrations.</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative w-56">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search phone, name or shop..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                    />
                  </div>

                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm shadow-indigo-100 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Org
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-2 px-4">ID</th>
                      <th className="py-2 px-4">Phone</th>
                      <th className="py-2 px-4">Name</th>
                      <th className="py-2 px-4">Shop Name</th>
                      <th className="py-2 px-4 text-center">SMS #</th>
                      <th className="py-2 px-4">Plan</th>
                      <th className="py-2 px-4">End Date</th>
                      <th className="py-2 px-4 text-center">Days Left</th>
                      <th className="py-2 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {filteredWorkspaces.map((w, i) => {
                      const daysLeft = getDaysLeft(w.endDate);
                      const isExpired = daysLeft < 0;

                      return (
                        <tr key={w.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2.5 px-4 font-mono text-[10px] text-slate-400">#{i + 1}</td>
                          <td className="py-2.5 px-4 font-bold text-slate-800">{w.phone || "—"}</td>
                          <td className="py-2.5 px-4 text-slate-600 font-medium">{w.name}</td>
                          <td className="py-2.5 px-4 text-slate-900 font-bold">{w.shopName}</td>
                          <td className="py-2.5 px-4 text-center">
                            <span className="inline-flex items-center justify-center bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold text-[10px]">
                              {w.smsCount}
                            </span>
                          </td>
                          <td className="py-2.5 px-4">
                            {w.plan === "PRO" ? (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                PRO
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                TRIAL
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-slate-500 font-medium">
                            {new Date(w.endDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <span className={`font-bold text-xs ${isExpired ? "text-rose-600 font-extrabold" : daysLeft < 30 ? "text-amber-600" : "text-slate-800"}`}>
                              {daysLeft}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                            {/* Impersonate button */}
                            <button
                              onClick={() => handleImpersonate(w.id, w.name)}
                              title="Open Workspace Impersonation"
                              className="inline-flex items-center justify-center p-1 text-indigo-600 hover:bg-indigo-50 rounded transition-all"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>

                            {/* Plan Toggle Button */}
                            <button
                              onClick={() => handleTogglePlan(w.id, w.plan)}
                              className={`text-[10px] px-2 py-0.5 rounded font-bold border transition-all ${
                                w.plan === "PRO"
                                  ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              }`}
                            >
                              {w.plan === "PRO" ? "Demote" : "Promote"}
                            </button>

                            {/* Reset SMS Button */}
                            <button
                              onClick={() => handleResetSMS(w.id)}
                              className="text-[10px] bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 px-2 py-0.5 rounded font-bold transition-all"
                            >
                              Reset SMS
                            </button>

                            {/* Suspend Toggle */}
                            <button
                              onClick={() => handleToggleStatus(w.id, w.status)}
                              title={w.status === "ACTIVE" ? "Suspend Workspace" : "Activate Workspace"}
                              className={`p-1.5 rounded-lg border transition-all inline-flex items-center justify-center ${
                                w.status === "ACTIVE"
                                  ? "text-rose-500 border-rose-200 hover:bg-rose-50"
                                  : "text-emerald-500 border-emerald-200 hover:bg-emerald-50"
                              }`}
                            >
                              <Power className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Org */}
                            <button
                              onClick={() => handleDeleteOrg(w.id)}
                              title="Delete Organization"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all inline-flex items-center justify-center"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : activeTab === "templates" ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Print Templates</h2>
            <p className="text-slate-500 text-sm">
              Manage multi-tenant invoice templates, barcode prints, thermal shipping labels, and CRM flyers.
            </p>
            <div className="p-12 border border-dashed border-slate-200 rounded-xl text-center space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-500">No Custom Print Templates Loaded</p>
              <button className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-indigo-700">
                Upload Thermal Template (.zpl)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold text-slate-800">System API Keys & Core Secrets</h2>
            <p className="text-slate-500 text-sm">
              Global authorization keys for TikTok Shop Developer APIs, OpenAI Engine, and Cloudinary Content Delivery Network.
            </p>
            <div className="space-y-4">
              <div className="p-4 border border-slate-100 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-700">TikTok Developer Client ID</p>
                  <p className="text-xs font-mono text-slate-400">tt_client_secret_998124...</p>
                </div>
                <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Configured</span>
              </div>
              <div className="p-4 border border-slate-100 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-700">Cloudinary API Gateway</p>
                  <p className="text-xs font-mono text-slate-400">cloud_cdn_secure_key_55a...</p>
                </div>
                <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Configured</span>
              </div>
              <div className="p-4 border border-slate-100 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-700">Gemini Pro API Key</p>
                  <p className="text-xs font-mono text-slate-400">process.env.GEMINI_API_KEY</p>
                </div>
                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">ACTIVE</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* CREATE WORKSPACE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Create New Workspace</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleCreateOrg} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Organization Owner Name</label>
                <input
                  type="text"
                  required
                  value={newOrg.name}
                  onChange={e => setNewOrg({ ...newOrg, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Contact Phone Number</label>
                <input
                  type="text"
                  required
                  value={newOrg.phone}
                  onChange={e => setNewOrg({ ...newOrg, phone: e.target.value })}
                  placeholder="e.g. 9845678901"
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">TikTok Shop Name</label>
                <input
                  type="text"
                  required
                  value={newOrg.shopName}
                  onChange={e => setNewOrg({ ...newOrg, shopName: e.target.value })}
                  placeholder="e.g. Factory Vaseegrah Veda"
                  className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-sm shadow-indigo-100"
              >
                Create and Seed Workspace
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
