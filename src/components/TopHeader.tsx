"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Bell, MessageSquare, ChevronDown, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import UserDropdown from './UserDropdown';
import NotificationBell from './NotificationBell';

export default function TopHeader() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [providerProfile, setProviderProfile] = useState<{name: string, avatarUrl: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      
      if (user?.user_metadata?.role === 'maker') {
        fetch('/api/providers/me')
          .then(res => res.json())
          .then(data => {
            if (data.provider) {
              setProviderProfile({ 
                name: data.provider.name, 
                avatarUrl: data.provider.avatarUrl 
              });
            }
          })
          .catch(console.error)
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleTextSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ", Morocco")}`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        const lat = data[0].lat;
        const lng = data[0].lon;
        router.push(`/search?lat=${lat}&lng=${lng}`);
      } else {
        alert("Location not found. Please try a different city name.");
      }
    } catch (err) {
      alert("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  // Hide TopHeader on landing page or auth pages if desired, but for now we'll show it everywhere except maybe landing page.
  if (pathname === '/' || pathname.startsWith('/auth')) {
    return null; // Top header only for app shell
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <h1 className="hidden md:block font-bold text-slate-900 text-xl mr-4">LockPro Network</h1>
        
        {/* Global Search Bar */}
        <form onSubmit={handleTextSearch} className="max-w-md w-full relative hidden sm:block">
          {searching ? (
            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
          ) : (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          )}
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search city, e.g. Ben Guerir, Morocco"
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </form>
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell />
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <MessageSquare className="w-5 h-5" />
        </button>
        
        <div className="h-6 w-px bg-slate-200 mx-1"></div>
        
        {loading ? (
          <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse"></div>
        ) : user ? (
          <UserDropdown 
            name={providerProfile?.name || user.user_metadata?.full_name || user.email?.split('@')[0]} 
            avatarUrl={providerProfile?.avatarUrl || user.user_metadata?.avatar_url} 
            profileLink={user.user_metadata?.role === 'maker' ? '/dashboard/profile' : '/client/profile'}
          />
        ) : (
          <Link href="/auth/login" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
