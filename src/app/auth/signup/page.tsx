"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { KeyRound, User, Wrench, Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

type Role = 'client' | 'maker';

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClient();

  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLanguage();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return setError(t("auth.select_role_error"));
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, role },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${role === 'maker' ? '/provider/new' : '/'}`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/auth/verify-email');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="hidden md:block fixed top-4 end-4 z-50">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">{t("auth.join_title")}</h1>
          <p className="text-slate-400 mt-1">{t("auth.join_subtitle")}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">

          {/* Role Selector */}
          <div className="mb-6">
            <p className="text-sm font-medium text-slate-300 mb-3">{t("auth.iam")}</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${role === 'client'
                  ? 'border-blue-400 bg-blue-500/20 text-white'
                  : 'border-white/20 text-slate-300 hover:border-white/40 hover:bg-white/5'
                  }`}
              >
                <User className={`w-7 h-7 ${role === 'client' ? 'text-blue-400' : ''}`} />
                <span className="font-semibold text-sm">{t("auth.client")}</span>
                <span className="text-xs opacity-70 text-center">{t("auth.client_desc")}</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('maker')}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${role === 'maker'
                  ? 'border-amber-400 bg-amber-500/20 text-white'
                  : 'border-white/20 text-slate-300 hover:border-white/40 hover:bg-white/5'
                  }`}
              >
                <Wrench className={`w-7 h-7 ${role === 'maker' ? 'text-amber-400' : ''}`} />
                <span className="font-semibold text-sm">{t("auth.maker")}</span>
                <span className="text-xs opacity-70 text-center">{t("auth.maker_desc")}</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{t("auth.full_name")}</label>
              <input
                required
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t("placeholder.name")}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{t("auth.email")}</label>
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t("placeholder.email")}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{t("auth.password")}</label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={t("auth.password_placeholder")}
                  minLength={8}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pe-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/40 text-red-300 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !role}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/30 mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
              {loading ? t("auth.creating_account") : t("auth.create_account")}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            {t("auth.already_have_account")}{' '}
            <Link href="/auth/login" className="text-blue-400 font-medium hover:text-blue-300 transition-colors">
              {t("auth.sign_in")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
