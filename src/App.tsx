import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./components/AuthContext.js";
import { ThemeProvider, useTheme } from "./components/ThemeContext.js";
import { SuperAdminDashboard } from "./components/SuperAdminDashboard.js";
import { TenantDashboard } from "./components/TenantDashboard.js";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { PrivacyPage } from "./app/privacy/page.js";
import { TermsPage } from "./app/terms/page.js";
import { ContactPage } from "./app/contact/page.js";
import { 
  Building2, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert,
  Eye,
  EyeOff,
  Sun,
  Moon
} from "lucide-react";

const AuthPortal: React.FC = () => {
  const { user, login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === "SUPER_ADMIN") {
        if (location.pathname === "/" || location.pathname === "") {
          navigate("/superadmin");
        }
      } else {
        if (location.pathname === "/" || location.pathname === "") {
          navigate("/dashboard");
        }
      }
    } else {
      if (
        location.pathname !== "/" &&
        location.pathname !== "/login" &&
        location.pathname !== "/privacy" &&
        location.pathname !== "/terms" &&
        location.pathname !== "/contact"
      ) {
        navigate("/");
      }
    }
  }, [user, location.pathname, navigate]);

  if (location.pathname === "/privacy") {
    return <PrivacyPage />;
  }
  if (location.pathname === "/terms") {
    return <TermsPage />;
  }
  if (location.pathname === "/contact") {
    return <ContactPage />;
  }

  if (user) {
    if (user.role === "SUPER_ADMIN") {
      return <SuperAdminDashboard />;
    }
    return <TenantDashboard />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      let data: any = {};
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || `Login failed (${res.status})`);
      }

      if (!res.ok) {
        throw new Error(data.error || "Login credentials failed.");
      }

      login(data.token, data.user);
      if (data.user.role === "SUPER_ADMIN") {
        navigate("/superadmin");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, shopName, phone })
      });

      let data: any = {};
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || `Registration failed (${res.status})`);
      }

      if (!res.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async (googleEmailInput?: string, googleNameInput?: string) => {
    setError(null);
    setLoading(true);

    try {
      let targetEmail = googleEmailInput || email;
      let targetName = googleNameInput || name;

      if (!targetEmail) {
        const input = window.prompt("Enter your Google Email Address to continue with Google:", "user@gmail.com");
        if (!input) {
          setLoading(false);
          return;
        }
        targetEmail = input.trim();
        targetName = targetEmail.split("@")[0] || "Google User";
      }

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, name: targetName || "Google User" })
      });

      let data: any = {};
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || `Google login failed (${res.status})`);
      }

      if (!res.ok) {
        throw new Error(data.error || "Google authentication failed.");
      }

      login(data.token, data.user);
      if (data.user.role === "SUPER_ADMIN") {
        navigate("/superadmin");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const autofillSuperAdmin = () => {
    setEmail("admin@company.com");
    setPassword("adminpassword");
    setIsRegister(false);
  };

  const autofillTenantAdmin = () => {
    setEmail("owner@smartmart.com");
    setPassword("password123");
    setIsRegister(false);
  };

  return (
    <div className="tt-auth-shell min-h-screen flex items-center justify-center p-4 sm:p-6 font-sans text-slate-800 dark:text-slate-100 antialiased relative overflow-hidden transition-colors duration-300">
      <div className="tt-signal-grid"></div>

      <div className="tt-auth-panel w-full max-w-5xl rounded-3xl overflow-hidden flex flex-col md:flex-row relative z-10 animate-fade-in">
        
        {/* Theme switch button on top corner */}
        <button
          type="button"
          onClick={toggleTheme}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm cursor-pointer"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>
        
        {/* Left column marketing splash */}
        <div className="tt-auth-hero text-white p-12 flex flex-col justify-between md:w-[42%] shrink-0 relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Taqbot Pro Logo" className="tt-brand-mark w-10 h-10 rounded-xl object-cover border border-white/10 shadow-md" />
              <span className="font-extrabold tracking-tight text-xl text-white">Taqbot Pro</span>
            </div>
            
            <h2 className="text-2xl font-extrabold tracking-tight leading-tight pt-6">
              Taqbot Pro CRM & Unified Social Inbox.
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              Connect your TikTok Shop accounts, moderate post commenting with keyword automation rules, and converse using our dual-pane Social Inbox driven by Google Gemini.
            </p>
          </div>

          <div className="space-y-4 pt-12">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Core Capabilities</span>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Dual-role control center (Super vs Tenant)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Real-time human-to-AI chat handover</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Direct checkout invoice generation</span>
                </div>
              </div>
            </div>

            {/* Quick Demo Autofills */}
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 space-y-2.5">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Sandbox Quick Access</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={autofillSuperAdmin}
                  className="bg-slate-800 hover:bg-slate-700 text-[11px] font-bold py-1.5 px-2.5 rounded-lg border border-slate-700 text-slate-200 transition-colors"
                >
                  Super Admin
                </button>
                <button
                  type="button"
                  onClick={autofillTenantAdmin}
                  className="bg-slate-800 hover:bg-slate-700 text-[11px] font-bold py-1.5 px-2.5 rounded-lg border border-slate-700 text-slate-200 transition-colors"
                >
                  Tenant Admin
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column forms */}
        <div className="tt-auth-form flex-1 p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                {isRegister ? "Get Started with Taqbot Pro" : "Sign In to Your Workspace"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isRegister 
                  ? "Launch a brand-new tenant account seeded with premium sample products."
                  : "Enter your supervisor credentials or tenant credentials."}
              </p>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-150 p-4 rounded-xl flex items-start gap-3 text-xs text-rose-700 font-semibold animate-shake">
                <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {!isRegister ? (
              /* LOGIN FORM */
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. owner@smartmart.com"
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                      className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FE2C55] hover:bg-[#e02447] text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md hover:shadow-[0_0_15px_rgba(254,44,85,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Authenticating..." : "Sign In"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Your Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Priyanjali Sen"
                        className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. sen@brand.com"
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Contact Phone</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="e.g. 984534..."
                        className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">TikTok Shop/Brand Name</label>
                    <input
                      type="text"
                      required
                      value={shopName}
                      onChange={e => setShopName(e.target.value)}
                      placeholder="e.g. Factory Vaseegrah Veda"
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                    />
                  </div>

                  <div className="space-y-1 col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                        className="w-full pl-10 pr-10 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FE2C55] hover:bg-[#e02447] text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Creating Organization..." : "Launch CRM Workspace"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Google OAuth Button (Positioned below forms) */}
            <div className="space-y-3 pt-2">
              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute">Or</span>
              </div>

              <button
                type="button"
                onClick={() => handleGoogleAuth()}
                disabled={loading}
                className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 border border-slate-300 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-3 disabled:opacity-50 hover:border-slate-400 cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Switch view text */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setIsRegister(!isRegister);
                }}
                className="text-xs font-bold text-[#25F4EE] hover:underline"
              >
                {isRegister ? "Already registered? Sign in here" : "Need a workspace? Register new brand"}
              </button>
            </div>

            {/* Footer Links */}
            <div className="flex justify-center gap-4 pt-6 border-t border-slate-100 text-[11px] font-bold text-slate-400">
              <Link to="/privacy" className="hover:text-[#25F4EE] transition-colors">Privacy Policy</Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-[#25F4EE] transition-colors">Terms of Service</Link>
              <span>•</span>
              <Link to="/contact" className="hover:text-[#25F4EE] transition-colors">Contact Support</Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthPortal />
      </AuthProvider>
    </ThemeProvider>
  );
}


