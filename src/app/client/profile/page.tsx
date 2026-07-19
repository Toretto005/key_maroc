"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, User, Phone, Settings as SettingsIcon, Mail } from 'lucide-react';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

export default function ClientProfile() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    avatarUrl: '',
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/auth/login');
        return;
      }
      if (user.user_metadata?.role !== 'client') {
        router.push('/');
        return;
      }

      setFormData({
        fullName: user.user_metadata?.full_name || '',
        phone: user.user_metadata?.phone || '',
        email: user.email || '',
        avatarUrl: user.user_metadata?.avatar_url || '',
      });
      setLoading(false);
    });
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 w-full font-sans">
      <main className="p-4 md:p-6 max-w-[1000px] mx-auto min-h-[80vh]">
        <div className="mb-2">
          <BackButton />
        </div>
        
        {/* Profile Card */}
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 mt-12">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm overflow-hidden">
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold">{formData.fullName.charAt(0) || 'C'}</span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{formData.fullName || 'Client User'}</h1>
            <p className="text-slate-500 text-sm mt-1">Client Account</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <User className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Full Name</p>
                <p className="text-sm font-medium text-slate-800">{formData.fullName || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Phone className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Phone Number</p>
                <p className="text-sm font-medium text-slate-800">{formData.phone || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Mail className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Email Address</p>
                <p className="text-sm font-medium text-slate-800">{formData.email || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <Link
            href="/client/settings"
            className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-all shadow-sm"
          >
            <SettingsIcon className="w-5 h-5" />
            Edit Profile
          </Link>
        </div>
      </main>
    </div>
  );
}
