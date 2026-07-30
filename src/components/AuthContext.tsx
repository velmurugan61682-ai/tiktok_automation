import React, { createContext, useContext, useState, useEffect } from "react";

interface UserPayload {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN";
  workspaceId?: string;
  isImpersonated?: boolean;
}

interface AuthContextType {
  token: string | null;
  user: UserPayload | null;
  superAdminToken: string | null; // Keeps original token during impersonation
  login: (token: string, user: UserPayload) => void;
  logout: () => void;
  impersonate: (token: string, workspaceName: string) => void;
  exitImpersonation: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserPayload | null>(null);
  const [superAdminToken, setSuperAdminToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("saas_token");
    const savedUser = localStorage.getItem("saas_user");
    const savedSuperToken = localStorage.getItem("saas_super_token");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    if (savedSuperToken) {
      setSuperAdminToken(savedSuperToken);
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: UserPayload) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("saas_token", newToken);
    localStorage.setItem("saas_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setSuperAdminToken(null);
    localStorage.removeItem("saas_token");
    localStorage.removeItem("saas_user");
    localStorage.removeItem("saas_super_token");
  };

  const impersonate = (impersonateToken: string, workspaceName: string) => {
    if (user && user.role === "SUPER_ADMIN" && token) {
      // Save original Super Admin token
      setSuperAdminToken(token);
      localStorage.setItem("saas_super_token", token);
    }

    const impersonatedUser: UserPayload = {
      id: "super-admin-impersonator",
      name: `Impersonated (${workspaceName})`,
      email: user?.email || "admin@company.com",
      role: "ADMIN",
      workspaceId: "placeholder", // will be verified by server
      isImpersonated: true
    };

    setToken(impersonateToken);
    setUser(impersonatedUser);
    localStorage.setItem("saas_token", impersonateToken);
    localStorage.setItem("saas_user", JSON.stringify(impersonatedUser));
  };

  const exitImpersonation = () => {
    if (superAdminToken) {
      const originalUser: UserPayload = {
        id: "super-admin",
        name: "System Administrator",
        email: "admin@company.com",
        role: "SUPER_ADMIN"
      };

      setToken(superAdminToken);
      setUser(originalUser);
      setSuperAdminToken(null);
      localStorage.setItem("saas_token", superAdminToken);
      localStorage.setItem("saas_user", JSON.stringify(originalUser));
      localStorage.removeItem("saas_super_token");
    } else {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        superAdminToken,
        login,
        logout,
        impersonate,
        exitImpersonation,
        loading
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
