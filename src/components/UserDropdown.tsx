"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, User, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n/LanguageContext';

type UserDropdownProps = {
  name?: string;
  avatarUrl?: string;
  profileLink?: string;
};

export default function UserDropdown({ name, avatarUrl, profileLink = "/dashboard/profile" }: UserDropdownProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const getInitial = (name?: string) => name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={t("alt.profile")} 
            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center border border-slate-200 shrink-0 text-xs">
            {getInitial(name)}
          </div>
        )}
        <span className="hidden sm:block text-sm font-medium text-slate-700 group-hover:text-slate-900">
          {name || 'Provider'}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute end-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 transform origin-top-right transition-all">
          <div className="py-1">
            <Link 
              href={profileLink}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>{t("dropdown.my_profile")}</span>
            </Link>
            <div className="h-px bg-slate-100 my-1"></div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span>{t("dropdown.log_out")}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
