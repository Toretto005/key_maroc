"use client";

import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { KeyRound, LogOut, User, Wrench, LogIn, Home, Search, Info, Mail, LayoutDashboard, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const NavLink = ({ href, icon: Icon, label }: { href: string, icon: React.ElementType, label: string }) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
  return (
    <Link 
      href={href} 
      className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 px-3 py-2 md:py-3 rounded-xl transition-colors ${
        isActive 
          ? 'text-blue-600 md:bg-blue-50 font-bold' 
          : 'text-slate-500 hover:text-slate-900 md:hover:bg-slate-100 font-medium'
      }`}
    >
      <Icon className={`w-6 h-6 md:w-5 md:h-5 ${isActive ? 'text-blue-600' : ''}`} />
      <span className="text-[10px] md:text-sm">{label}</span>
    </Link>
  );
};

export default function Sidebar() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const role = user?.user_metadata?.role;
  const name = user?.user_metadata?.full_name;



  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-slate-200 shadow-sm flex-shrink-0 z-50 sticky top-0">
        
        {/* Logo */}
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-slate-900 text-xl">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <KeyRound className="w-5 h-5 text-white" />
            </div>
            Sarouti
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          <NavLink href="/" icon={Home} label="Home" />
          <NavLink href="/search" icon={Search} label="Find Locksmith" />
          <NavLink href="/about" icon={Info} label="About Us" />
          <NavLink href="/contact" icon={Mail} label="Contact" />
          
          {user && role === 'maker' && (
            <div className="pt-4 mt-4 border-t border-slate-100">
              <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Provider</p>
              <NavLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
              <NavLink href="/provider/edit" icon={Settings} label="My Profile" />
            </div>
          )}

          {user && role === 'client' && (
            <div className="pt-4 mt-4 border-t border-slate-100">
              <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Account</p>
              <NavLink href="/client/profile" icon={Settings} label="My Profile" />
            </div>
          )}
        </nav>

        {/* User / Auth Bottom Section */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          {loading ? (
            <div className="w-full h-10 rounded-xl bg-slate-200 animate-pulse" />
          ) : user ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 px-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${role === 'maker' ? 'bg-amber-500' : 'bg-blue-600'}`}>
                  {name ? name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{name || user.email}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    {role === 'maker' ? <Wrench className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {role === 'maker' ? 'Key Maker' : 'Client'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 text-slate-600 hover:bg-slate-200 hover:text-slate-900 rounded-xl text-sm font-bold transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl text-sm font-bold transition-colors shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="flex items-center justify-center w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 flex items-center justify-around px-2">
        <NavLink href="/" icon={Home} label="Home" />
        <NavLink href="/search" icon={Search} label="Search" />
        
        {user && role === 'maker' && (
          <>
            <NavLink href="/dashboard" icon={LayoutDashboard} label="Panel" />
            <NavLink href="/provider/edit" icon={Settings} label="Profile" />
          </>
        )}

        {user && role === 'client' && (
          <NavLink href="/client/profile" icon={Settings} label="Profile" />
        )}
        
        {user ? (
          <button onClick={handleLogout} className="flex flex-col items-center gap-1 px-3 py-2 text-slate-500 hover:text-slate-900">
            <LogOut className="w-6 h-6" />
            <span className="text-[10px]">Sign out</span>
          </button>
        ) : (
          <NavLink href="/auth/login" icon={LogIn} label="Sign in" />
        )}
      </nav>
    </>
  );
}
