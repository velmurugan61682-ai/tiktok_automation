import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext.js";
import { 
  Bell, 
  CheckCheck, 
  ShoppingBag, 
  AlertTriangle, 
  Info, 
  Sparkles, 
  Trash2, 
  X, 
  Clock, 
  CheckCircle2, 
  ShieldAlert,
  RefreshCw
} from "lucide-react";

export interface NotificationItem {
  id: string;
  workspaceId?: string;
  title: string;
  message: string;
  read: boolean;
  type: "INFO" | "WARNING" | "CRITICAL";
  createdAt: string;
}

export const NotificationBell: React.FC = () => {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "WARNING">("ALL");
  const [loading, setLoading] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error("Failed to load notifications:", e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Live polling every 8 seconds for new live notifications
    const interval = setInterval(fetchNotifications, 8000);
    return () => clearInterval(interval);
  }, [token]);

  // Click outside listener to close popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications/read-all", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkOneRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDeleteNotif = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === "UNREAD") return !n.read;
    if (filter === "WARNING") return n.type === "WARNING" || n.type === "CRITICAL";
    return true;
  });

  const getIconForType = (title: string, type: string) => {
    const t = title.toLowerCase();
    if (t.includes("order") || t.includes("checkout")) {
      return <ShoppingBag className="w-4 h-4 text-indigo-500 shrink-0" />;
    }
    if (t.includes("stock") || type === "WARNING") {
      return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
    }
    if (type === "CRITICAL") {
      return <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />;
    }
    if (t.includes("ai") || t.includes("auto")) {
      return <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />;
    }
    return <Info className="w-4 h-4 text-blue-500 shrink-0" />;
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString();
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-[#252838] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#32364c] transition-all border border-slate-200 dark:border-[#383b52] shadow-2xs cursor-pointer flex items-center justify-center group"
        title="Live Notifications"
      >
        <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FE2C55] text-[9px] font-extrabold text-white shadow-sm ring-2 ring-white dark:ring-[#121212] animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-[#161823] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#2f3142] z-50 overflow-hidden animate-fade-in transition-all">
          {/* Popover Header */}
          <div className="p-4 border-b border-slate-150 dark:border-[#2f3142] flex items-center justify-between bg-slate-50/50 dark:bg-[#1e202e]">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-[#FE2C55]/15 text-[#FE2C55] dark:text-[#FE2C55] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#FE2C55]/30">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  disabled={loading}
                  className="text-[11px] font-bold text-[#FE2C55] hover:underline flex items-center gap-1 cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-[#252838]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-4 py-2 border-b border-slate-100 dark:border-[#2f3142] flex items-center gap-2 text-[11px] font-bold bg-slate-50/30 dark:bg-[#191b28]">
            <button
              type="button"
              onClick={() => setFilter("ALL")}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filter === "ALL"
                  ? "bg-[#FE2C55] text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-[#252838]"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("UNREAD")}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filter === "UNREAD"
                  ? "bg-[#FE2C55] text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-[#252838]"
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter("WARNING")}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filter === "WARNING"
                  ? "bg-[#FE2C55] text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-[#252838]"
              }`}
            >
              Alerts
            </button>
          </div>

          {/* Notification List Content */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto opacity-80" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">You're all caught up!</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">No new notifications in this category.</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkOneRead(notif.id)}
                  className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer relative group ${
                    !notif.read ? "bg-indigo-50/40 dark:bg-indigo-950/20" : ""
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5 border border-slate-200/60 dark:border-slate-700/60">
                    {getIconForType(notif.title, notif.type)}
                  </div>

                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className={`text-xs truncate ${!notif.read ? "font-extrabold text-slate-900 dark:text-slate-100" : "font-semibold text-slate-700 dark:text-slate-300"}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug line-clamp-2">
                      {notif.message}
                    </p>
                  </div>

                  {/* Unread indicator dot */}
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0 mt-1.5" />
                  )}

                  {/* Delete button on hover */}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteNotif(notif.id, e)}
                    className="absolute right-2 top-2 p-1 rounded-lg text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Dismiss"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Popover Footer */}
          <div className="p-3 border-t border-slate-150 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90 flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              <span>Live Notification Gateway Active</span>
            </div>

            <button 
              type="button"
              onClick={fetchNotifications}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Sync
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
