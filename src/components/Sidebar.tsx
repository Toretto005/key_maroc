"use client";

import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Wrench, LogOut, User, LogIn, Home, Search, Info, Mail, LayoutDashboard, Settings, Calendar, Users, ClipboardList, Hexagon, Menu, X, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const NavLink = ({ href, icon: Icon, label, exact = false, onClick }: { href: string, icon: React.ElementType, label: string, exact?: boolean, onClick?: () => void }) => {
  const pathname = usePathname();
  
  // Use exact matching if requested (e.g. for /dashboard), otherwise use prefix matching
  const isActive = exact 
    ? pathname === href 
    : (pathname === href || (href !== '/' && pathname.startsWith(href)));

  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-e-full transition-colors me-4 ${
        isActive 
          ? 'bg-[#1b344a] text-white font-medium shadow-sm' 
          : 'text-slate-400 hover:text-white hover:bg-[#1b344a]/50 font-medium'
      }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
      <span className="text-sm">{label}</span>
    </Link>
  );
};

export default function Sidebar() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { t, lang } = useLanguage();
  const isRtl = lang === 'ar';

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
  const homeHref = role === 'maker' ? '/dashboard' : '/';

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#112331] text-white shrink-0 z-40 relative">
        <Link href={homeHref} className="flex items-center gap-2 font-bold text-white text-lg">
          <div className="relative flex items-center justify-center">
            <Hexagon className="w-6 h-6 text-blue-400 fill-blue-400/20" />
            <Wrench className="w-3 h-3 text-blue-400 absolute" />
          </div>
          Sarouti
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button onClick={() => setIsOpen(true)} className="p-1 hover:bg-slate-800 rounded-lg transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/60 z-40 backdrop-blur-sm transition-opacity"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar Container (Desktop & Mobile Drawer)
          NOTE: position/transform are driven by our own `lang` state (isRtl), not the
          ambient `dir` attribute or `rtl:` variant — third-party tools like the browser's
          built-in translate feature can force `dir="rtl"` on <html> for Arabic targets
          independently of our app state, which desyncs the logical start-0/rtl: math and
          can leave the drawer visible on-screen with no way to close it. */}
      <aside className={`fixed md:sticky top-0 z-50 h-dvh w-64 bg-[#112331] shadow-2xl md:shadow-xl text-slate-300 flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out md:translate-x-0 ${isRtl ? 'right-0' : 'left-0'} ${
        isOpen ? 'translate-x-0' : (isRtl ? 'max-md:translate-x-full' : 'max-md:-translate-x-full')
      }`}>
        
        {/* Logo & Mobile Close Button */}
        <div className="shrink-0 p-6 flex items-center justify-between">
          <Link href={homeHref} onClick={closeMenu} className="flex items-center gap-2 font-bold text-white text-xl">
            <div className="relative flex items-center justify-center">
              <Hexagon className="w-8 h-8 text-blue-400 fill-blue-400/20" />
              <Wrench className="w-4 h-4 text-blue-400 absolute" />
            </div>
            Sarouti
          </Link>
          <button onClick={closeMenu} className="md:hidden p-1 text-slate-400 hover:text-white rounded-lg">
             <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 min-h-0 space-y-1 overflow-y-auto mt-2">
          
          {user && role === 'maker' ? (
            <>
              <NavLink href="/dashboard" icon={LayoutDashboard} label={t("nav.dashboard")} exact={true} onClick={closeMenu} />
              <NavLink href="/dashboard/orders" icon={ClipboardList} label={t("nav.orders")} onClick={closeMenu} />
              <NavLink href="/provider/services" icon={Wrench} label={t("nav.services")} onClick={closeMenu} />
              <NavLink href="/dashboard/calendar" icon={Calendar} label={t("nav.calendar")} onClick={closeMenu} />
              <NavLink href="/dashboard/clients" icon={Users} label={t("nav.clients")} onClick={closeMenu} />
              <NavLink href="/provider/edit" icon={Settings} label={t("nav.settings")} onClick={closeMenu} />
              <NavLink href="/dashboard/profile" icon={User} label={t("nav.profile")} onClick={closeMenu} />
            </>
          ) : user && role === 'client' ? (
            <>
              <NavLink href="/client/dashboard" icon={Home} label={t("nav.home")} onClick={closeMenu} />
              <NavLink href="/search" icon={Search} label={t("nav.find_locksmith")} onClick={closeMenu} />
              <NavLink href="/client/orders" icon={Calendar} label={t("nav.my_bookings")} onClick={closeMenu} />
              <NavLink href="/client/messages" icon={MessageSquare} label={t("nav.messages")} onClick={closeMenu} />
              <NavLink href="/client/profile" icon={User} label={t("nav.profile")} exact={true} onClick={closeMenu} />
              <NavLink href="/client/settings" icon={Settings} label={t("nav.settings")} onClick={closeMenu} />
            </>
          ) : (
            <>
              <NavLink href="/" icon={Home} label={t("nav.home")} onClick={closeMenu} />
              <NavLink href="/search" icon={Search} label={t("nav.find_locksmith")} onClick={closeMenu} />
              <NavLink href="/about" icon={Info} label={t("nav.about")} onClick={closeMenu} />
              <NavLink href="/contact" icon={Mail} label={t("nav.contact")} onClick={closeMenu} />
            </>
          )}
        </nav>

        {/* Bottom Profile / Auth Actions */}
        <div className="shrink-0 p-4 border-t border-slate-800">
          {!loading && (
            user ? (
              <button 
                onClick={() => { handleLogout(); closeMenu(); }}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-medium text-sm"
              >
                <LogOut className="w-5 h-5" />
                <span>{t("nav.logout")}</span>
              </button>
            ) : (
              <div className="space-y-2">
                <Link 
                  href="/auth/login" 
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-medium text-sm"
                >
                  <LogIn className="w-5 h-5" />
                  <span>{t("nav.login")}</span>
                </Link>
                <Link 
                  href="/auth/signup"
                  onClick={closeMenu} 
                  className="flex items-center justify-center gap-2 px-4 py-3 w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors font-medium text-sm mt-2"
                >
                  <User className="w-4 h-4" />
                  <span>{t("nav.signup")}</span>
                </Link>
              </div>
            )
          )}
        </div>
      </aside>
    </>
  );
}
