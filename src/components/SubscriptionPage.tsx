import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext.js";
import { 
  CreditCard, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  AlertTriangle, 
  RefreshCw, 
  Download, 
  Layers,
  Crown,
  Check,
  UserCheck
} from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface SubscriptionStatus {
  plan: "FREE" | "PRO" | "TRIAL";
  endDate: string;
  connectedAccountsCount: number;
  maxAllowedAccounts: number;
  accountLimitReached: boolean;
  keyId: string;
  razorpaySubscriptionId?: string;
  razorpaySubscriptionStatus?: string;
  configured?: boolean;
}


const loadRazorpayCheckout = () => {
  if (window.Razorpay) return Promise.resolve();

  return new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Razorpay checkout failed to load.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Razorpay checkout failed to load."));
    document.head.appendChild(script);
  });
};
export const SubscriptionPage: React.FC = () => {
  const { token, user } = useAuth();
  const [subStatus, setSubStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/subscription/status", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSubStatus(data);
      }
    } catch (e) {
      console.error("Failed to load subscription status:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [token]);

  const handleRazorpayUpgrade = async () => {
    setPaying(true);
    setMessage(null);

    try {
      const subscriptionRes = await fetch("/api/subscription/create-subscription", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      const subscriptionData = await subscriptionRes.json().catch(() => ({}));
      if (!subscriptionRes.ok) {
        throw new Error(subscriptionData.error || "Failed to create Razorpay subscription.");
      }
      if (!subscriptionData.keyId || !subscriptionData.subscriptionId) {
        throw new Error("Razorpay subscription response is incomplete.");
      }

      if (subscriptionData.dummy) {
        const verifyRes = await fetch("/api/subscription/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            razorpay_payment_id: `pay_dummy_${Date.now()}`,
            razorpay_subscription_id: subscriptionData.subscriptionId,
            razorpay_signature: "dummy_signature"
          })
        });

        const verifyData = await verifyRes.json().catch(() => ({}));
        if (!verifyRes.ok) {
          throw new Error(verifyData.error || "Dummy Razorpay verification failed.");
        }

        setMessage({
          text: "Dummy Razorpay payment successful. Workspace upgraded to PRO Plan.",
          type: "success"
        });
        fetchStatus();
        setPaying(false);
        return;
      }

      await loadRazorpayCheckout();

      const options = {
        key: subscriptionData.keyId,
        subscription_id: subscriptionData.subscriptionId,
        name: "CreatorConnect Pro",
        description: subscriptionData.planName || "Monthly PRO Plan Subscription",
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/subscription/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json().catch(() => ({}));
            if (!verifyRes.ok) {
              throw new Error(verifyData.error || "Payment verification failed.");
            }

            setMessage({
              text: "Payment successful. Workspace upgraded to PRO Plan with unlimited accounts.",
              type: "success"
            });
            fetchStatus();
          } catch (verifyErr: any) {
            setMessage({ text: verifyErr.message || "Verification failed.", type: "error" });
          } finally {
            setPaying(false);
          }
        },
        prefill: {
          name: user?.name || "Tenant Owner",
          email: user?.email || "owner@smartmart.com"
        },
        notes: {
          workspaceId: user?.workspaceId || ""
        },
        theme: {
          color: "#FE2C55"
        },
        modal: {
          ondismiss: function () {
            setPaying(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setMessage({ text: err.message || "Checkout failed.", type: "error" });
      setPaying(false);
    }
  };
  const handleSwitchToFree = async () => {
    if (!confirm("Are you sure you want to switch to the Free Plan? Connected accounts will be limited to 1.")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/subscription/switch-free", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMessage({ text: "Switched to Free Plan (1 Account Limit).", type: "success" });
        fetchStatus();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const isPro = subStatus?.plan === "PRO";

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#2f3142] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#FE2C55]" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Subscription & Billing</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your workspace plan, upgrade via Razorpay, and view connected account capacity limits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchStatus}
            className="p-2 rounded-xl bg-slate-100 dark:bg-[#161823] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#2f3142] hover:bg-slate-200 dark:hover:bg-[#1e202e] transition-colors cursor-pointer text-xs font-bold flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Status
          </button>
        </div>
      </div>

      {/* Alert Banner Message */}
      {message && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-semibold animate-fade-in ${
          message.type === "success" 
            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
            : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-extrabold text-sm ml-4">✕</button>
        </div>
      )}

      {/* Account Limit Warning Notice (If Limit Exceeded on Free Plan) */}
      {subStatus?.accountLimitReached && !isPro && (
        <div className="bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/40 p-4 rounded-2xl flex items-start gap-3 text-amber-800 dark:text-amber-300 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-extrabold text-sm">Account Limit Reached (Free Plan: 1 Max)</p>
            <p className="text-slate-600 dark:text-slate-300">
              You are currently using your 1 allowed connected account on the Free Plan. To connect additional YouTube or TikTok accounts, please upgrade to the PRO Plan below.
            </p>
          </div>
        </div>
      )}

      {/* Active Subscription Status Banner Card */}
      <div className="bg-white dark:bg-[#161823] p-6 rounded-3xl border border-slate-200 dark:border-[#2f3142] shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FE2C55]/10 to-[#25F4EE]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Current Workspace Plan</span>
            {isPro ? (
              <span className="bg-[#FE2C55] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <Crown className="w-3 h-3" /> PRO PREMIUM ACTIVE
              </span>
            ) : (
              <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                FREE PLAN
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            {isPro ? "Unlimited PRO Plan" : "Starter Free Plan"}
            <span className="text-xs font-normal text-slate-400 dark:text-slate-500">({isPro ? "₹499 / month" : "₹0 / month"})</span>
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#25F4EE]" />
              <span>Accounts Connected: <strong className="text-slate-800 dark:text-slate-100">{subStatus?.connectedAccountsCount || 0} / {isPro ? "Unlimited" : "1 Max"}</strong></span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#FE2C55]" />
              <span>Expires / Renews: <strong className="text-slate-800 dark:text-slate-100">{subStatus?.endDate ? new Date(subStatus.endDate).toLocaleDateString() : "Active"}</strong></span>
            </div>
          </div>
        </div>

        <div className="relative z-10 shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {!isPro ? (
            <button
              type="button"
              onClick={handleRazorpayUpgrade}
              disabled={paying}
              className="w-full sm:w-auto bg-[#FE2C55] hover:bg-[#e02447] text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-lg hover:shadow-[0_0_20px_rgba(254,44,85,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {paying ? "Opening Razorpay..." : "Upgrade to PRO (₹499/mo)"}
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleRazorpayUpgrade}
                disabled={paying}
                className="w-full sm:w-auto bg-[#FE2C55] hover:bg-[#e02447] text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Renew Subscription (₹499)
              </button>
              <button
                type="button"
                onClick={handleSwitchToFree}
                className="w-full sm:w-auto bg-slate-100 dark:bg-[#252838] text-slate-600 dark:text-slate-300 font-bold text-xs px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-[#383b52] hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Switch to Free
              </button>
            </>
          )}
        </div>
      </div>

      {/* Plan Comparison Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">Select Subscription Plan</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FREE PLAN CARD */}
          <div className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
            !isPro 
              ? "bg-white dark:bg-[#161823] border-[#FE2C55]/60 shadow-lg ring-1 ring-[#FE2C55]/30" 
              : "bg-white dark:bg-[#161823] border-slate-200 dark:border-[#2f3142]"
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Free Starter</span>
                {!isPro && (
                  <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    Active Plan
                  </span>
                )}
              </div>

              <div>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">₹0</span>
                <span className="text-xs text-slate-400 font-medium"> / forever</span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Ideal for solo creators starting out with a single account.
              </p>

              <div className="space-y-2.5 pt-2 border-t border-slate-150 dark:border-[#2f3142]">
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Max <strong>1 Connected Account</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Basic Gemini AI Auto-Replies</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Standard Social Inbox</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              {!isPro ? (
                <button
                  type="button"
                  disabled
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-bold py-2.5 rounded-xl cursor-not-allowed text-center"
                >
                  Current Active Plan
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSwitchToFree}
                  className="w-full bg-slate-100 dark:bg-[#252838] hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer text-center"
                >
                  Downgrade to Free
                </button>
              )}
            </div>
          </div>

          {/* PRO PREMIUM PLAN CARD */}
          <div className={`p-6 rounded-3xl border transition-all flex flex-col justify-between relative overflow-hidden ${
            isPro 
              ? "bg-white dark:bg-[#161823] border-[#FE2C55] shadow-xl ring-2 ring-[#FE2C55]/40" 
              : "bg-white dark:bg-[#161823] border-[#25F4EE]/50 hover:border-[#FE2C55] shadow-md"
          }`}>
            <div className="absolute top-0 right-0 bg-gradient-to-r from-[#FE2C55] to-[#25F4EE] text-white text-[9px] font-extrabold px-4 py-1 rounded-bl-xl uppercase tracking-wider shadow-sm">
              RECOMMENDED
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#FE2C55] uppercase tracking-wider flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" /> PRO Premium
                </span>
                {isPro && (
                  <span className="bg-[#FE2C55] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>

              <div>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">₹499</span>
                <span className="text-xs text-slate-400 font-medium"> / month</span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                For growing brands requiring unlimited social accounts and high-volume automation.
              </p>

              <div className="space-y-2.5 pt-2 border-t border-slate-150 dark:border-[#2f3142]">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-100">
                  <Check className="w-4 h-4 text-[#FE2C55] shrink-0" />
                  <span><strong>Unlimited Connected Accounts</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-[#FE2C55] shrink-0" />
                  <span>Advanced Gemini AI Context Auto-Responder</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-[#FE2C55] shrink-0" />
                  <span>TikTok Comment Automation & Keyword Rules</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-[#FE2C55] shrink-0" />
                  <span>Razorpay Instant Automated Invoicing</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={handleRazorpayUpgrade}
                disabled={paying}
                className="w-full bg-[#FE2C55] hover:bg-[#e02447] text-white font-extrabold text-xs py-3 rounded-xl shadow-md hover:shadow-[0_0_15px_rgba(254,44,85,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {isPro ? "Renew PRO Subscription (₹499)" : "Upgrade with Razorpay (₹499)"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History & Receipts Table */}
      <div className="bg-white dark:bg-[#161823] p-6 rounded-3xl border border-slate-200 dark:border-[#2f3142] shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Download className="w-4 h-4 text-[#FE2C55]" />
          Billing Receipts & Payments
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-150 dark:border-[#2f3142] text-[10px] font-extrabold uppercase text-slate-400">
                <th className="pb-3">Invoice ID</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Plan</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Gateway</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#252838]">
              {isPro ? (
                <tr>
                  <td className="py-3 font-mono font-semibold text-slate-700 dark:text-slate-300">INV-RZP-98421</td>
                  <td className="py-3 text-slate-500">{new Date().toLocaleDateString()}</td>
                  <td className="py-3 font-bold text-slate-800 dark:text-slate-200">PRO Monthly</td>
                  <td className="py-3 font-extrabold text-slate-900 dark:text-slate-100">₹499.00</td>
                  <td className="py-3 text-slate-500">Razorpay Test</td>
                  <td className="py-3 text-right">
                    <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      PAID
                    </span>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td className="py-3 font-mono font-semibold text-slate-400">INV-STARTER-001</td>
                  <td className="py-3 text-slate-500">{new Date().toLocaleDateString()}</td>
                  <td className="py-3 font-bold text-slate-500">Free Starter</td>
                  <td className="py-3 text-slate-500">₹0.00</td>
                  <td className="py-3 text-slate-400">System</td>
                  <td className="py-3 text-right">
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      COMPLIMENTARY
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
