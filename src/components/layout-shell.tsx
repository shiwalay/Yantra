"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { LogOut } from "lucide-react";
import { 
  LayoutDashboard, 
  Search, 
  GitFork, 
  FileText, 
  Globe, 
  Image as ImageIcon, 
  BarChart3, 
  Sparkles, 
  CreditCard,
  Bell, 
  ChevronDown, 
  Menu,
  X,
  Compass,
  ArrowUpRight,
  TrendingUp,
  Settings,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const YoutubeIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill="currentColor" 
    className={className}
  >
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.388.503a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.503 9.388.503 9.388.503s7.518 0 9.388-.503a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const navItems = [
  { name: "Command Center", href: "/dashboard", icon: LayoutDashboard },
  { name: "Find Winning Topics", href: "/research", icon: Search },
  { name: "Create Videos", href: "/scripts", icon: FileText },
  { name: "Rank Higher", href: "/seo", icon: Globe },
  { name: "Grow Faster", href: "/analytics", icon: BarChart3 },
];

// Curated items for mobile bottom nav (max 5)
const mobileNavItems = [
  { name: "Command Center", href: "/dashboard", icon: LayoutDashboard },
  { name: "Find Topics", href: "/research", icon: Search },
  { name: "Create", href: "/scripts", icon: FileText },
  { name: "Grow Faster", href: "/analytics", icon: BarChart3 },
];

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // React Hooks must be called unconditionally
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setEmail(session?.user?.email ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  // Marketing, onboarding, and the entire /admin area render outside the app
  // sidebar shell (admin has its own layout).
  const isPublicPage = pathname === "/" || pathname === "/onboarding" || pathname.startsWith("/admin");

  if (isPublicPage) {
    return <div className="w-full min-h-screen bg-background text-foreground select-none">{children}</div>;
  }

  return (
    <div className="relative h-screen w-full flex text-foreground bg-background overflow-hidden">
      {/* Background Decorative Glow Orbs — restrained, barely-there ambient tint */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-primary/[0.06] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-secondary/[0.04] blur-[140px] pointer-events-none" />

      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-[0.12]" />

      {/* Sidebar Navigation - Tablet (Collapsible) & Desktop (Expanded) */}
      <aside
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
        className={`hidden md:flex flex-col fixed inset-y-0 left-0 z-40 bg-card border-r border-border/50 transition-all duration-300 ease-in-out shadow-2xl ${
          isSidebarHovered ? "w-64" : "w-20 lg:w-64"
        }`}
      >
        <div className="flex flex-col flex-1 overflow-hidden px-3 py-6">
          {/* Brand/Logo */}
          <div className="flex items-center gap-3 px-2 mb-8 whitespace-nowrap">
            <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-[10px] bg-gradient-to-tr from-primary to-secondary">
              <YoutubeIcon size={20} className="text-white" />
            </div>
            <div className={`flex flex-col transition-opacity duration-200 ${isSidebarHovered ? "opacity-100 lg:opacity-100" : "opacity-0 lg:opacity-100"}`}>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-foreground">
                  Yantra<span className="text-primary">.ai</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  OS
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-semibold transition-all overflow-hidden ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  title={item.name}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeGlowSidebar"
                      className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon
                    size={20}
                    className={`shrink-0 transition-colors ${
                      isActive ? "text-primary" : "group-hover:text-foreground"
                    }`}
                  />
                  <span className={`whitespace-nowrap transition-opacity duration-200 ${isSidebarHovered ? "opacity-100 lg:opacity-100" : "opacity-0 lg:opacity-100"}`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar (Credits & User) */}
        <div className="p-3 border-t border-border/50 bg-background/50">
          <div className={`flex flex-col gap-3 transition-opacity duration-200 ${isSidebarHovered ? "opacity-100 lg:opacity-100" : "opacity-0 lg:opacity-100"}`}>
            <div className="p-3 rounded-[12px] bg-card border border-border/50 shadow-sm">
              <div className="flex flex-col gap-1 mb-3">
                <span className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                  <Sparkles size={10} className="text-primary" /> Today&apos;s AI Capacity
                </span>
                <span className="text-foreground text-[11px] font-semibold">32 AI Tasks Remaining</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-3">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" 
                  style={{ width: "80%" }}
                />
              </div>
              <Link 
                href="/billing"
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-[8px] bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold transition-all"
              >
                Manage Plan
              </Link>
            </div>
          </div>
          {/* Account + sign out */}
          <div className="mt-3 flex items-center gap-2 px-2 mb-2">
            <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-xs text-white shadow-md uppercase">
              {email ? email[0] : "U"}
            </div>
            <div className={`flex-1 min-w-0 hidden lg:block overflow-hidden transition-opacity duration-200 ${isSidebarHovered ? "!block" : ""}`}>
              <p className="text-[12px] font-bold text-foreground truncate">{email ?? "Account"}</p>
              <p className="text-[10px] text-muted-foreground truncate">Growth Pro Plan</p>
            </div>
            <button
              onClick={signOut}
              title="Sign out"
              className={`shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors ${isSidebarHovered ? "block" : "hidden lg:block"}`}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className={`flex-1 flex flex-col h-screen transition-all duration-300 md:ml-20 lg:ml-64 pb-20 md:pb-0`}>
        {/* Top Header */}
        <header className="flex-none z-30 h-16 shrink-0 flex items-center justify-between px-4 md:px-8 border-b border-border/50 bg-background/80 backdrop-filter backdrop-blur-xl">
          {/* Page Title & Mobile Menu toggle */}
          <div className="flex items-center gap-3">
            <div className="md:hidden flex items-center justify-center w-8 h-8 rounded-[8px] bg-gradient-to-tr from-primary to-secondary shadow-sm">
              <YoutubeIcon size={16} className="text-white" />
            </div>
            <h1 className="text-[18px] md:text-xl font-bold text-foreground tracking-tight">
              {navItems.find((item) => item.href === pathname)?.name || "AI Command Center"}
            </h1>
          </div>

          {/* Quick Actions & Profile */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Quick Coach Search (Desktop Only) */}
            <Link 
              href="/coach"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-[10px] bg-muted/50 hover:bg-muted border border-border/50 transition-all text-xs font-medium text-muted-foreground hover:text-foreground cursor-text"
            >
              <Search size={14} />
              <span>Ask Coach: &quot;Why did my CTR drop?&quot;</span>
              <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-background border border-border text-[10px] font-mono ml-4">
                <span className="text-[12px]">⌘</span>K
              </kbd>
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotificationPopup(!showNotificationPopup)}
                className="p-2 rounded-[10px] bg-muted/50 hover:bg-muted border border-border/50 text-foreground transition-colors"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive ring-4 ring-background animate-pulse" />
              </button>

              <AnimatePresence>
                {showNotificationPopup && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-[320px] md:w-80 p-4 rounded-[16px] bg-card border border-border/50 shadow-2xl z-50 text-sm"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-border/30 mb-3">
                      <span className="font-bold text-foreground">Decision Alerts</span>
                      <button 
                        onClick={() => setShowNotificationPopup(false)}
                        className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Dismiss All
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex gap-3 p-2 rounded-[12px] bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                        <span className="text-xl">📉</span>
                        <div>
                          <p className="font-semibold text-foreground text-[13px]">Retention drop warning</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                            Last video has a steep 45% drop-off at 0:22. Framework recommends a hook interrupt.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Mobile-only avatar trigger */}
            <div className="md:hidden w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-xs text-white shadow-sm border border-border/50">
              SB
            </div>
          </div>
        </header>

        {/* Dynamic Page View Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto relative w-full max-w-[100vw]">
          {children}
        </main>
      </div>

      {/* Mobile Floating Action Button (FAB) for AI Assistant */}
      <Link 
        href="/coach"
        className="md:hidden fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.45)] hover:scale-105 active:scale-95 transition-all"
      >
        <Sparkles size={24} className="animate-pulse" />
      </Link>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-20 bg-card/90 backdrop-blur-xl border-t border-border/50 px-2 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between h-full max-w-md mx-auto">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className="relative flex-1 flex flex-col items-center justify-center gap-1.5 h-full group outline-none"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeGlowBottom"
                    className="absolute top-0 w-8 h-1 rounded-b-full bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon
                  size={22}
                  className={`transition-all duration-300 ${
                    isActive ? "text-primary -translate-y-1" : "text-muted-foreground group-active:scale-90"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={`text-[10px] font-semibold transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

    </div>
  );
}
