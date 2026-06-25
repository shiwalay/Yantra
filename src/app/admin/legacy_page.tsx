"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Building, 
  Activity, 
  Settings, 
  Database, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Play, 
  Terminal, 
  ShieldAlert, 
  Users, 
  IndianRupee, 
  Search,
  Zap,
  Power,
  RotateCcw,
  ArrowRight,
  Lock,
  Key,
  Mail,
  MessageSquare,
  Layers,
  ShieldCheck,
  HelpCircle,
  Check,
  Trash2,
  Eye,
  Send,
  Share2,
  DollarSign,
  Award,
  Bell,
  Fingerprint,
  TrendingUp,
  FileText,
  Sliders,
  Sparkles,
  Globe,
  Image as ImageIcon,
  BarChart3,
  Megaphone,
  Link2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";

// RBAC Configuration
type Role = "superadmin" | "admin" | "pm" | "marketing" | "support" | "finance" | "prompt_engineer" | "developer" | "analyst";

interface RoleConfig {
  name: string;
  allowedTabs: string[];
}

const rolePermissions: Record<Role, RoleConfig> = {
  superadmin: { name: "Super Admin", allowedTabs: ["executive", "users", "billing", "workspaces", "ai_engines", "prompts", "frameworks", "research", "seo", "thumbnails", "analytics", "apis", "credits", "moderation", "notifications", "marketing", "affiliates", "support", "audit_logs", "security", "settings", "developer", "executive_ai"] },
  admin: { name: "Admin", allowedTabs: ["users", "billing", "moderation", "notifications", "support", "audit_logs"] },
  pm: { name: "Product Manager", allowedTabs: ["frameworks", "prompts", "settings", "analytics", "executive_ai"] },
  marketing: { name: "Marketing Manager", allowedTabs: ["notifications", "marketing", "affiliates", "analytics"] },
  support: { name: "Support Manager", allowedTabs: ["users", "support", "moderation"] },
  finance: { name: "Finance Manager", allowedTabs: ["executive", "billing", "affiliates"] },
  prompt_engineer: { name: "AI Prompt Engineer", allowedTabs: ["prompts", "ai_engines", "frameworks"] },
  developer: { name: "Developer", allowedTabs: ["apis", "developer", "settings", "audit_logs", "security"] },
  analyst: { name: "Analyst", allowedTabs: ["executive", "analytics", "executive_ai"] }
};

// Log structure
interface AuditLog {
  id: number;
  time: string;
  user: string;
  action: string;
  details: string;
}

export default function SuperadminOS() {
  const [activeRole, setActiveRole] = useState<Role>("superadmin");
  const [activeTab, setActiveTab] = useState<string>("executive");
  const [searchQuery, setSearchQuery] = useState("");
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "[SYSTEM] AI Growth OS Control Center initiated.",
    "[POSTGRES] Connected pool to db-prod-primary (1,240 active connections)",
    "[CLICKHOUSE] Syncing 140 view metrics from YouTube Analytics buffer...",
    "[REDIS] BullMQ queue 'video-processing' connected: 24 jobs active",
    "[TYPESENSE] Syncing index: 8,420 search document entries (12ms latency)"
  ]);

  // Operational toggles
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [bypassRateLimit, setBypassRateLimit] = useState(true);
  const [defaultAiModel, setDefaultAiModel] = useState("gemini-1.5-pro");
  const [promptText, setPromptText] = useState("Generate a 12-minute script deconstructing topic [TOPIC] using [FRAMEWORK] with an analytical voice.");
  const [editingFrameworkId, setEditingFrameworkId] = useState<number | null>(null);

  // Users Mock State
  const [usersList, setUsersList] = useState([
    { id: 1, name: "Swapnil B.", email: "swapnil@gmail.com", country: "India", plan: "Growth Pro", credits: 418, status: "Active", device: "MacBook Pro" },
    { id: 2, name: "Jessica K.", email: "jessica@growthlab.io", country: "USA", plan: "Agency & Scale", credits: 5000, status: "Active", device: "iPad Pro" },
    { id: 3, name: "Marcus A.", email: "marcus@vloghub.de", country: "Germany", plan: "Creator Starter", credits: 4, status: "Active", device: "Windows Desktop" },
    { id: 4, name: "David L.", email: "david@spamtest.net", country: "China", plan: "Free Tier", credits: 0, status: "Suspended", device: "iPhone 15" }
  ]);

  // Tickets Mock State
  const [ticketsList, setTicketsList] = useState([
    { id: 101, user: "Marcus A.", subject: "Failed payment check", status: "Open", date: "Today" },
    { id: 102, user: "Swapnil B.", subject: "YouTube OAuth disconnect warning", status: "In Progress", date: "Yesterday" }
  ]);

  // Prompt History
  const [promptVersion, setPromptVersion] = useState("v2.4.1");
  const [promptHistory, setPromptHistory] = useState([
    { version: "v2.4.1", date: "2026-06-25", author: "Prompt Eng", text: "Generate a 12-minute script deconstructing topic [TOPIC] using [FRAMEWORK] with an analytical voice." },
    { version: "v2.4.0", date: "2026-06-18", author: "Super Admin", text: "Create a standard video draft about [TOPIC]." }
  ]);

  // Enterprise Tech Stack Configuration Monitor
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: "Supabase Platform URL", value: process.env.NEXT_PUBLIC_SUPABASE_URL || "Missing in .env.local", status: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Active" : "Pending", rateLimit: "Unlimited" },
    { id: 2, name: "Razorpay Production Key", value: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "Missing in .env.local", status: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? "Active" : "Pending", rateLimit: "100 req/sec" },
    { id: 3, name: "OpenAI Engine", value: "sk-proj-********", status: "Active", rateLimit: "10,000 req/min" },
    { id: 4, name: "Gemini Engine", value: "AIzaSyC0********", status: "Active", rateLimit: "Unlimited" },
    { id: 5, name: "PostHog Analytics Key", value: process.env.NEXT_PUBLIC_POSTHOG_KEY || "Missing in .env.local", status: process.env.NEXT_PUBLIC_POSTHOG_KEY ? "Active" : "Pending", rateLimit: "Unlimited" },
    { id: 6, name: "Sentry Monitoring DSN", value: process.env.NEXT_PUBLIC_SENTRY_DSN || "Missing in .env.local", status: process.env.NEXT_PUBLIC_SENTRY_DSN ? "Active" : "Pending", rateLimit: "Unlimited" },
    { id: 7, name: "MS Clarity Tracking ID", value: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "Missing in .env.local", status: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ? "Active" : "Pending", rateLimit: "Unlimited" }
  ]);

  // Audit Logs database
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: 1, time: "01:30:12", user: "Super Admin", action: "API_ROTATED", details: "Rotated OpenAI Production Key" },
    { id: 2, time: "01:25:40", user: "Product Manager", action: "PROMPT_EDITED", details: "Updated script template generator v2.4.1" },
    { id: 3, time: "01:10:05", user: "Support Manager", action: "USER_IMPERSONATED", details: "Impersonated Swapnil B. to debug billing" }
  ]);

  // Executive Charts Data
  const revenueChartData = [
    { month: "Jan", revenue: 84000 },
    { month: "Feb", revenue: 98000 },
    { month: "Mar", revenue: 145000 },
    { month: "Apr", revenue: 210000 },
    { month: "May", revenue: 320000 },
    { month: "Jun", revenue: 428000 }
  ];

  const modelMetricsData = [
    { name: "OpenAI", requests: 12400, cost: 120, latency: 620 },
    { name: "Gemini", requests: 28400, cost: 42, latency: 450 },
    { name: "Claude", requests: 8400, cost: 95, latency: 710 },
    { name: "DeepSeek", requests: 18000, cost: 12, latency: 850 }
  ];

  // Broadcast parameters
  const [broadcastTarget, setBroadcastTarget] = useState("all");
  const [broadcastText, setBroadcastText] = useState("");
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Credit Adjustment parameters
  const [selectedUserForCredits, setSelectedUserForCredits] = useState<number>(1);
  const [creditsAmountToAdd, setCreditsAmountToAdd] = useState<number>(100);

  // Impersonating Notice
  const [impersonatingUser, setImpersonatingUser] = useState<string | null>(null);

  // Active role permissions filter
  const isTabAllowed = (tab: string) => {
    return rolePermissions[activeRole].allowedTabs.includes(tab);
  };

  // Adjust active tab if role changes and tab becomes forbidden
  useEffect(() => {
    if (!isTabAllowed(activeTab)) {
      // Find first allowed tab
      const allowed = rolePermissions[activeRole].allowedTabs;
      if (allowed.length > 0) setActiveTab(allowed[0]);
    }
  }, [activeRole]);

  // Terminal Simulator
  useEffect(() => {
    const logsPool = [
      "[CLICKHOUSE] Syncing view metrics (1,450 records processed successfully)",
      "[BULLMQ] Completed background script-render job 'job_924a'",
      "[REDIS] Cache hit rate: 98.4% (84k queries parsed)",
      "[STRIPE] Webhook: Payment captured for invoice_482b (Growth Pro)",
      "[APIFY] Scrape sequence finished on channel competitor 'TechLab'",
      "[CONTENT_MODERATION] Scanned draft script #102: Pass (No violations)",
      "[SECURITY] Session validated for Super Admin on IP 192.168.1.14"
    ];
    const interval = setInterval(() => {
      const randomLog = logsPool[Math.floor(Math.random() * logsPool.length)];
      const ts = new Date().toLocaleTimeString();
      setConsoleLogs((prev) => [...prev, `[${ts}] ${randomLog}`]);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleUpdatePrompt = () => {
    const timestamp = new Date().toLocaleTimeString();
    setPromptVersion("v2.4.2");
    setPromptHistory((prev) => [
      { version: "v2.4.2", date: "Today", author: "Prompt Eng", text: promptText },
      ...prev
    ]);
    setAuditLogs((prev) => [
      { id: Date.now(), time: timestamp, user: rolePermissions[activeRole].name, action: "PROMPT_EDITED", details: "Updated script builder to v2.4.2" },
      ...prev
    ]);
    setConsoleLogs((prev) => [...prev, `[${timestamp}] [SYSTEM] Prompt version updated to v2.4.2.`]);
  };

  const handleRotateKey = (id: number) => {
    const newKeyValue = "sk-proj-" + Math.random().toString(36).substring(2, 10) + "...rotated";
    setApiKeys((prev) => prev.map((k) => k.id === id ? { ...k, value: newKeyValue } : k));
    const ts = new Date().toLocaleTimeString();
    setAuditLogs((prev) => [
      { id: Date.now(), time: ts, user: rolePermissions[activeRole].name, action: "API_ROTATED", details: `Rotated key for ${apiKeys.find(k => k.id === id)?.name}` },
      ...prev
    ]);
    setConsoleLogs((prev) => [...prev, `[${ts}] [SECURITY] Rotated API Key ID ${id}`]);
  };

  const handleModifyCredits = (action: "add" | "remove") => {
    setUsersList((prev) => 
      prev.map((u) => {
        if (u.id === selectedUserForCredits) {
          const mod = action === "add" ? creditsAmountToAdd : -creditsAmountToAdd;
          return { ...u, credits: Math.max(0, u.credits + mod) };
        }
        return u;
      })
    );
    const ts = new Date().toLocaleTimeString();
    const userName = usersList.find(u => u.id === selectedUserForCredits)?.name || "User";
    setAuditLogs((prev) => [
      { id: Date.now(), time: ts, user: rolePermissions[activeRole].name, action: "CREDITS_MODIFIED", details: `${action === "add" ? "Added" : "Removed"} ${creditsAmountToAdd} credits to ${userName}` },
      ...prev
    ]);
    setConsoleLogs((prev) => [...prev, `[${ts}] [ADMIN] Manually adjusted credits for ${userName} (${action})`]);
  };

  const handleBroadcast = () => {
    setBroadcastSuccess(true);
    setBroadcastText("");
    setTimeout(() => setBroadcastSuccess(false), 2000);
    const ts = new Date().toLocaleTimeString();
    setConsoleLogs((prev) => [...prev, `[${ts}] [NOTIFICATION] Sent broadcast notification to group: ${broadcastTarget}`]);
  };

  // SEO Engine configuration state
  const [seoTitleTemplate, setSeoTitleTemplate] = useState("How I [ACTION] in [TIME] (And Why It [BENEFIT])");
  const [seoCharacterLimit, setSeoCharacterLimit] = useState(70);

  // Thumbnail Engine configuration state
  const [selectedFont, setSelectedFont] = useState("Impact Bold");
  const [aiStylePrompt, setAiStylePrompt] = useState("Vibrant cyberpunk style, volumetric lighting, photorealistic expression");

  // Marketing campaigns state
  const [marketingCampaigns, setMarketingCampaigns] = useState([
    { id: 1, name: "Summer Creator Sale", coupon: "SUMMER50", discount: "50%", conversions: 124 },
    { id: 2, name: "Agency Referral Booster", coupon: "AGENCY25", discount: "25%", conversions: 42 }
  ]);
  const [newCampaignName, setNewCampaignName] = useState("");
  const [newCampaignCoupon, setNewCampaignCoupon] = useState("");

  // Affiliates state
  const [affiliatePartners, setAffiliatePartners] = useState([
    { id: 1, name: "Amit Sharma", signups: 148, paidUsers: 34, pendingPayout: 42000, status: "Pending" },
    { id: 2, name: "Sarah Connor", signups: 89, paidUsers: 18, pendingPayout: 0, status: "Paid" }
  ]);

  // Retention Data
  const retentionChartData = [
    { time: "0:00", retention: 100 },
    { time: "0:30", retention: 78 },
    { time: "1:00", retention: 69 },
    { time: "2:00", retention: 64 },
    { time: "3:00", retention: 58 },
    { time: "4:00", retention: 55 },
    { time: "5:00", retention: 51 }
  ];

  const handleFlushCache = () => {
    const ts = new Date().toLocaleTimeString();
    setConsoleLogs((prev) => [...prev, `[${ts}] [SYSTEM] Flushed Redis Cache memory successfully.`]);
    setAuditLogs((prev) => [
      { id: Date.now(), time: ts, user: rolePermissions[activeRole].name, action: "CACHE_FLUSHED", details: "Flushed background queue cache" },
      ...prev
    ]);
  };

  const handleSaveSeoRules = () => {
    const ts = new Date().toLocaleTimeString();
    setConsoleLogs((prev) => [...prev, `[${ts}] [SEO] Updated SEO Title rules & character limit.`]);
    setAuditLogs((prev) => [
      { id: Date.now(), time: ts, user: rolePermissions[activeRole].name, action: "SEO_RULES_EDITED", details: "Saved title templates and character weights" },
      ...prev
    ]);
  };

  const handleUpdateThumbnailRules = () => {
    const ts = new Date().toLocaleTimeString();
    setConsoleLogs((prev) => [...prev, `[${ts}] [THUMBNAIL] Updated default thumbnail fonts & AI Style prompts.`]);
    setAuditLogs((prev) => [
      { id: Date.now(), time: ts, user: rolePermissions[activeRole].name, action: "THUMBNAIL_STYLES_EDITED", details: `Updated font to ${selectedFont}` },
      ...prev
    ]);
  };

  const handleSaveCampaign = () => {
    if (!newCampaignName || !newCampaignCoupon) return;
    const ts = new Date().toLocaleTimeString();
    const newCamp = {
      id: Date.now(),
      name: newCampaignName,
      coupon: newCampaignCoupon,
      discount: "20%",
      conversions: 0
    };
    setMarketingCampaigns((prev) => [...prev, newCamp]);
    setNewCampaignName("");
    setNewCampaignCoupon("");
    setConsoleLogs((prev) => [...prev, `[${ts}] [MARKETING] Created new campaign: ${newCampaignName}`]);
  };

  const handleApprovePayout = (id: number) => {
    setAffiliatePartners((prev) => 
      prev.map((aff) => aff.id === id ? { ...aff, pendingPayout: 0, status: "Paid" } : aff)
    );
    const ts = new Date().toLocaleTimeString();
    const name = affiliatePartners.find(aff => aff.id === id)?.name || "Partner";
    setConsoleLogs((prev) => [...prev, `[${ts}] [AFFILIATE] Approved commission payout to ${name}`]);
    setAuditLogs((prev) => [
      { id: Date.now(), time: ts, user: rolePermissions[activeRole].name, action: "PAYOUT_APPROVED", details: `Approved payout to ${name}` },
      ...prev
    ]);
  };

  const handleCloseTicket = (id: number) => {
    setTicketsList((prev) => 
      prev.map((t) => t.id === id ? { ...t, status: "Resolved" } : t)
    );
    const ts = new Date().toLocaleTimeString();
    setConsoleLogs((prev) => [...prev, `[${ts}] [SUPPORT] Resolved ticket ID ${id}`]);
  };

  return (
    <div className="min-h-screen bg-[#050507] text-[#ebebec] flex font-sans overflow-hidden">
      
      {/* Background designs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary glow-orb opacity-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600 glow-orb opacity-5 pointer-events-none" />
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-25" />

      {/* Impersonation Banner */}
      {impersonatingUser && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-black py-1.5 text-center text-xs font-bold flex justify-center items-center gap-4">
          <span>⚠️ Currently Impersonating: {impersonatingUser} (Debug Mode)</span>
          <button 
            onClick={() => setImpersonatingUser(null)}
            className="px-2.5 py-0.5 rounded bg-black text-amber-500 text-[10px] font-bold"
          >
            Exit Impersonation
          </button>
        </div>
      )}

      {/* Admin Sidebar */}
      <aside className="w-64 glass-panel border-r border-white/15 flex flex-col justify-between shrink-0 h-screen overflow-y-auto">
        <div className="p-4 space-y-6">
          
          {/* Logo / Header */}
          <div className="flex items-center gap-2 px-1">
            <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]">
              <ShieldAlert size={16} />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-wide">Yantra Control</span>
              <span className="text-[9px] uppercase font-black text-red-500 block">Super Admin OS</span>
            </div>
          </div>

          {/* RBAC Selector dropdown */}
          <div className="space-y-1">
            <label className="text-[8px] uppercase font-black text-muted-foreground block px-1">Access Role Simulator</label>
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value as Role)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white font-bold"
            >
              {Object.entries(rolePermissions).map(([key, value]) => (
                <option key={key} value={key}>{value.name}</option>
              ))}
            </select>
          </div>
          {/* Navigation Tab links */}
          <nav className="space-y-0.5 text-xs font-medium text-muted-foreground pb-6">
            
            <div className="text-[8px] uppercase font-black tracking-widest text-muted-foreground px-2 py-1 mb-1">
              General Overview
            </div>
            {[
              { id: "executive", label: "Executive Dashboard", icon: Building },
              { id: "users", label: "User Management", icon: Users },
              { id: "billing", label: "Subscription Billing", icon: IndianRupee },
              { id: "workspaces", label: "Workspace Manager", icon: Layers }
            ].map((tab) => {
              const Icon = tab.icon;
              const allowed = isTabAllowed(tab.id);
              if (!allowed) return null;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all ${
                    activeTab === tab.id 
                      ? "text-white bg-white/5 border border-white/5 font-bold" 
                      : "hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Icon size={14} className={activeTab === tab.id ? "text-primary" : ""} />
                  {tab.label}
                </button>
              );
            })}

            <div className="text-[8px] uppercase font-black tracking-widest text-muted-foreground px-2 py-1 pt-3 mb-1">
              AI & Content Engines
            </div>
            {[
              { id: "ai_engines", label: "AI Engine Dashboard", icon: Zap },
              { id: "prompts", label: "Prompt Management", icon: FileText },
              { id: "frameworks", label: "Framework Library", icon: Sliders },
              { id: "research", label: "Research Database", icon: Search },
              { id: "seo", label: "SEO Library", icon: Globe },
              { id: "thumbnails", label: "Thumbnail Library", icon: ImageIcon },
              { id: "analytics", label: "Analytics Dashboard", icon: BarChart3 }
            ].map((tab) => {
              const Icon = tab.icon;
              const allowed = isTabAllowed(tab.id);
              if (!allowed) return null;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all ${
                    activeTab === tab.id 
                      ? "text-white bg-white/5 border border-white/5 font-bold" 
                      : "hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Icon size={14} className={activeTab === tab.id ? "text-primary" : ""} />
                  {tab.label}
                </button>
              );
            })}

            <div className="text-[8px] uppercase font-black tracking-widest text-muted-foreground px-2 py-1 pt-3 mb-1">
              Operations & Systems
            </div>
            {[
              { id: "apis", label: "API Management", icon: Key },
              { id: "credits", label: "Credit Management", icon: RotateCcw },
              { id: "moderation", label: "Content Moderation", icon: AlertTriangle },
              { id: "notifications", label: "Notification Center", icon: Bell },
              { id: "marketing", label: "Marketing Dashboard", icon: Megaphone },
              { id: "affiliates", label: "Affiliate Management", icon: Link2 },
              { id: "support", label: "Customer Support", icon: HelpCircle },
              { id: "audit_logs", label: "System Audit Logs", icon: Terminal },
              { id: "security", label: "Security & Access", icon: Lock },
              { id: "settings", label: "System Settings", icon: Settings },
              { id: "developer", label: "Developer Console", icon: Database },
              { id: "executive_ai", label: "Executive AI Insights", icon: Sparkles }
            ].map((tab) => {
              const Icon = tab.icon;
              const allowed = isTabAllowed(tab.id);
              if (!allowed) return null;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all ${
                    activeTab === tab.id 
                      ? "text-white bg-white/5 border border-white/5 font-bold" 
                      : "hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Icon size={14} className={activeTab === tab.id ? "text-primary" : ""} />
                  {tab.label}
                </button>
              );
            })}

          </nav>
        </div>
      </aside>

      {/* Main Administrative Container */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header toolbar */}
        <header className="h-16 px-6 border-b border-white/10 flex justify-between items-center bg-[#050507]/80 backdrop-blur-md shrink-0">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            {activeTab.replace("_", " ")} Workspace
          </h2>

          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase font-black text-muted-foreground">Active Role:</span>
            <span className="text-[10px] bg-red-500/20 text-red-500 border border-red-500/30 px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
              {rolePermissions[activeRole].name}
            </span>
          </div>
        </header>

        {/* Panel Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* 1. EXECUTIVE DASHBOARD */}
            {activeTab === "executive" && (
              <motion.div
                key="executive"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[9px] uppercase font-black text-muted-foreground block">ARR (Annual Run Rate)</span>
                    <strong className="text-lg text-white">₹51,36,000</strong>
                    <span className="text-[8px] text-success block">+18% vs last quarter</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[9px] uppercase font-black text-muted-foreground block">MRR (Monthly Run Rate)</span>
                    <strong className="text-lg text-white">₹4,28,000</strong>
                    <span className="text-[8px] text-success block">₹42,800 projected today</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[9px] uppercase font-black text-muted-foreground block">Paid User Ratio</span>
                    <strong className="text-lg text-white">18.4%</strong>
                    <span className="text-[8px] text-success block">262 Premium accounts active</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[9px] uppercase font-black text-muted-foreground block">LTV / CAC Ratio</span>
                    <strong className="text-lg text-white">4.8x</strong>
                    <span className="text-[8px] text-success block">Optimal acquisition spends</span>
                  </div>
                </div>

                {/* Graph Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue Curve */}
                  <div className="p-5 rounded-2xl glass-panel border border-white/10 h-64 flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-black text-muted-foreground">Monthly Recurring Revenue Growth</span>
                    <div className="h-44 w-full pt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueChartData} margin={{ left: -25, top: 0, right: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="mrrGlow" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={9} />
                          <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} />
                          <Tooltip contentStyle={{ backgroundColor: "#121216", borderColor: "rgba(255,255,255,0.1)" }} />
                          <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#mrrGlow)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* AI Usage models breakdown */}
                  <div className="p-5 rounded-2xl glass-panel border border-white/10 h-64 flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-black text-muted-foreground">Model Requests volume</span>
                    <div className="h-44 w-full pt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={modelMetricsData} margin={{ left: -25, top: 0, right: 0, bottom: 0 }}>
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={9} />
                          <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} />
                          <Tooltip contentStyle={{ backgroundColor: "#121216", borderColor: "rgba(255,255,255,0.1)" }} />
                          <Bar dataKey="requests" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. USER MANAGEMENT */}
            {activeTab === "users" && (
              <motion.div
                key="users"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex gap-2 mb-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                    <input
                      type="text"
                      placeholder="Search users email or name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl glass-panel border border-white/5 overflow-x-auto bg-neutral-950/20">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-muted-foreground">
                        <th className="pb-2 font-bold uppercase">Name</th>
                        <th className="pb-2 font-bold uppercase">Plan</th>
                        <th className="pb-2 font-bold uppercase">Credits</th>
                        <th className="pb-2 font-bold uppercase">Device</th>
                        <th className="pb-2 font-bold uppercase">Status</th>
                        <th className="pb-2 font-bold uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-muted-foreground">
                      {usersList
                        .filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((u) => (
                          <tr key={u.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-3">
                              <span className="font-bold text-white block">{u.name}</span>
                              <span className="text-[10px] text-muted-foreground">{u.email}</span>
                            </td>
                            <td className="py-3">{u.plan}</td>
                            <td className="py-3 font-bold text-white">{u.credits}</td>
                            <td className="py-3">{u.device}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                u.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                              }`}>
                                {u.status}
                              </span>
                            </td>
                            <td className="py-3 text-right space-x-1.5">
                              <button
                                onClick={() => setImpersonatingUser(u.name)}
                                className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white font-bold text-[10px] transition border border-white/5"
                              >
                                Impersonate
                              </button>
                              <button
                                onClick={() => {
                                  setUsersList((prev) => 
                                    prev.map((item) => item.id === u.id ? { ...item, status: item.status === "Active" ? "Suspended" : "Active" } : item)
                                  );
                                  const ts = new Date().toLocaleTimeString();
                                  setConsoleLogs((prev) => [...prev, `[${ts}] Changed status of user ${u.name}`]);
                                }}
                                className="px-2 py-1 rounded bg-red-600/15 hover:bg-red-600/30 text-red-400 font-bold text-[10px] transition border border-red-500/20"
                              >
                                {u.status === "Active" ? "Suspend" : "Activate"}
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* 3. SUBSCRIPTION & BILLING */}
            {activeTab === "billing" && (
              <motion.div
                key="billing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Coupon Generator */}
                  <div className="p-5 rounded-2xl glass-panel border border-white/10 bg-neutral-950/40 space-y-4 md:col-span-1">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5"><Award size={14} className="text-primary" /> Coupon Code Generator</h4>
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Coupon ID</label>
                        <input type="text" placeholder="GROW50" className="w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2 text-white" />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Discount (%)</label>
                        <input type="number" placeholder="50" className="w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2 text-white" />
                      </div>
                      <button 
                        onClick={() => {
                          const ts = new Date().toLocaleTimeString();
                          setConsoleLogs((prev) => [...prev, `[${ts}] Generated discount coupon GROW50 (50% off)`]);
                        }}
                        className="w-full py-2 rounded-xl bg-primary hover:bg-primary-foreground text-black font-bold"
                      >
                        Create Coupon
                      </button>
                    </div>
                  </div>

                  {/* Pricing Matrix */}
                  <div className="p-5 rounded-2xl glass-panel border border-white/10 bg-neutral-950/40 space-y-4 md:col-span-2">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5"><IndianRupee size={14} className="text-primary" /> GST / Pricing Taxes Overrides</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-black block">CGST tax weight</span>
                        <input type="text" defaultValue="9.0%" className="w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2 text-white font-mono mt-1" />
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-black block">SGST tax weight</span>
                        <input type="text" defaultValue="9.0%" className="w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2 text-white font-mono mt-1" />
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const ts = new Date().toLocaleTimeString();
                        setConsoleLogs((prev) => [...prev, `[${ts}] Updated Indian GST tax configurations to 18% total.`]);
                      }}
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold"
                    >
                      Save Tax Configurations
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. WORKSPACE MANAGEMENT */}
            {activeTab === "workspaces" && (
              <motion.div
                key="workspaces"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-5 rounded-2xl glass-panel border border-white/10 bg-neutral-950/40 space-y-4"
              >
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5"><Layers size={14} className="text-primary" /> Team Roles & Workspaces limits</h4>
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                    <div>
                      <strong className="text-white block">Agency Workspace limit</strong>
                      <span className="text-[10px] text-muted-foreground">Max team members permitted under standard Agency level</span>
                    </div>
                    <input type="number" defaultValue={8} className="w-16 bg-[#121216] border border-white/10 rounded-lg px-2 py-1 text-white font-mono text-center" />
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                    <div>
                      <strong className="text-white block">Enterprise Storage Cap</strong>
                      <span className="text-[10px] text-muted-foreground">Max assets file storage permitted per organizational workspace</span>
                    </div>
                    <input type="text" defaultValue="50 GB" className="w-20 bg-[#121216] border border-white/10 rounded-lg px-2 py-1 text-white font-mono text-center" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. AI ENGINE DASHBOARD */}
            {activeTab === "ai_engines" && (
              <motion.div
                key="ai_engines"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Default switch */}
                  <div className="p-5 rounded-2xl glass-panel border border-white/10 bg-neutral-950/40 space-y-4">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5"><Zap size={14} className="text-primary" /> Model Routing Policies</h4>
                    
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Default AI Model</label>
                        <select
                          value={defaultAiModel}
                          onChange={(e) => {
                            setDefaultAiModel(e.target.value);
                            const ts = new Date().toLocaleTimeString();
                            setConsoleLogs((prev) => [...prev, `[${ts}] [AI] Default script engine model set to ${e.target.value}`]);
                          }}
                          className="w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2 text-white"
                        >
                          <option value="openai-gpt-4o">OpenAI GPT-4o (Premium)</option>
                          <option value="gemini-1.5-pro">Gemini 1.5 Pro (Standard)</option>
                          <option value="claude-3.5-sonnet">Claude 3.5 Sonnet (Structured)</option>
                          <option value="deepseek-coder">DeepSeek V3 (Economic)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Temperature</label>
                          <input type="text" defaultValue="0.7" className="w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2 text-white text-center font-mono" />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Max Tokens</label>
                          <input type="text" defaultValue="4,096" className="w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2 text-white text-center font-mono" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fallback parameters */}
                  <div className="p-5 rounded-2xl glass-panel border border-white/10 bg-neutral-950/40 space-y-4">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5"><AlertTriangle size={14} className="text-amber-500" /> Automatic Failovers</h4>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[10px] text-muted-foreground leading-normal space-y-2">
                      <p>
                        <strong>OpenAI Failover Path:</strong> If OpenAI Latency &gt; 1200ms or Error rate &gt; 2%, automatically reroute traffic to <strong>Gemini 1.5 Pro</strong>.
                      </p>
                      <p>
                        <strong>DataForSEO Failover Path:</strong> If API limits reach 98%, switch to RapidAPI backup keywords engine.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 6. PROMPT MANAGEMENT */}
            {activeTab === "prompts" && (
              <motion.div
                key="prompts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Editor */}
                <div className="lg:col-span-2 p-5 rounded-2xl glass-panel border border-white/10 bg-neutral-950/40 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5"><FileText size={14} className="text-primary" /> Script Engine Prompt Editor</h4>
                    <span className="text-[10px] text-primary font-bold">{promptVersion}</span>
                  </div>
                  <textarea
                    rows={6}
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    className="w-full bg-[#121216] border border-white/10 rounded-2xl p-4 text-xs text-white font-mono leading-relaxed"
                  />
                  <button
                    onClick={handleUpdatePrompt}
                    className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-foreground text-black font-bold text-xs"
                  >
                    Commit & Push Changes
                  </button>
                </div>

                {/* History */}
                <div className="p-5 rounded-2xl glass-panel border border-white/10 bg-neutral-950/40 space-y-4">
                  <h4 className="text-xs font-bold text-white">Prompt Commit History</h4>
                  <div className="space-y-3">
                    {promptHistory.map((item) => (
                      <div key={item.version} className="p-3 rounded-xl bg-white/5 border border-white/5 text-[10px] space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white">{item.version}</span>
                          <span className="text-muted-foreground">{item.date}</span>
                        </div>
                        <p className="text-muted-foreground italic line-clamp-2">"{item.text}"</p>
                        <div className="flex justify-between items-center text-[9px] text-muted-foreground pt-1 border-t border-white/5">
                          <span>By: {item.author}</span>
                          <button
                            onClick={() => {
                              setPromptText(item.text);
                              setPromptVersion(item.version);
                            }}
                            className="text-primary hover:underline font-semibold"
                          >
                            Rollback
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 7. FRAMEWORK LIBRARY */}
            {activeTab === "frameworks" && (
              <motion.div
                key="frameworks"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-5 rounded-2xl glass-panel border border-white/10 bg-neutral-950/40 space-y-4"
              >
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5"><Sliders size={14} className="text-primary" /> Global Video Frameworks Database</h4>
                  <button className="px-3 py-1.5 rounded-xl bg-primary text-black font-bold text-[10px]">+ Create Framework</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {["Problem-Agitate-Solution", "Storytelling-Conflict", "Extreme Challenge", "Brand Case Study"].map((fw, index) => (
                    <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                      <div>
                        <strong className="text-white block">{fw}</strong>
                        <span className="text-[10px] text-muted-foreground">Framework Index: FW 0{index + 1}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white font-bold text-[9px] border border-white/5">Edit</button>
                        <button className="px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-[9px] border border-red-500/25">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 8. RESEARCH DATABASE */}
            {activeTab === "research" && (
              <motion.div
                key="research"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-5 rounded-2xl glass-panel border border-white/10 bg-neutral-950/40 space-y-4"
              >
                <h4 className="text-xs font-bold text-white">Cache & Blacklisted Keywords Config</h4>
                <div className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2">
                    <span className="text-[9px] uppercase font-black text-muted-foreground">Blacklisted Keywords (Comma-separated)</span>
                    <textarea defaultValue="spam, bypass, hack, exploit, free credits" className="w-full bg-[#121216] border border-white/10 rounded-xl p-3 text-white font-mono" />
                  </div>
                  <button 
                    onClick={() => {
                      const ts = new Date().toLocaleTimeString();
                      setConsoleLogs((prev) => [...prev, `[${ts}] Purged keywords cache database. Refreshed Trend Indexes.`]);
                    }}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold"
                  >
                    Purge Keywords Cache
                  </button>
                </div>
              </motion.div>
            )}

            {/* 9. SEO LIBRARY */}
            {activeTab === "seo" && (
              <motion.div
                key="seo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="p-5 rounded-2xl glass-panel border border-white/10 bg-neutral-950/40 space-y-4">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5"><Globe size={14} className="text-primary" /> Title & Tag Templates</h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Global Title Template Pattern</label>
                      <input 
                        type="text" 
                        value={seoTitleTemplate} 
                        onChange={(e) => setSeoTitleTemplate(e.target.value)}
                        className="w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2 text-white font-mono" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Character Safe limit</label>
                      <input 
                        type="number" 
                        value={seoCharacterLimit} 
                        onChange={(e) => setSeoCharacterLimit(parseInt(e.target.value))}
                        className="w-20 bg-[#121216] border border-white/10 rounded-xl px-3 py-2 text-white text-center font-mono" 
                      />
                    </div>
                    <button
                      onClick={handleSaveSeoRules}
                      className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-foreground text-black font-bold text-xs"
                    >
                      Save SEO Parameters
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl glass-panel border border-white/10 bg-neutral-950/40 space-y-4 text-xs">
                  <h4 className="text-xs font-bold text-white">Keyword Tag Rules</h4>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2.5">
                    <div>
                      <span className="font-bold text-white block">Auto-insert Primary Tags</span>
                      <span className="text-[10px] text-muted-foreground">Appends #AI, #YouTubeGrowth, and #CreatorEconomy on every generation.</span>
                    </div>
                    <div>
                      <span className="font-bold text-white block">CTR-Boosting Modifiers</span>
                      <span className="text-[10px] text-muted-foreground">Injects hooks like "in 24 hours", "step-by-step", "never told before".</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 10. THUMBNAIL LIBRARY */}
            {activeTab === "thumbnails" && (
              <motion.div
                key="thumbnails"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="p-5 rounded-2xl glass-panel border border-white/10 bg-neutral-950/40 space-y-4">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5"><ImageIcon size={14} className="text-primary" /> Visual Composition & Fonts</h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Target Font Style</label>
                      <select 
                        value={selectedFont} 
                        onChange={(e) => setSelectedFont(e.target.value)}
                        className="w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2 text-white"
                      >
                        <option>Impact Bold</option>
                        <option>Montserrat Black</option>
                        <option>Bebas Neue</option>
                        <option>Outfit ExtraBold</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-black text-muted-foreground block mb-1">AI Composition Prompt Prefix</label>
                      <textarea 
                        rows={3}
                        value={aiStylePrompt} 
                        onChange={(e) => setAiStylePrompt(e.target.value)}
                        className="w-full bg-[#121216] border border-white/10 rounded-xl p-3 text-white font-mono" 
                      />
                    </div>
                    <button
                      onClick={handleUpdateThumbnailRules}
                      className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-foreground text-black font-bold text-xs"
                    >
                      Update Composition Rules
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl glass-panel border border-white/10 bg-neutral-950/40 space-y-4 text-xs">
                  <h4 className="text-xs font-bold text-white">CTR Benchmarks (A/B Models)</h4>
                  <div className="space-y-2.5">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                      <div>
                        <strong className="text-white block">Face Close-up + Neon Border</strong>
                        <span className="text-[10px] text-muted-foreground">High emotional intensity</span>
                      </div>
                      <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">8.4% CTR</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                      <div>
                        <strong className="text-white block">Minimalist Graphic + Split Screen</strong>
                        <span className="text-[10px] text-muted-foreground">Curiosity loop layout</span>
                      </div>
                      <span className="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20">5.9% CTR</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 11. ANALYTICS DASHBOARD */}
            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs">
                    <span className="text-[9px] uppercase font-black text-muted-foreground block">Most Used Feature</span>
                    <strong className="text-lg text-white block mt-1">Script Generator</strong>
                    <span className="text-[9px] text-primary mt-1 block">42,400 runs this month</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs">
                    <span className="text-[9px] uppercase font-black text-muted-foreground block">Fastest Growing Niche</span>
                    <strong className="text-lg text-white block mt-1">AI Agents Automation</strong>
                    <span className="text-[9px] text-success mt-1 block">+380% search velocity</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs">
                    <span className="text-[9px] uppercase font-black text-muted-foreground block">Average User Retention</span>
                    <strong className="text-lg text-white block mt-1">68.4%</strong>
                    <span className="text-[9px] text-primary mt-1 block">Day 30 cohort index</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl glass-panel border border-white/10 bg-neutral-950/40 h-64 flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-black text-muted-foreground block mb-2">Platform Audience Retention Curve</span>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={retentionChartData} margin={{ left: -25, top: 0, right: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="retGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={9} />
                        <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} unit="%" />
                        <Tooltip contentStyle={{ backgroundColor: "#121216", borderColor: "rgba(255,255,255,0.1)" }} />
                        <Area type="monotone" dataKey="retention" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#retGlow)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 12. ENVIRONMENT CONFIGURATIONS */}
            {activeTab === "apis" && (
              <motion.div
                key="apis"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Environment Integrations & Configurations
                </h3>

                <div className="p-4 rounded-xl glass-panel border border-white/5 overflow-x-auto bg-neutral-950/20">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-muted-foreground">
                        <th className="pb-2 font-bold uppercase">API Service</th>
                        <th className="pb-2 font-bold uppercase">Secret Key</th>
                        <th className="pb-2 font-bold uppercase">System Limit</th>
                        <th className="pb-2 font-bold uppercase">Status</th>
                        <th className="pb-2 font-bold uppercase text-right">Security Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-muted-foreground">
                      {apiKeys.map((key) => (
                        <tr key={key.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 font-bold text-white">{key.name}</td>
                          <td className="py-3 font-mono text-neutral-400">{key.value}</td>
                          <td className="py-3 font-mono">{key.rateLimit}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                              key.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                            }`}>
                              {key.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => handleRotateKey(key.id)}
                              className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white font-bold text-[9px] border border-white/5"
                            >
                              Rotate Key
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* 13. CREDIT MANAGEMENT */}
            {activeTab === "credits" && (
              <motion.div
                key="credits"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {/* Manual adjuster */}
                <div className="p-5 rounded-2xl glass-panel border border-white/10 bg-neutral-950/40 space-y-4 md:col-span-1">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5"><RotateCcw size={14} className="text-primary" /> Credit Adjuster Tool</h4>
                  
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Select User Target</label>
                      <select
                        value={selectedUserForCredits}
                        onChange={(e) => setSelectedUserForCredits(parseInt(e.target.value))}
                        className="w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2 text-white"
                      >
                        {usersList.map((u) => (
                          <option key={u.id} value={u.id}>{u.name} ({u.credits} cr)</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Credits Amount</label>
                      <input
                        type="number"
                        value={creditsAmountToAdd}
                        onChange={(e) => setCreditsAmountToAdd(parseInt(e.target.value))}
                        className="w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleModifyCredits("add")}
                        className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-bold"
                      >
                        Add Credits
                      </button>
                      <button
                        onClick={() => handleModifyCredits("remove")}
                        className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-black font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                {/* Info panels */}
                <div className="p-5 rounded-2xl glass-panel border border-white/10 bg-neutral-950/40 space-y-4 md:col-span-2">
                  <h4 className="text-xs font-bold text-white">Credits Rules Config</h4>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-[10px] text-muted-foreground leading-normal space-y-2">
                    <p>
                      <strong>Starter Limit reset:</strong> Automatically resets to 50 credits on day 1 of billing cycle.
                    </p>
                    <p>
                      <strong>Agency Limit reset:</strong> Resets to Unlimited. API tokens are capped at 50,000 output tokens per request.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 14. CONTENT MODERATION */}
            {activeTab === "moderation" && (
              <motion.div
                key="moderation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-5 rounded-2xl glass-panel border border-white/10 bg-neutral-950/40 space-y-4"
              >
                <h4 className="text-xs font-bold text-white">Flagged Content Queue</h4>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center text-xs text-muted-foreground py-10">
                  <CheckCircle className="text-success mx-auto mb-2" size={24} />
                  No flagged titles, scripts, or thumbnails found. All scanned drafts are within standard guidelines.
                </div>
              </motion.div>
            )}

            {/* 15. NOTIFICATION CENTER */}
            {activeTab === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-5 rounded-2xl glass-panel border border-white/10 bg-neutral-950/40 space-y-4 max-w-xl"
              >
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5"><Bell size={14} className="text-primary animate-pulse" /> Global Broadcast Engine</h4>
                
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Target Audience</label>
                      <select
                        value={broadcastTarget}
                        onChange={(e) => setBroadcastTarget(e.target.value)}
                        className="w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2 text-white"
                      >
                        <option value="all">All Users (1,424)</option>
                        <option value="premium">Premium Tiers Only (262)</option>
                        <option value="inactive">Inactive accounts (340)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Delivery Channel</label>
                      <select className="w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2 text-white">
                        <option>In-App Popup</option>
                        <option>Email Newsletter</option>
                        <option>WhatsApp Alert</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Message Content</label>
                    <textarea
                      rows={3}
                      value={broadcastText}
                      onChange={(e) => setBroadcastText(e.target.value)}
                      placeholder="Maintenance notice: AI models are upgrading on Wednesday at 2 AM..."
                      className="w-full bg-[#121216] border border-white/10 rounded-xl p-3 text-white"
                    />
                  </div>

                  <button
                    onClick={handleBroadcast}
                    className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-foreground text-black font-bold text-xs transition"
                  >
                    Broadcast Alert
                  </button>

                  <AnimatePresence>
                    {broadcastSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center font-bold"
                      >
                        Broadcast Sent successfully!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* 16. MARKETING DASHBOARD */}
            {activeTab === "marketing" && (
              <motion.div
                key="marketing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="p-5 rounded-2xl glass-panel border border-white/10 bg-neutral-950/40 space-y-4">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5"><Megaphone size={14} className="text-primary" /> Active Popup Campaigns</h4>
                  <div className="space-y-3">
                    {marketingCampaigns.map((camp) => (
                      <div key={camp.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center text-xs">
                        <div>
                          <strong className="text-white block">{camp.name}</strong>
                          <span className="text-[10px] text-muted-foreground">Code: {camp.coupon} ({camp.discount} Off)</span>
                        </div>
                        <div className="text-right">
                          <span className="text-white font-bold block">{camp.conversions}</span>
                          <span className="text-[9px] text-muted-foreground uppercase">Conversions</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl glass-panel border border-white/10 bg-neutral-950/40 space-y-4">
                  <h4 className="text-xs font-bold text-white">Create New Campaign</h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Campaign Name</label>
                      <input 
                        type="text" 
                        value={newCampaignName}
                        onChange={(e) => setNewCampaignName(e.target.value)}
                        placeholder="e.g. Winter Creator Drive"
                        className="w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2 text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Coupon Code / ID</label>
                      <input 
                        type="text" 
                        value={newCampaignCoupon}
                        onChange={(e) => setNewCampaignCoupon(e.target.value)}
                        placeholder="WINTER2026"
                        className="w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2 text-white font-mono uppercase" 
                      />
                    </div>
                    <button
                      onClick={handleSaveCampaign}
                      className="w-full py-2 rounded-xl bg-primary hover:bg-primary-foreground text-black font-bold text-xs transition"
                    >
                      Deploy Campaign
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 17. AFFILIATE MANAGEMENT */}
            {activeTab === "affiliates" && (
              <motion.div
                key="affiliates"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-xl glass-panel border border-white/5 overflow-x-auto bg-neutral-950/20">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-muted-foreground">
                        <th className="pb-2 font-bold uppercase">Partner Name</th>
                        <th className="pb-2 font-bold uppercase text-center">Referred Signups</th>
                        <th className="pb-2 font-bold uppercase text-center">Paid Conversions</th>
                        <th className="pb-2 font-bold uppercase text-right">Pending Payout</th>
                        <th className="pb-2 font-bold uppercase text-center">Status</th>
                        <th className="pb-2 font-bold uppercase text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-muted-foreground">
                      {affiliatePartners.map((aff) => (
                        <tr key={aff.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 font-bold text-white">{aff.name}</td>
                          <td className="py-3 text-center">{aff.signups}</td>
                          <td className="py-3 text-center text-primary font-bold">{aff.paidUsers}</td>
                          <td className="py-3 text-right text-emerald-400 font-mono font-bold">₹{aff.pendingPayout.toLocaleString()}</td>
                          <td className="py-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                              aff.status === "Paid" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}>
                              {aff.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => handleApprovePayout(aff.id)}
                              disabled={aff.status === "Paid"}
                              className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white disabled:opacity-50 font-bold text-[9px] border border-white/5 transition"
                            >
                              Approve Payout
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* 18. CUSTOMER SUPPORT */}
            {activeTab === "support" && (
              <motion.div
                key="support"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-xl glass-panel border border-white/5 overflow-x-auto bg-neutral-950/20">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-muted-foreground">
                        <th className="pb-2 font-bold uppercase">Ticket ID</th>
                        <th className="pb-2 font-bold uppercase">Customer</th>
                        <th className="pb-2 font-bold uppercase">Subject Line</th>
                        <th className="pb-2 font-bold uppercase">Date</th>
                        <th className="pb-2 font-bold uppercase text-center">Status</th>
                        <th className="pb-2 font-bold uppercase text-right">Resolve</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-muted-foreground">
                      {ticketsList.map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 font-mono font-bold">#{ticket.id}</td>
                          <td className="py-3 text-white font-bold">{ticket.user}</td>
                          <td className="py-3 text-neutral-300">{ticket.subject}</td>
                          <td className="py-3">{ticket.date}</td>
                          <td className="py-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                              ticket.status === "Resolved" 
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                : ticket.status === "In Progress"
                                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}>
                              {ticket.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => handleCloseTicket(ticket.id)}
                              disabled={ticket.status === "Resolved"}
                              className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white font-bold text-[9px] border border-white/5 transition"
                            >
                              Close Ticket
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* 19. AUDIT LOGS */}
            {activeTab === "audit_logs" && (
              <motion.div
                key="audit_logs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Immutable Security Audit Database
                </h3>

                <div className="p-4 rounded-xl glass-panel border border-white/5 overflow-x-auto bg-neutral-950/20">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-muted-foreground">
                        <th className="pb-2 font-bold uppercase">Time</th>
                        <th className="pb-2 font-bold uppercase">Actor</th>
                        <th className="pb-2 font-bold uppercase">Action</th>
                        <th className="pb-2 font-bold uppercase">Event Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-muted-foreground">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-2.5 font-mono text-neutral-400">{log.time}</td>
                          <td className="py-2.5 font-semibold text-white">{log.user}</td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 rounded bg-white/5 text-primary border border-white/5 text-[9px] font-mono">
                              {log.action}
                            </span>
                          </td>
                          <td className="py-2.5 text-neutral-300">{log.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* 20. SECURITY */}
            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-5 rounded-2xl glass-panel border border-white/10 bg-neutral-950/40 space-y-4 max-w-lg"
              >
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5"><Lock size={14} className="text-primary" /> Session Security Configurations</h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <strong className="text-white block">Super Admin 2FA Auth</strong>
                      <span className="text-[10px] text-muted-foreground">Force secondary authenticator app validations on admin login</span>
                    </div>
                    <span className="text-[9px] font-black uppercase text-success bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">FORCED</span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <strong className="text-white block">IP Whitelist lock</strong>
                      <span className="text-[10px] text-muted-foreground">Restrict Super Admin path checks to specific CIDR blocks</span>
                    </div>
                    <span className="text-[9px] font-black uppercase text-muted-foreground bg-white/5 px-2 py-0.5 rounded border border-white/5">DISABLED</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 21. SETTINGS */}
            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-5 rounded-2xl glass-panel border border-white/10 bg-neutral-950/40 space-y-4 max-w-lg"
              >
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5"><Settings size={14} className="text-primary animate-spin" style={{ animationDuration: '8s' }} /> General Application Overrides</h4>
                
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Branding Logo Name</label>
                      <input type="text" defaultValue="Yantra.ai" className="w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2 text-white" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Default Currency</label>
                      <input type="text" defaultValue="INR (₹)" className="w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2 text-white" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                    <div>
                      <strong className="text-white block">Global Maintenance Mode</strong>
                      <span className="text-[10px] text-muted-foreground">Locks out creators and locks dashboard views to read-only</span>
                    </div>
                    <button
                      onClick={() => {
                        setMaintenanceMode(!maintenanceMode);
                        const ts = new Date().toLocaleTimeString();
                        setConsoleLogs((prev) => [...prev, `[${ts}] Set global maintenance status to ${!maintenanceMode}`]);
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-[10px] font-black transition ${
                        maintenanceMode 
                          ? "bg-red-600 border-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]" 
                          : "bg-white/5 border-white/5 text-muted-foreground hover:border-white/10"
                      }`}
                    >
                      {maintenanceMode ? "ACTIVE" : "INACTIVE"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 22. DEVELOPER CONSOLE */}
            {activeTab === "developer" && (
              <motion.div
                key="developer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {/* Redis Stats */}
                <div className="p-5 rounded-2xl glass-panel border border-white/10 bg-neutral-950/40 space-y-4">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5"><Activity size={14} className="text-primary animate-pulse" /> Redis & BullMQ Queue</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between font-mono">
                      <span className="text-muted-foreground">Redis Memory:</span>
                      <span className="text-white font-bold">2.4 GB</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-muted-foreground">Active worker nodes:</span>
                      <span className="text-white font-bold">4 active</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleFlushCache}
                    className="w-full py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-[10px]"
                  >
                    Flush Redis Cache
                  </button>
                </div>

                {/* Env variables list */}
                <div className="p-5 rounded-2xl glass-panel border border-white/10 bg-neutral-950/40 space-y-4 md:col-span-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5"><Terminal size={14} className="text-primary" /> Environment Key Configs</h4>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2 text-[10px] font-mono text-muted-foreground">
                    <div>
                      <span className="text-primary">NODE_ENV:</span> <span className="text-white">production</span>
                    </div>
                    <div>
                      <span className="text-primary">DATABASE_URL:</span> <span className="text-neutral-400">postgresql://db-admin@prod-primary-ip:5432/yantra_db</span>
                    </div>
                    <div>
                      <span className="text-primary">REDIS_PORT:</span> <span className="text-white">6379</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 23. EXECUTIVE AI INSIGHTS */}
            {activeTab === "executive_ai" && (
              <motion.div
                key="executive_ai"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Banner */}
                <div className="p-6 rounded-2xl glass-panel bg-gradient-to-r from-primary/10 via-purple-600/5 to-transparent border border-primary/20 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold uppercase tracking-widest">
                    <Sparkles size={12} className="animate-pulse" /> Executive AI Intelligence
                  </div>
                  <h3 className="text-lg font-black text-white">Platform-wide Strategic Insights</h3>
                  <p className="text-xs text-muted-foreground max-w-xl">
                    Executive AI deconstructs platform metrics, usage drops, and billing conversion coefficients to deliver roadmap suggestions.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recommendations */}
                  <div className="p-5 rounded-2xl glass-panel border border-white/10 bg-neutral-950/40 space-y-4">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5"><TrendingUp size={14} className="text-primary" /> Strategic Decisions</h4>
                    <div className="space-y-3 text-xs leading-normal">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                        <span className="font-bold text-white block">1. Focus framework upgrades on 'Case Study'</span>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Creators using the Case Study framework generate an average audience retention of <strong>94%</strong>, resulting in a 40% increase in referral signups.
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                        <span className="font-bold text-white block">2. Model Cost Optimization opportunity</span>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Rerouting standard script drafts from GPT-4o to Gemini 1.5 Pro will reduce monthly token expenses by <strong>₹62,000</strong> without impacting quality.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* fast growing niches */}
                  <div className="p-5 rounded-2xl glass-panel border border-white/10 bg-neutral-950/40 space-y-4">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5"><Zap size={14} className="text-amber-500 animate-pulse" /> Growth Niche Breakouts (Top 3)</h4>
                    <div className="space-y-3 text-xs leading-normal">
                      <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                        <div>
                          <strong className="text-white block">No-Code SaaS Builders</strong>
                          <span className="text-[9px] text-muted-foreground">Competitor view velocity average: 2.1k views/hr</span>
                        </div>
                        <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20">+380%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                        <div>
                          <strong className="text-white block">AI Employee Automation</strong>
                          <span className="text-[9px] text-muted-foreground">Competitor view velocity average: 1.8k views/hr</span>
                        </div>
                        <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20">+340%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Live log Terminal strip bottom */}
        <footer className="h-28 border-t border-white/10 bg-[#070709] p-4 flex gap-4 shrink-0 overflow-hidden font-mono text-[9px] text-muted-foreground">
          <div className="w-44 shrink-0 border-r border-white/5 pr-4 flex flex-col justify-between">
            <span className="font-bold text-white flex items-center gap-1"><Terminal size={10} /> console streams</span>
            <span className="text-[8px]">Status: Active sync</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-0.5 select-all">
            {consoleLogs.slice(-4).map((log, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-primary select-none">&gt;&gt;</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </footer>

      </main>

    </div>
  );
}
