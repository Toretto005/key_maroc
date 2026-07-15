"use client";

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { KeyRound, LogOut, User, Wrench, LogIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function Navbar() {
  const supabase = createClient();
  const router = useRouter();
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
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-slate-900 text-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-white" />
            </div>
            Sarouti
          </Link>

          {/* Center Navigation Menu */}
          <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            <Link href="/search" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              Find a Locksmith
            </Link>
            <Link href="/about" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
            ) : user ? (
              <>
                {/* Role badge */}
                <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                  role === 'maker'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {role === 'maker' ? <Wrench className="w-3 h-3" /> : <User className="w-3 h-3" />}
                  {role === 'maker' ? 'Key Maker' : 'Client'}
                </div>

                {/* Name */}
                <span className="hidden md:block text-sm font-medium text-slate-700">
                  {name || user.email}
                </span>

                {/* Maker: link to create/edit profile */}
                {role === 'maker' && (
                  <>
                    <Link
                      href="/dashboard"
                      className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded-xl text-sm font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                  </>
                )}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-1.5 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-medium transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
