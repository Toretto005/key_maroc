"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Loader2, CheckCircle2 } from 'lucide-react';
import LocationPickerWrapper from '@/components/LocationPickerWrapper';

export default function CreateProvider() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    about: '',
    lat: '',
    lng: ''
  });

  useEffect(() => {
    fetch('/api/providers/me')
      .then(res => res.json())
      .then(data => {
        if (data.provider) {
          // Profile already exists, redirect to dashboard
          router.push('/dashboard');
        }
      })
      .catch(console.error);
  }, [router]);

  const handleLocationSelected = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      lat: lat.toString(),
      lng: lng.toString()
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lat || !formData.lng) {
      alert("Please select your location on the map before submitting.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        router.push(`/provider/${data.provider.id}`);
      } else {
        alert("Error creating profile. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Join Sarouti as a Key Maker</h1>
        <p className="text-slate-500 text-sm mt-0.5">Fill in your details and pin your location on the map.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        
        {/* Step 1 - Business Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">1</span>
            <h2 className="font-semibold text-slate-900 text-lg">Your Business Info</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Business / Provider Name *</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g. Express Locksmith Casablanca"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Address *</label>
            <input
              required
              type="text"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Street, Neighborhood, City"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number *</label>
            <input
              required
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g. +212 6 12 34 56 78"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">About Your Services *</label>
            <textarea
              required
              rows={3}
              value={formData.about}
              onChange={e => setFormData({ ...formData, about: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
              placeholder="Describe your experience, specializations, and availability..."
            />
          </div>
        </div>

        {/* Step 2 - Map Location */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">2</span>
            <h2 className="font-semibold text-slate-900 text-lg">Pin Your Location</h2>
          </div>

          <LocationPickerWrapper onLocationSelected={handleLocationSelected} />

          {formData.lat && (
            <div className="mt-3 flex items-center gap-2 text-green-700 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Location pinned successfully!
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-4 pb-10">
          <Link
            href="/"
            className="flex-1 text-center px-6 py-4 rounded-xl font-semibold border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || !formData.lat}
            className="flex-2 flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-100"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {loading ? "Creating Profile…" : "Create Profile →"}
          </button>
        </div>
      </form>
    </div>
  );
}
