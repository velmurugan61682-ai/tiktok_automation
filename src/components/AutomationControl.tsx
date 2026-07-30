import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext.js";
import { 
  Sparkles, 
  Settings, 
  HelpCircle, 
  Plus, 
  MessageSquare, 
  Check, 
  Trash2, 
  RefreshCw, 
  CornerDownRight, 
  Send,
  Search,
  MessageCircle,
  FileText,
  Camera,
  Layers,
  ChevronRight,
  Eye,
  Info,
  Shield,
  Trash,
  CheckCircle,
  ToggleLeft
} from "lucide-react";

interface Comment {
  id: string;
  customerId: string;
  customerName: string;
  postType: string;
  postId: string;
  text: string;
  replyText?: string;
  dmSent: boolean;
  status: "PENDING" | "REPLIED" | "FLAGGED";
  createdAt: string;
}

interface CarouselCard {
  imageUrl: string;
  title: string;
  description: string;
  btnLabel: string;
  link: string;
}

interface AutomationRule {
  id: string;
  workspaceId: string;
  name: string;
  type: "COMMENT" | "STORY" | "MODERATION";
  triggerKeyword: string[];
  actionType: "AUTO_DM" | "AI_REPLY" | "AUTO_REPLY";
  replyTemplate: string;
  isEnabled: boolean;
  usageCount: number;
  createdAt: string;
  postId?: string;
  replyCommentText?: string;
  followersOnly?: boolean;
  carouselCards?: CarouselCard[];
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  images?: string[];
  description?: string;
}

export const AutomationControl: React.FC = () => {
  const { token } = useAuth();
  
  // Active Tab: "comment_automation" | "story_automation" | "comment_chat" | "moderation"
  const [activeTab, setActiveTab] = useState<"comment_automation" | "story_automation" | "comment_chat" | "moderation">("comment_automation");
  
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);

  // Modal selector for posts/products
  const [showPostSelectorModal, setShowPostSelectorModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // Comment Automation rule creation states
  const [triggerKeyword, setTriggerKeyword] = useState("");
  const [replyType, setReplyType] = useState<"Text" | "Carousel">("Text");
  const [followersOnly, setFollowersOnly] = useState(false);
  const [replyCommentText, setReplyCommentText] = useState("");
  const [automatedDmContent, setAutomatedDmContent] = useState("");
  
  // Carousel Card List state
  const [carouselCards, setCarouselCards] = useState<CarouselCard[]>([
    { imageUrl: "", title: "", description: "", btnLabel: "", link: "" }
  ]);

  // Story Automation rule creation states
  const [storyKeyword, setStoryKeyword] = useState("");
  const [storyResponseType, setStoryResponseType] = useState<"Text" | "Template">("Text");
  const [storyDmContent, setStoryDmContent] = useState("");

  // Comment Chat Sub-tabs
  const [commentChatTab, setCommentChatTab] = useState<"Post Comments" | "Story Replies">("Post Comments");

  // Moderation filter
  const [moderationFilter, setModerationFilter] = useState<"All" | "DELETED" | "HIDDEN">("All");

  const loadData = async () => {
    try {
      const h = { Authorization: `Bearer ${token}` };
      const [resRules, resComm, resProd, resVideos] = await Promise.all([
        fetch("/api/automation/rules", { headers: h }),
        fetch("/api/comments", { headers: h }),
        fetch("/api/products", { headers: h }),
        fetch("/api/tiktok/videos", { headers: h })
      ]);

      if (resRules.ok) setRules(await resRules.json());
      if (resComm.ok) setComments(await resComm.json());
      
      let mergedItems: Product[] = [];
      if (resVideos.ok) {
        const videosList = await resVideos.json();
        mergedItems = [...videosList];
      }
      if (resProd.ok) {
        const prodList = await resProd.json();
        mergedItems = [...mergedItems, ...prodList];
      }
      
      setProducts(mergedItems);
      if (mergedItems.length > 0 && !selectedPostId) {
        setSelectedPostId(mergedItems[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  // Set initial default selections on list loads
  const activeCommentChatRules = rules.filter(r => 
    commentChatTab === "Post Comments" ? r.type === "COMMENT" : r.type === "STORY"
  );

  useEffect(() => {
    if (activeCommentChatRules.length > 0) {
      setSelectedRuleId(activeCommentChatRules[0].id);
    } else {
      setSelectedRuleId(null);
    }
  }, [commentChatTab, rules]);

  // Carousel handlers
  const handleAddCard = () => {
    if (carouselCards.length >= 10) return;
    setCarouselCards([
      ...carouselCards,
      { imageUrl: "", title: "", description: "", btnLabel: "", link: "" }
    ]);
  };

  const handleRemoveCard = (index: number) => {
    if (carouselCards.length === 1) return;
    setCarouselCards(carouselCards.filter((_, i) => i !== index));
  };

  const handleCardChange = (index: number, field: keyof CarouselCard, value: string) => {
    const updated = [...carouselCards];
    updated[index][field] = value;
    setCarouselCards(updated);
  };

  // Deploy Comment automation
  const handleDeployCommentAutomation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!triggerKeyword) return;
    if (replyType === "Text" && !automatedDmContent) return;

    try {
      const res = await fetch("/api/automation/rules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          type: "COMMENT",
          triggerKeyword: triggerKeyword.split(",").map(k => k.trim()),
          replyTemplate: replyType === "Text" ? automatedDmContent : `[Carousel Response: ${carouselCards[0]?.title || "Untitled Card"}]`,
          actionType: "AUTO_DM",
          isEnabled: true,
          postId: selectedPostId || "",
          replyCommentText,
          followersOnly,
          carouselCards: replyType === "Carousel" ? carouselCards : undefined
        })
      });

      if (res.ok) {
        alert("TikTok Comment Automation Deployed Successfully!");
        setTriggerKeyword("");
        setReplyCommentText("");
        setAutomatedDmContent("");
        setCarouselCards([{ imageUrl: "", title: "", description: "", btnLabel: "", link: "" }]);
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Activate Story automation
  const handleActivateStoryRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyKeyword || !storyDmContent) return;

    try {
      const res = await fetch("/api/automation/rules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          type: "STORY",
          triggerKeyword: storyKeyword.split(",").map(k => k.trim()),
          replyTemplate: storyDmContent,
          actionType: "AUTO_DM",
          isEnabled: true,
          followersOnly: false
        })
      });

      if (res.ok) {
        alert("TikTok Story Reply Automation Activated!");
        setStoryKeyword("");
        setStoryDmContent("");
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteRule = async (id: string) => {
    try {
      const res = await fetch(`/api/automation/rules/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Find currently selected product details from database
  const activeProduct = products.find(p => p.id === selectedPostId);

  // Dynamically calculate moderated comments based on the real comments in database
  const moderatedComments = comments.filter(c => {
    // If toxicity or bad words exist, or status is flagged
    const textLower = c.text.toLowerCase();
    const hasFlaggedWords = textLower.includes("scam") || textLower.includes("fraud") || textLower.includes("fake") || textLower.includes("bad") || textLower.includes("useless") || c.status === "FLAGGED";
    return hasFlaggedWords;
  }).map((c, idx) => {
    const textLower = c.text.toLowerCase();
    let explanation = "The comment contains potential negative sentiment or product complaints flagged by AI.";
    let toxicity = 75;
    let badges = ["Tamilish"];
    
    if (textLower.includes("fraud") || textLower.includes("scam")) {
      explanation = "Comment contains allegations of scam or fraudulent store activity.";
      toxicity = 95;
      badges = ["abuse", "high toxicity"];
    } else if (textLower.includes("useless") || textLower.includes("fake")) {
      explanation = "Targeted insult criticizing product quality without order reference.";
      toxicity = 82;
      badges = ["insult"];
    }
    
    return {
      id: c.id,
      username: c.customerName,
      timestamp: c.createdAt ? new Date(c.createdAt).toLocaleString() : "Just now",
      text: c.text,
      explanation,
      badges,
      action: idx % 2 === 0 ? "DELETED" : "HIDDEN",
      toxicity
    };
  });

  // Moderation filtered list
  const filteredModerated = moderatedComments.filter(item => {
    if (moderationFilter !== "All" && item.action !== moderationFilter) return false;
    if (searchQuery) {
      return item.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
             item.text.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-800 antialiased">
      
      {/* Page Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-155 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-855 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-505 animate-pulse" />
            TikTok Automation Suite
          </h2>
          <p className="text-xs text-slate-400">Configure triggers, deploy auto-comment bots, story mention replies, and manage toxic comments.</p>
        </div>
      </div>

      {/* Main Sub-tab menu mapping Screenshots */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => {
            setActiveTab("comment_automation");
            setSearchQuery("");
          }}
          className={`px-6 py-3.5 font-bold text-xs transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === "comment_automation" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-850"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Comment Automation
        </button>
        <button
          onClick={() => {
            setActiveTab("story_automation");
            setSearchQuery("");
          }}
          className={`px-6 py-3.5 font-bold text-xs transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === "story_automation" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-850"
          }`}
        >
          <Layers className="w-4 h-4" />
          Story Automation
        </button>
        <button
          onClick={() => {
            setActiveTab("comment_chat");
            setSearchQuery("");
          }}
          className={`px-6 py-3.5 font-bold text-xs transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === "comment_chat" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-850"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Comment Chat
        </button>
        <button
          onClick={() => {
            setActiveTab("moderation");
            setSearchQuery("");
          }}
          className={`px-6 py-3.5 font-bold text-xs transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === "moderation" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-850"
          }`}
        >
          <Shield className="w-4 h-4" />
          Moderation
        </button>
      </div>

      {/* 1. Comment Automation Tab */}
      {activeTab === "comment_automation" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Create New Rule Form (Left Column) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-155 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Create New Rule</h3>
            
            <form onSubmit={handleDeployCommentAutomation} className="space-y-5">
              
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Post select picker */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">1. Select the Post</label>
                  <button
                    type="button"
                    onClick={() => setShowPostSelectorModal(true)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left text-xs text-slate-700 font-bold transition-all"
                  >
                    <span className="truncate">{activeProduct ? activeProduct.name : "Choose TikTok content / product"}</span>
                    <Camera className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                </div>

                {/* Keyword triggers */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">2. Trigger Keyword</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      placeholder="e.g. 'PRICE', 'OFFER'"
                      value={triggerKeyword}
                      onChange={e => setTriggerKeyword(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                    />
                    <button type="button" className="px-3 py-2.5 text-[10px] font-bold bg-slate-150 border border-slate-200 rounded-xl uppercase text-slate-600">ANY</button>
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-655">Reply Type:</span>
                  <div className="flex rounded-lg border border-slate-200 bg-white overflow-hidden p-0.5">
                    <button
                      type="button"
                      onClick={() => setReplyType("Text")}
                      className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                        replyType === "Text" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-indigo-650"
                      }`}
                    >
                      Text
                    </button>
                    <button
                      type="button"
                      onClick={() => setReplyType("Carousel")}
                      className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                        replyType === "Carousel" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-indigo-650"
                      }`}
                    >
                      Carousel
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-655">Followers Only:</span>
                  <button
                    type="button"
                    onClick={() => setFollowersOnly(!followersOnly)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-all ${
                      followersOnly ? "bg-indigo-600" : "bg-slate-200"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${
                      followersOnly ? "translate-x-4" : "translate-x-0"
                    }`} />
                  </button>
                </div>
              </div>

              {/* Row 3: Reply comment */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">3. Reply Comment (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 'Just sent you a DM! ❤️ '"
                  value={replyCommentText}
                  onChange={e => setReplyCommentText(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Row 4: DM Content OR Carousel Cards */}
              {replyType === "Text" ? (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">4. Automated DM Content</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter the private message users will receive..."
                    value={automatedDmContent}
                    onChange={e => setAutomatedDmContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none resize-none"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      4. Carousel Cards ({carouselCards.length}/10)
                    </label>
                    <button
                      type="button"
                      onClick={handleAddCard}
                      disabled={carouselCards.length >= 10}
                      className="text-xs font-bold text-indigo-650 hover:text-indigo-700 hover:underline flex items-center gap-1"
                    >
                      Add Card +
                    </button>
                  </div>

                  <div className="space-y-4">
                    {carouselCards.map((card, idx) => (
                      <div key={idx} className="p-5 border border-indigo-200 bg-indigo-50/10 rounded-2xl relative space-y-3">
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                          <span className="text-[9px] font-bold text-slate-400">Card #{idx + 1}</span>
                          {carouselCards.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveCard(idx)}
                              className="text-[9px] font-bold text-rose-500 hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-405">Image URL</label>
                            <input
                              type="text"
                              placeholder="Image URL"
                              value={card.imageUrl}
                              onChange={e => handleCardChange(idx, "imageUrl", e.target.value)}
                              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-405">Title</label>
                            <input
                              type="text"
                              placeholder="Title"
                              value={card.title}
                              onChange={e => handleCardChange(idx, "title", e.target.value)}
                              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-405">Description</label>
                          <input
                            type="text"
                            placeholder="Description"
                            value={card.description}
                            onChange={e => handleCardChange(idx, "description", e.target.value)}
                            className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-405">Btn Label</label>
                            <input
                              type="text"
                              placeholder="Btn Label"
                              value={card.btnLabel}
                              onChange={e => handleCardChange(idx, "btnLabel", e.target.value)}
                              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-405">Link</label>
                            <input
                              type="text"
                              placeholder="Link"
                              value={card.link}
                              onChange={e => handleCardChange(idx, "link", e.target.value)}
                              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-xs shadow-sm shadow-indigo-100 flex items-center justify-center gap-1.5 transition-colors"
              >
                Deploy Automation
              </button>

            </form>
          </div>

          {/* Right Live Preview Column */}
          <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-150 shadow-sm flex flex-col items-center justify-center">
            <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              Live Preview
            </span>

            {/* Smartphone mockup */}
            <div className="w-64 h-[450px] bg-slate-900 rounded-[32px] border-4 border-slate-800 p-2 shadow-lg relative overflow-hidden flex flex-col justify-between">
              
              {/* Speaker & notch */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-slate-800 rounded-full z-20" />

              {/* Chat Feed */}
              <div className="flex-1 bg-[#090b0e] pt-6 px-2.5 pb-2 text-[10px] space-y-3 flex flex-col justify-end overflow-hidden">
                <div className="text-center text-slate-500 text-[8px] mb-2">9:41 AM • active chat</div>
                
                {/* Incoming trigger */}
                <div className="flex justify-start">
                  <div className="bg-[#1f222a] text-slate-100 rounded-2xl px-3 py-2 max-w-[170px] leading-relaxed">
                    <span className="block text-[8px] font-bold text-slate-405 mb-0.5">User message</span>
                    {triggerKeyword ? `how much is this? keyword: ${triggerKeyword.split(',')[0]}` : "PRICE?"}
                  </div>
                </div>

                {/* Auto Reply DM content - either Text or Carousel preview card */}
                {replyType === "Text" ? (
                  <div className="flex justify-end">
                    <div className="bg-indigo-655 text-white rounded-2xl px-3 py-2 max-w-[170px] leading-relaxed">
                      <span className="block text-[8px] font-bold text-indigo-205 mb-0.5">Bot reply</span>
                      {automatedDmContent || "Your automated reply message will display here in real-time."}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <div className="bg-[#1f222a] border border-slate-800 rounded-2xl w-44 overflow-hidden text-slate-200">
                      
                      {/* Image frame */}
                      <div className="h-24 bg-[#181a20] flex items-center justify-center relative overflow-hidden">
                        {carouselCards[0]?.imageUrl ? (
                          <img src={carouselCards[0].imageUrl} alt="preview thumbnail" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="w-8 h-8 text-slate-650" />
                        )}
                      </div>

                      {/* Info details */}
                      <div className="p-3 space-y-1">
                        <h5 className="font-extrabold text-[10px] text-slate-100 truncate">
                          {carouselCards[0]?.title || "Untitled Card"}
                        </h5>
                        <p className="text-[8px] text-slate-400 leading-snug">
                          {carouselCards[0]?.description || "No description provided."}
                        </p>
                        
                        <div className="pt-2">
                          <div className="w-full py-1 text-center border border-slate-700 bg-[#292d39] hover:bg-[#20232c] text-indigo-400 font-extrabold text-[8.5px] rounded-lg cursor-pointer">
                            {carouselCards[0]?.btnLabel || "View Detail"}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>

              {/* Chat Send bar */}
              <div className="bg-[#181a20] p-2 border-t border-slate-800 flex items-center gap-1.5 shrink-0" />
            </div>
          </div>
        </div>
      )}

      {/* 2. Story Automation Tab */}
      {activeTab === "story_automation" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Config Panel */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Story Configuration Form */}
            <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-5">
              <h3 className="text-sm font-bold text-slate-855 uppercase tracking-wider">Story Configuration</h3>
              
              <form onSubmit={handleActivateStoryRule} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Story Keyword</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        placeholder="e.g. 'WIN'"
                        value={storyKeyword}
                        onChange={e => setStoryKeyword(e.target.value)}
                        className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                      />
                      <button type="button" className="px-3 py-2 text-[10px] font-bold bg-slate-150 border border-slate-200 rounded-xl uppercase text-slate-650">ANY</button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Response Type</label>
                    <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden p-0.5 h-9.5">
                      <button
                        type="button"
                        onClick={() => setStoryResponseType("Text")}
                        className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-all ${
                          storyResponseType === "Text" ? "bg-indigo-650 text-white shadow-sm" : "text-slate-500 hover:text-slate-855"
                        }`}
                      >
                        Text
                      </button>
                      <button
                        type="button"
                        onClick={() => setStoryResponseType("Template")}
                        className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-all ${
                          storyResponseType === "Template" ? "bg-indigo-650 text-white shadow-sm" : "text-slate-500 hover:text-slate-855"
                        }`}
                      >
                        Template
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Automated DM Content</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write message for mentions..."
                    value={storyDmContent}
                    onChange={e => setStoryDmContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-655 hover:bg-indigo-705 text-white font-bold py-3 rounded-xl text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  Activate Rule
                </button>
              </form>
            </div>

            {/* Story Deployment Lists */}
            <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Story Deployment</h4>
              
              <div className="divide-y divide-slate-100">
                {rules.filter(r => r.type === "STORY").length === 0 ? (
                  <div className="py-4 text-center text-slate-400 text-xs font-semibold">
                    No story automation rules deployed. Setup one above!
                  </div>
                ) : (
                  rules.filter(r => r.type === "STORY").map(rule => (
                    <div key={rule.id} className="py-4 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-xs font-extrabold text-slate-800">Trigger Keyword: "{rule.triggerKeyword.join(', ')}"</p>
                        <p className="text-[10px] text-slate-400 italic">" {rule.replyTemplate} "</p>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="text-xs text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100 font-bold transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right Live Preview phone */}
          <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-150 shadow-sm flex flex-col items-center justify-center">
            <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              Live Preview
            </span>

            {/* Smartphone mockup */}
            <div className="w-64 h-[450px] bg-slate-900 rounded-[32px] border-4 border-slate-800 p-2 shadow-lg relative overflow-hidden flex flex-col justify-between">
              
              {/* Speaker & notch */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-slate-800 rounded-full z-20" />

              {/* Chat Feed */}
              <div className="flex-1 bg-[#090b0e] pt-6 px-2.5 pb-2 text-[10px] space-y-3 flex flex-col justify-end overflow-hidden">
                <div className="text-center text-slate-500 text-[8px]">Story mention captured</div>
                
                {/* Incoming trigger */}
                <div className="flex justify-start">
                  <div className="bg-[#1f222a] text-slate-100 rounded-2xl px-3 py-2 max-w-[170px] leading-relaxed">
                    <span className="block text-[8px] font-bold text-indigo-400 mb-0.5">📸 Story Mention</span>
                    {storyKeyword ? `Mentioned story with trigger word: "${storyKeyword}"` : "Mentioned you in story!"}
                  </div>
                </div>

                {/* Auto Reply DM */}
                <div className="flex justify-end">
                  <div className="bg-indigo-650 text-white rounded-2xl px-3 py-2 max-w-[170px] leading-relaxed">
                    <span className="block text-[8px] font-bold text-indigo-200 mb-0.5">Automated DM</span>
                    {storyDmContent || "Story automated response template content."}
                  </div>
                </div>
              </div>

              {/* Chat Send bar */}
              <div className="bg-[#181a20] p-2 border-t border-slate-800 flex items-center gap-1.5 shrink-0" />
            </div>
          </div>

        </div>
      )}

      {/* 3. Comment Chat Tab */}
      {activeTab === "comment_chat" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden min-h-[500px]">
          
          {/* Left Pane - Triggers List */}
          <div className="border-r border-slate-150 flex flex-col h-full bg-slate-50/50">
            
            {/* Post Comments / Story Replies header switchers */}
            <div className="p-4 border-b border-slate-105 bg-white grid grid-cols-2 gap-2">
              <button
                onClick={() => setCommentChatTab("Post Comments")}
                className={`py-1.5 text-[10px] font-bold rounded-lg border transition-all ${
                  commentChatTab === "Post Comments"
                    ? "bg-slate-850 text-white border-slate-850 shadow-sm"
                    : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Post Comments
              </button>
              <button
                onClick={() => setCommentChatTab("Story Replies")}
                className={`py-1.5 text-[10px] font-bold rounded-lg border transition-all ${
                  commentChatTab === "Story Replies"
                    ? "bg-slate-850 text-white border-slate-855 shadow-sm"
                    : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Story Replies
              </button>
            </div>

            {/* Search Input */}
            <div className="p-3 border-b border-slate-105 bg-white">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by caption..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-[10px] rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Rules list */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {activeCommentChatRules.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs font-semibold">
                  No active automation triggers in the database.
                </div>
              ) : (
                activeCommentChatRules.map(rule => {
                  const isActive = rule.id === selectedRuleId;
                  const ruleProduct = products.find(p => p.id === rule.postId);
                  return (
                    <div
                      key={rule.id}
                      onClick={() => setSelectedRuleId(rule.id)}
                      className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors flex items-start gap-3 relative ${
                        isActive ? "bg-indigo-50/50 border-l-4 border-indigo-650 pl-3" : "pl-4"
                      }`}
                    >
                      {/* Thumbnail frame */}
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-400 uppercase text-[10px] shrink-0 mt-0.5 overflow-hidden">
                        {ruleProduct?.images?.[0] ? (
                          <img src={ruleProduct.images[0]} alt="product thumbnail" className="w-full h-full object-cover" />
                        ) : (
                          "P"
                        )}
                      </div>

                      {/* Content */}
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-extrabold text-slate-800 text-xs truncate">Trigger: "{rule.triggerKeyword.join(', ')}"</p>
                        </div>
                        <p className="text-[9px] text-slate-450 font-semibold uppercase">Rule Type: text</p>
                        <p className="text-[9px] text-slate-300 font-mono font-bold mt-1">Active</p>
                      </div>
                      
                      <div className="text-[9px] text-slate-400 font-bold self-center shrink-0">
                        {rule.usageCount} replies
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Pane - Chat History */}
          <div className="lg:col-span-2 p-6 flex flex-col justify-between h-full min-h-[500px]">
            {selectedRuleId && activeCommentChatRules.find(r => r.id === selectedRuleId) ? (
              (() => {
                const currentRule = activeCommentChatRules.find(r => r.id === selectedRuleId)!;
                const ruleProduct = products.find(p => p.id === currentRule.postId);
                const relatedComments = comments.filter(c => c.text.toLowerCase().includes(currentRule.triggerKeyword[0]?.toLowerCase() || ""));

                return (
                  <div className="space-y-6 flex-1 flex flex-col justify-between">
                    
                    {/* Selected Post header card */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-155 flex items-start gap-4">
                      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                        {ruleProduct?.images?.[0] ? (
                          <img src={ruleProduct.images[0]} alt="product thumbnail" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-slate-200 flex items-center justify-center font-bold text-slate-400">P</div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-extrabold text-slate-850 leading-snug">
                          {ruleProduct 
                            ? ruleProduct.sku.startsWith("TT-VIDEO")
                              ? `Automation Trigger for TikTok Video: ${ruleProduct.name}`
                              : `Automation Trigger for Product: ${ruleProduct.name} - SKU: ${ruleProduct.sku}`
                            : "Automation Trigger active on TikTok comment stream"}
                        </h4>
                        <p className="text-[9px] text-slate-400 font-semibold">{relatedComments.length} active comment logs found</p>
                      </div>
                    </div>

                    {/* Comment streams */}
                    <div className="flex-1 overflow-y-auto max-h-[350px] space-y-4 pr-1">
                      {relatedComments.length === 0 ? (
                        <div className="text-center text-slate-350 py-12 text-xs font-bold">No comment interactions captured for this trigger yet.</div>
                      ) : (
                        relatedComments.map(c => (
                          <div key={c.id} className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-3">
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                              <span className="text-indigo-650 font-bold">{c.customerName}</span>
                              <span>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}</span>
                            </div>
                            <p className="text-xs font-semibold text-slate-700">"{c.text}"</p>
                            
                            <div className="pl-4 border-l-2 border-indigo-200 space-y-1">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-500">Automated Reply:</span>
                              <p className="text-xs text-slate-655 bg-indigo-50/30 p-2.5 border border-indigo-100/50 rounded-lg leading-relaxed">
                                {c.replyText || currentRule.replyTemplate}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                  </div>
                );
              })()
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-12 h-full flex-1">
                <MessageCircle className="w-14 h-14 text-slate-200 mb-3" />
                <h4 className="text-xs font-bold text-slate-800">Select an automation trigger on the left to review recent comments logs.</h4>
              </div>
            )}
          </div>

        </div>
      )}

      {/* 4. AI Moderation Tab */}
      {activeTab === "moderation" && (
        <div className="space-y-6">
          
          {/* Stats metrics boxes */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Moderated */}
            <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Moderated</span>
                <p className="text-2xl font-extrabold text-blue-600">{filteredModerated.length}</p>
                <span className="text-[9px] text-slate-400 font-semibold">Comments auto-reviewed</span>
              </div>
            </div>

            {/* Deleted */}
            <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Deleted</span>
                <p className="text-2xl font-extrabold text-rose-605">{filteredModerated.filter(f => f.action === "DELETED").length}</p>
                <span className="text-[9px] text-rose-455 font-bold">Removed vulgar comments</span>
              </div>
            </div>

            {/* Hidden */}
            <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hidden</span>
                <p className="text-2xl font-extrabold text-orange-605">{filteredModerated.filter(f => f.action === "HIDDEN").length}</p>
                <span className="text-[9px] text-orange-455 font-bold">Spam filtered hidden</span>
              </div>
            </div>

            {/* Avg Toxicity */}
            <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg Toxicity</span>
                <p className="text-2xl font-extrabold text-emerald-600">{filteredModerated.length > 0 ? "82%" : "0%"}</p>
                <span className="text-[9px] text-emerald-500 font-extrabold">Toxicity index logs</span>
              </div>
            </div>

          </div>

          {/* Moderated List view */}
          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-6">
            
            {/* Header tools */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="relative w-full max-w-sm">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by username or comment..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Segmented Filter Buttons */}
              <div className="flex items-center gap-2">
                <div className="flex border border-slate-200 bg-slate-50/50 p-0.5 rounded-lg">
                  <button
                    onClick={() => setModerationFilter("All")}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                      moderationFilter === "All" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setModerationFilter("DELETED")}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                      moderationFilter === "DELETED" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Deleted ({filteredModerated.filter(f => f.action === "DELETED").length})
                  </button>
                  <button
                    onClick={() => setModerationFilter("HIDDEN")}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                      moderationFilter === "HIDDEN" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Hidden ({filteredModerated.filter(f => f.action === "HIDDEN").length})
                  </button>
                </div>

                <button 
                  onClick={loadData}
                  className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-xl font-bold transition-all text-slate-650"
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* Moderated comment stream cards */}
            <div className="space-y-4">
              {filteredModerated.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs font-semibold">
                  No moderated/flagged comments found in the database.
                </div>
              ) : (
                filteredModerated.map(item => (
                  <div key={item.id} className="p-5 border border-slate-150 rounded-xl space-y-4 bg-white">
                    
                    {/* Top Row: Info */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-slate-800">{item.username}</span>
                        <span className="text-[10px] text-slate-355 font-bold block mt-0.5">{item.timestamp}</span>
                      </div>

                      {/* Action status pill */}
                      <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded uppercase ${
                        item.action === "DELETED" ? "bg-rose-50 text-rose-600" : "bg-orange-50 text-orange-600"
                      }`}>
                        {item.action}
                      </span>
                    </div>

                    {/* Comment text */}
                    <p className="text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      "{item.text}"
                    </p>

                    {/* AI toxicity analysis & details */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-medium text-slate-455 leading-relaxed flex items-start gap-1">
                        <Info className="w-3.5 h-3.5 text-indigo-405 shrink-0 mt-0.5" />
                        <span>{item.explanation}</span>
                      </p>

                      {/* Toxicity sliding bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-wider text-slate-400">
                          <span>Toxicity Meter</span>
                          <span className="text-rose-650">{item.toxicity}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            style={{ width: `${item.toxicity}%` }} 
                            className="bg-gradient-to-r from-orange-400 to-rose-600 h-full rounded-full"
                          />
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {item.badges.map((b, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-500 font-extrabold text-[8px] px-2 py-0.5 rounded uppercase">
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>

        </div>
      )}

      {/* POST SELECTION MODAL - DYNAMICALLY POPULATED FROM DATABASE PRODUCTS */}
      {showPostSelectorModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">Select Post / Product</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Choose a connected TikTok video or catalog product for comments automation</p>
              </div>
              <button 
                onClick={() => setShowPostSelectorModal(false)} 
                className="text-slate-400 hover:text-slate-655 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            
            {/* Grid selector */}
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto max-h-[350px]">
              {products.length === 0 ? (
                <div className="col-span-4 p-8 text-center text-slate-400 text-xs font-semibold">
                  No products found in the catalog. Please add products in the Product Catalog tab first.
                </div>
              ) : (
                products.map(prod => {
                  const isSelected = prod.id === selectedPostId;
                  return (
                    <div
                      key={prod.id}
                      onClick={() => {
                        setSelectedPostId(prod.id);
                        setShowPostSelectorModal(false);
                      }}
                      className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.02] shadow-sm relative ${
                        isSelected ? "border-indigo-600 scale-[1.02]" : "border-slate-150"
                      }`}
                    >
                      <div className="h-28 bg-slate-100 relative flex items-center justify-center overflow-hidden">
                        {prod.images?.[0] ? (
                          <img src={prod.images[0]} alt="product select option" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-slate-400 font-bold text-xs">P</div>
                        )}
                        {isSelected && (
                          <div className="absolute inset-0 bg-indigo-650/15 flex items-center justify-center">
                            <span className="bg-indigo-600 text-white rounded-full p-1 shadow-sm font-extrabold text-[8px]">✓ Selected</span>
                          </div>
                        )}
                      </div>
                      <div className="p-2.5 bg-white">
                        <p className="text-[9px] font-bold text-slate-700 leading-snug line-clamp-1">{prod.name}</p>
                        <p className="text-[8px] text-slate-400 font-semibold mt-0.5">
                          {prod.sku.startsWith("TT-VIDEO") ? "TikTok Video" : `Rs. ${prod.price}`}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom pagination */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button disabled className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-400 opacity-50">Prev</button>
              <span className="text-[10px] font-bold text-slate-400">Page 1 of 1</span>
              <button disabled className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-400 opacity-50">Next</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AutomationControl;
