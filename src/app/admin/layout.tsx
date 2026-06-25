'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, Users, Settings, Database, 
  Terminal, ShieldCheck, Activity, Key
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If we are on the login page, don't show the sidebar layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: BarChart3 },
    { href: '/admin/users', label: 'User Management', icon: Users },
    { href: '/admin/config', label: 'Live Config', icon: Key },
    { href: '/admin/prompts', label: 'Prompt Library', icon: Database },
    { href: '/admin/health', label: 'API Health', icon: Activity },
    { href: '/admin/audit', label: 'Audit Logs', icon: Terminal },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/50 bg-card flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <ShieldCheck className="w-6 h-6 text-primary mr-2" />
          <span className="font-bold text-foreground tracking-tight">Admin OS</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 cursor-pointer transition-colors">
            <span className="font-medium text-sm">Logout Admin</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Topbar */}
        <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8">
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            Production Environment
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">Superadmin</span>
          </div>
        </header>

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}
