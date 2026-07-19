"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, MessageSquare, ChevronDown, Star } from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import UserDropdown from '@/components/UserDropdown';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/auth/login');
        return;
      }
      if (user.user_metadata?.role !== 'maker') {
        router.push('/');
        return;
      }
      fetch('/api/providers/me')
        .then(res => res.json())
        .then(data => {
          if (!data.provider) {
            router.push('/provider/new');
          } else {
            setProfile(data.provider);
          }
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => setLoading(false));
    });
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] w-full font-sans">
      
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center sticky top-0 z-40">
        <div className="text-slate-800 font-medium text-sm truncate max-w-[150px] sm:max-w-none">
          {profile?.name || 'Loading...'} <span className="hidden sm:inline text-slate-400">| Locksmith Pro - Profile</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-4 md:p-8 max-w-[1400px] mx-auto">
        
        {/* Title above banner */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-slate-900">Profile: {profile?.name || 'Loading...'}</h1>
          <p className="text-slate-600 text-sm">{profile?.name || 'Locksmith Services'} | {profile?.address?.split(',').pop() || 'Loading...'}</p>
        </div>

        {/* Hero Banner */}
        <div className="relative mb-12 md:mb-16 mt-2">
          <div className="rounded-2xl overflow-hidden bg-slate-800 h-44 shadow-sm border border-slate-200 relative">
            <img 
              src={profile?.bannerUrl || "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=1200&h=400"} 
              alt="Cover" 
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-transparent"></div>
            
            <div className="absolute bottom-4 md:bottom-6 left-28 md:left-36 z-10 pr-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md tracking-tight">{profile?.name || 'Alex'}</h2>
              <div className="flex items-center gap-1 text-amber-400 text-sm font-medium mt-0.5">
                <Star className="w-4 h-4 fill-current shrink-0" />
                <span className="text-white drop-shadow-md">{profile?.rating ? profile.rating.toFixed(1) : '5.0'} <span className="text-slate-200 font-normal">| {profile?.reviews || '0'} reviews</span></span>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-4 md:left-8 transform translate-y-1/2 z-20">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#f1f5f9] bg-white overflow-hidden shadow-md shrink-0">
              <img 
                src={profile?.avatarUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256"} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Profile Content Container */}
        <div className="flex flex-col border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white w-full">
          <div className="h-14 border-b border-slate-200 flex items-center justify-center bg-white">
             <h3 className="text-[15px] font-semibold text-slate-800">Profile Information</h3>
          </div>
          
          <div className="p-4 md:p-8 space-y-8 bg-white">
            {/* Top row: About and Skills */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">About {profile?.name?.split(' ')[0] || ''}</h4>
                <p className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {profile?.about || 'No information provided yet.'}
                </p>
              </div>

              {profile?.skills && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Skills</h4>
                  <p className="text-[13px] text-slate-600 leading-relaxed">
                    {profile.skills}
                  </p>
                </div>
              )}
            </div>

            <div className="h-px w-full bg-slate-100"></div>

            {/* Bottom row: Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">Contact Info</h4>
                <div className="text-[13px] text-slate-600 space-y-1">
                  <p>Phone: {profile?.phone || 'Not provided'}</p>
                  {profile?.email && <p>Email: {profile.email}</p>}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">Location</h4>
                <p className="text-[13px] text-slate-600">{profile?.address || 'Not provided'}</p>
              </div>

              {profile?.businessHours && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Hours</h4>
                  <div className="text-[13px] text-slate-600 space-y-0.5 whitespace-pre-wrap">
                    {profile.businessHours}
                  </div>
                </div>
              )}

              {profile?.certifications && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Certifications</h4>
                  <div className="text-[13px] text-slate-600 space-y-0.5 whitespace-pre-wrap">
                    {profile.certifications}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
