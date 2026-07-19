"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Loader2, CheckCircle2, ArrowLeft, MessageSquare, ChevronDown } from 'lucide-react';
import LocationPickerWrapper from '@/components/LocationPickerWrapper';
import NotificationBell from '@/components/NotificationBell';
import UserDropdown from '@/components/UserDropdown';

export default function EditProvider() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [providerId, setProviderId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    about: '',
    lat: '',
    lng: '',
    email: '',
    skills: '',
    certifications: '',
    businessHours: '',
    avatarUrl: '',
    bannerUrl: ''
  });

  useEffect(() => {
    fetch('/api/providers/me')
      .then(res => res.json())
      .then(data => {
        if (data.provider) {
          setProviderId(data.provider.id);
          setFormData({
            name: data.provider.name || '',
            address: data.provider.address || '',
            phone: data.provider.phone || '',
            about: data.provider.about || '',
            lat: data.provider.lat ? data.provider.lat.toString() : '',
            lng: data.provider.lng ? data.provider.lng.toString() : '',
            email: data.provider.email || '',
            skills: data.provider.skills || '',
            certifications: data.provider.certifications || '',
            businessHours: data.provider.businessHours || '',
            avatarUrl: data.provider.avatarUrl || '',
            bannerUrl: data.provider.bannerUrl || ''
          });
        } else {
          router.push('/provider/new');
        }
      })
      .catch(console.error)
      .finally(() => setFetching(false));
  }, [router]);

  const handleLocationSelected = (lat: number, lng: number, address?: string) => {
    setFormData(prev => ({
      ...prev,
      lat: lat.toString(),
      lng: lng.toString(),
      ...(address ? { address } : {})
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from('provider_avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('provider_avatars').getPublicUrl(fileName);
      setFormData({ ...formData, avatarUrl: data.publicUrl });
    } catch (error) {
      alert('Error uploading image! Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `banner-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from('provider_avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('provider_avatars').getPublicUrl(fileName);
      setFormData({ ...formData, bannerUrl: data.publicUrl });
    } catch (error) {
      alert('Error uploading banner! Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lat || !formData.lng) {
      alert("Please select your location on the map before submitting.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/providers/${providerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert("Error updating profile. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 w-full font-sans">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center sticky top-0 z-40">
        <div className="text-slate-800 font-medium flex items-center gap-2 text-sm truncate max-w-[150px] sm:max-w-none">
          <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors mr-1 sm:mr-2 shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          Provider <span className="hidden sm:inline text-slate-400">| Locksmith Pro - Settings</span>
        </div>
      </header>

      <main className="p-4 md:p-6 max-w-[1400px] mx-auto relative">
        {/* Success Toast */}
        <div className={`fixed top-20 right-4 sm:right-6 z-50 transition-all duration-500 ease-out transform ${showSuccess ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 shadow-lg max-w-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-emerald-800 text-sm font-medium">Your profile information was updated successfully!</p>
          </div>
        </div>

        <div className="w-full mb-6 md:mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Edit Your Profile</h1>
          <p className="text-slate-500 text-sm mt-0.5">Update your business details and location.</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          
          {/* Step 1 - Business Info */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 mb-2 pb-4 border-b border-slate-100">
              <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center">1</span>
              <h2 className="font-bold text-slate-900 text-base md:text-lg">Your Business Info</h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Profile Image</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border border-slate-200 overflow-hidden bg-slate-50 shrink-0">
                  <img 
                    src={formData.avatarUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256"} 
                    alt="Avatar Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={loading}
                    className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100 disabled:opacity-50 cursor-pointer"
                  />
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Cover Banner Image</label>
              <div className="flex flex-col gap-3">
                <div className="w-full h-32 rounded-xl border border-slate-200 overflow-hidden bg-slate-800 shrink-0 relative">
                  <img 
                    src={formData.bannerUrl || "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=1200&h=400"} 
                    alt="Banner Preview" 
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    disabled={loading}
                    className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100 disabled:opacity-50 cursor-pointer"
                  />
                  <p className="text-xs text-slate-400 mt-1">Recommended: Wide image (e.g., 1200x400), PNG/JPG up to 5MB</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">Business / Provider Name *</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white text-sm"
                placeholder="e.g. Express Locksmith Casablanca"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">Full Address *</label>
              <input
                required
                type="text"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white text-sm"
                placeholder="Street, Neighborhood, City"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">Phone Number *</label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white text-sm"
                  placeholder="e.g. +212 6 12 34 56 78"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">Email Address (Optional)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white text-sm"
                  placeholder="e.g. contact@domain.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">About Your Services *</label>
              <textarea
                required
                rows={3}
                value={formData.about}
                onChange={e => setFormData({ ...formData, about: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none bg-slate-50 focus:bg-white text-sm"
                placeholder="Describe your experience, specializations, and availability..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">Skills (Optional)</label>
              <input
                type="text"
                value={formData.skills}
                onChange={e => setFormData({ ...formData, skills: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white text-sm"
                placeholder="e.g. Lock installation, Rekeying, Master Key Systems"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">Certifications (Optional)</label>
                <textarea
                  rows={2}
                  value={formData.certifications}
                  onChange={e => setFormData({ ...formData, certifications: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none bg-slate-50 focus:bg-white text-sm"
                  placeholder="e.g. ALOA Certified&#10;Registered NY Locksmith"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">Business Hours (Optional)</label>
                <textarea
                  rows={2}
                  value={formData.businessHours}
                  onChange={e => setFormData({ ...formData, businessHours: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none bg-slate-50 focus:bg-white text-sm"
                  placeholder="e.g. Mon-Fri: 8am-8pm&#10;Sat-Sun: Emergency Only"
                />
              </div>
            </div>
          </div>

          {/* Step 2 - Map Location */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
              <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center">2</span>
              <h2 className="font-bold text-slate-900 text-base md:text-lg">Pin Your Location</h2>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-200">
              <LocationPickerWrapper onLocationSelected={handleLocationSelected} />
            </div>

            {formData.lat && (
              <div className="mt-4 flex items-center gap-2 text-green-700 text-sm font-bold bg-green-50 p-3 rounded-xl border border-green-100">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Location pinned successfully!
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all disabled:opacity-50 text-sm shadow-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
