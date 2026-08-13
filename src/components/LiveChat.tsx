import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext.js";
import { 
  Send, 
  MessageSquare, 
  Sparkles, 
  User, 
  Check, 
  CheckCheck, 
  Paperclip, 
  Eye, 
  ShoppingBag, 
  UserCheck, 
  Tag, 
  AlertCircle,
  FileSpreadsheet,
  Bot,
  ChevronDown,
  Clock,
  Search
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  tags: string[];
  notes?: string;
  lifetimeValue: number;
}

interface Conversation {
  id: string;
  customerId: string;
  status: "OPEN" | "CLOSED";
  aiEnabled: boolean;
  channel: "TIKTOK" | "WHATSAPP" | "INSTAGRAM";
  lastMessageAt: string;
  unreadCount: number;
  lastMessageText?: string;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  isInternalNote: boolean;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

export const LiveChat: React.FC = () => {
  const { token, user } = useAuth();
  
  // Contacts and states
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [search, setSearch] = useState("");
  
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);
  const [activeListTab, setActiveListTab] = useState<"All Contacts" | "Support Agents">("All Contacts");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load backend collections on start
  const loadInitialData = async () => {
    try {
      const h = { Authorization: `Bearer ${token}` };
      const [resConv, resCust, resProd] = await Promise.all([
        fetch("/api/chat/conversations", { headers: h }),
        fetch("/api/customers", { headers: h }),
        fetch("/api/products", { headers: h })
      ]);

      if (resConv.ok) {
        const convList = await resConv.json();
        setConversations(convList);
        if (convList.length > 0 && !selectedConvId) {
          setSelectedConvId(convList[0].id);
        }
      }
      if (resCust.ok) setCustomers(await resCust.json());
      if (resProd.ok) setProducts(await resProd.json());
    } catch (e) {
      console.error("Failed to fetch backend live chat items:", e);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [token]);

  // Load messages for selected conversation
  const loadMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/chat/messages/${convId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMessages(await res.json());
        // Mark read
        await fetch("/api/chat/mark-read", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ conversationId: convId })
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (selectedConvId) {
      loadMessages(selectedConvId);
      const timer = setInterval(() => loadMessages(selectedConvId), 4000);
      return () => clearInterval(timer);
    }
  }, [selectedConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeConv = conversations.find(c => c.id === selectedConvId);
  const activeCustomer = activeConv ? customers.find(cust => cust.id === activeConv.customerId) : null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedConvId) return;

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          conversationId: selectedConvId,
          text: inputText,
          isInternalNote,
          senderId: user?.userId,
          senderName: user?.name
        })
      });

      if (res.ok) {
        setInputText("");
        setIsInternalNote(false);
        loadMessages(selectedConvId);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleAIEnabled = async (explicitEnabled?: boolean) => {
    if (!selectedConvId || !activeConv) return;
    const targetVal = explicitEnabled !== undefined ? explicitEnabled : !activeConv.aiEnabled;
    
    // Update locally
    const updatedConvs = conversations.map(c => 
      c.id === selectedConvId ? { ...c, aiEnabled: targetVal } : c
    );
    setConversations(updatedConvs);

    // Save to server
    try {
      await fetch("/api/chat/toggle-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          conversationId: selectedConvId,
          enabled: targetVal
        })
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Helper to trigger simulated customer text
  const triggerSimulatedIncoming = async () => {
    if (!selectedConvId || !activeCustomer) return;
    const txt = prompt("Simulate customer sending a message to this channel:", "Is there any organic product?");
    if (!txt) return;

    try {
      await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          conversationId: selectedConvId,
          text: txt,
          isInternalNote: false,
          senderId: "CUSTOMER",
          senderName: activeCustomer.name
        })
      });
      loadMessages(selectedConvId);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredConversations = conversations.filter(c => {
    const cust = customers.find(cust => cust.id === c.customerId);
    return cust?.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden font-sans text-slate-800 animate-fade-in">
      
      {/* 1. Left Contact list Column */}
      <div className="w-80 border-r border-slate-200 flex flex-col justify-between shrink-0 bg-white">
        
        {/* Search header container */}
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-850">Live Chat</h2>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
            />
          </div>

          {/* All Contacts / Support Agents Sub-tabs */}
          <div className="flex rounded-lg border border-slate-200 bg-slate-50/50 p-0.5 text-[10px] font-bold">
            <button
              onClick={() => setActiveListTab("All Contacts")}
              className={`flex-1 py-1 rounded-md text-center transition-all ${
                activeListTab === "All Contacts" ? "bg-white text-slate-850 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All Contacts
            </button>
            <button
              onClick={() => setActiveListTab("Support Agents")}
              className={`flex-1 py-1 rounded-md text-center transition-all ${
                activeListTab === "Support Agents" ? "bg-white text-slate-850 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Support Agents
            </button>
          </div>
        </div>

        {/* Contact List items */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 flex flex-col justify-between">
          <div className="divide-y divide-slate-100">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-semibold">
                No active conversations. Connect TikTok Shop webhook to receive messages.
              </div>
            ) : (
              filteredConversations.map(c => {
                const cust = customers.find(cust => cust.id === c.customerId);
                const isSelected = c.id === selectedConvId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedConvId(c.id)}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                      isSelected ? "bg-indigo-50/50 border-l-4 border-indigo-600 pl-2.5" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden relative">
                      {cust?.avatar ? (
                        <img src={cust.avatar} alt={cust.name} className="w-full h-full object-cover" />
                      ) : (
                        cust?.name.charAt(0).toUpperCase() || "U"
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-800 truncate">{cust?.name || "Customer"}</p>
                        <span className="text-[9px] text-slate-400 font-semibold shrink-0">
                          {c.lastMessageAt || ""}
                        </span>
                      </div>
                      
                      <p className="text-[10px] text-slate-450 truncate">
                        {c.lastMessageText || "No messages yet"}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="p-3 bg-white border-t border-slate-50 flex items-center justify-center">
            <button className="w-full py-1.5 text-[10px] font-bold border border-indigo-200 text-indigo-600 rounded-xl hover:bg-indigo-50/50 transition-colors">
              Load More
            </button>
          </div>
        </div>

      </div>

      {/* 2. Middle Active Conversation Feed Column */}
      <div className="flex-1 flex flex-col justify-between bg-white">
        {activeConv && activeCustomer ? (
          <>
            {/* Conversation Header */}
            <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-150 text-slate-650 flex items-center justify-center font-bold text-xs overflow-hidden border border-slate-200">
                  {activeCustomer.avatar ? (
                    <img src={activeCustomer.avatar} alt={activeCustomer.name} className="w-full h-full object-cover" />
                  ) : (
                    activeCustomer.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800">{activeCustomer.name}</h3>
                  <p className="text-[9px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {activeConv.channel === "TIKTOK" 
                      ? "TikTok Direct Messages" 
                      : activeConv.channel === "WHATSAPP" 
                      ? "WhatsApp Messages" 
                      : "Instagram Direct Messages"}
                  </p>
                </div>
              </div>

              {/* Header Right Action Buttons (Chatbot / Orders) */}
              <div className="flex items-center gap-2">
                {/* 🤖 Chatbot Status Dropdown toggle */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowAgentDropdown(!showAgentDropdown)}
                    className="flex items-center gap-1.5 bg-slate-55 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-700 transition-all shadow-sm"
                  >
                    <Bot className="w-3.5 h-3.5 text-indigo-605" />
                    <span>{activeConv.aiEnabled ? "Chatbot" : "Manual"}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  
                  {showAgentDropdown && (
                    <div className="absolute right-0 mt-1.5 w-32 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-30 animate-fade-in">
                      <button
                        type="button"
                        onClick={async () => {
                          await toggleAIEnabled(true);
                          setShowAgentDropdown(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-[10px] font-bold hover:bg-slate-50 flex items-center gap-1.5 text-slate-700"
                      >
                        <Bot className="w-3.5 h-3.5 text-indigo-605" />
                        Chatbot
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          await toggleAIEnabled(false);
                          setShowAgentDropdown(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-[10px] font-bold hover:bg-slate-50 flex items-center gap-1.5 text-slate-700"
                      >
                        <User className="w-3.5 h-3.5 text-indigo-650" />
                        Manual
                      </button>
                    </div>
                  )}
                </div>

                {/* 👜 Orders Button */}
                <button
                  onClick={() => alert("Orders catalog and details list panel")}
                  className="flex items-center gap-1.5 bg-slate-55 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-700 transition-all shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-slate-500" />
                  <span>Orders</span>
                </button>

                <button
                  type="button"
                  onClick={triggerSimulatedIncoming}
                  className="text-[10px] bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 font-bold text-indigo-600 px-3 py-1.5 rounded-xl transition-all"
                  title="Simulate customer typing message"
                >
                  Simulate Msg
                </button>
              </div>
            </div>

            {/* Message History Feed */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-white">
              <div className="text-center text-slate-400 text-[9px] font-extrabold uppercase tracking-wider my-2">TODAY</div>
              
              {messages.length === 0 ? (
                <div className="text-center text-slate-350 py-8 text-xs font-semibold">No messages in this chat conversation.</div>
              ) : (
                messages.map((m) => {
                  const isCustomer = m.senderId === "CUSTOMER";
                  const isAI = m.senderId === "AI";
                  const isInternal = m.isInternalNote;

                  return (
                    <div
                      key={m.id}
                      className={`flex ${isCustomer ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-md rounded-2xl p-4 shadow-sm border ${
                          isInternal
                            ? "bg-yellow-50 text-yellow-900 border-yellow-200 rounded-tr-none"
                            : isCustomer
                            ? "bg-slate-100 text-slate-800 border-slate-200/60 rounded-tl-none"
                            : isAI
                            ? "bg-indigo-600 text-white border-indigo-550 rounded-tr-none"
                            : "bg-slate-900 text-white border-slate-700 rounded-tr-none"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-6 mb-1 text-[8.5px] font-bold uppercase tracking-wider opacity-65">
                          <span>{m.senderName}</span>
                          <span>
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed whitespace-pre-wrap font-medium">{m.text}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* TikTok Style Message Input Area */}
            <div className="bg-white border-t border-slate-200 p-4">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                {/* Plus / attachment button */}
                <button
                  type="button"
                  className="p-2 text-slate-400 hover:text-slate-650 transition-colors"
                  title="Add attachments"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                
                {/* Rounded typing pill */}
                <div className="flex-1 bg-slate-100 rounded-full px-4 py-2.5 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Send a message..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 bg-transparent focus:outline-none text-sm text-slate-800"
                  />
                  {/* Emoji / Sparkles button */}
                  <button
                    type="button"
                    className="text-slate-400 hover:text-slate-650 transition-colors"
                    title="Add expression"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                  </button>
                </div>

                {/* Send button */}
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className={`p-2.5 rounded-full transition-all flex items-center justify-center ${
                    inputText.trim() 
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm" 
                      : "bg-slate-150 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 p-8">
            <MessageSquare className="w-16 h-16 text-slate-200" />
            <h3 className="text-sm font-bold text-slate-800">No Chat Selected</h3>
            <p className="text-xs text-slate-405">Select a channel conversation from the inbox list to begin chatting.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default LiveChat;
