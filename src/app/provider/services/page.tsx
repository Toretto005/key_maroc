"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Plus, Edit2, Trash2, CheckCircle2, ArrowLeft, MessageSquare, ChevronDown } from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import UserDropdown from '@/components/UserDropdown';
import FileInput from '@/components/FileInput';
import { useLanguage } from '@/lib/i18n/LanguageContext';

type Service = {
  id: number;
  name: string;
  description: string;
  price: string;
  duration: string;
  imageUrl?: string;
};

export default function ManageServices() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetch('/api/providers/me')
      .then(res => res.json())
      .then(data => {
        if (data.provider) setProfile(data.provider);
      })
      .catch(console.error);

    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      if (data.success) {
        setServices(data.services);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (svc: Service) => {
    setFormData({
      name: svc.name,
      description: svc.description,
      price: svc.price.replace(/\s*MAD$/i, ''),
      duration: svc.duration.replace(/\s*min$/i, ''),
      imageUrl: svc.imageUrl || ''
    });
    setEditingId(svc.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', duration: '', imageUrl: '' });
    setEditingId(null);
    setIsEditing(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    setUploading(true);
    try {
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from('provider_avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('provider_avatars').getPublicUrl(fileName);
      setFormData({ ...formData, imageUrl: data.publicUrl });
    } catch (error) {
      alert(t("settings.error"));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("provider.delete_confirm"))) return;

    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setServices(services.filter(s => s.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        price: formData.price ? `${formData.price} MAD` : '',
        duration: formData.duration ? `${formData.duration} min` : '',
      };
      if (editingId) {
        const res = await fetch(`/api/services/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          setServices(prev => prev.map(s => s.id === editingId ? data.service : s));
          resetForm();
        } else {
          alert("Error updating service");
        }
      } else {
        const res = await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          setServices([data.service, ...services]);
          resetForm();
        } else {
          alert("Error creating service");
        }
      }
    } catch (e) {
      console.error(e);
      alert(t("settings.error"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 w-full font-sans">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center sticky top-0 z-40">
        <div className="text-slate-800 font-medium flex items-center gap-2">
          <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors me-2">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          {t("dashboard.provider")} <span className="text-slate-400">| Locksmith Pro - Services</span>
        </div>
      </header>

      <main className="p-6 max-w-[1400px] mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t("provider.services_title")}</h1>
            <p className="text-slate-500 mt-1 text-sm">{t("provider.services_subtitle")}</p>
          </div>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors shadow-sm text-sm"
            >
              <Plus className="w-4 h-4" />
              {t("provider.add_service")}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Left Col: List of Services */}
          <div className={`md:col-span-2 space-y-4 ${isEditing && 'opacity-50 pointer-events-none md:pointer-events-auto md:opacity-100'}`}>
            {services.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-sm">
                <p className="text-slate-500 mb-4">{t("provider.no_services")}</p>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  {t("provider.create_first_service")}
                </button>
              </div>
            ) : (
              services.map(svc => (
                <div key={svc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between gap-4 group hover:border-slate-300 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-lg">{svc.name}</h3>
                    <p className="text-slate-600 text-sm mt-1">{svc.description}</p>
                    {svc.imageUrl && (
                      <div className="mt-3 relative w-32 h-20 rounded-lg overflow-hidden border border-slate-200">
                        <img src={svc.imageUrl} alt={svc.name} className="object-cover w-full h-full" />
                      </div>
                    )}
                    <div className="flex gap-4 mt-3">
                      <span dir="ltr" className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-bold">
                        {svc.price}
                      </span>
                      <span dir="ltr" className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs font-bold">
                        {svc.duration}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 shrink-0">
                    <button 
                      onClick={() => handleEditClick(svc)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(svc.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Col: Add/Edit Form */}
          {isEditing && (
            <div className="md:col-span-1 bg-white p-6 rounded-2xl border border-blue-200 shadow-lg sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
                {editingId ? t("provider.edit_service") : t("provider.add_new_service")}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">{t("provider.service_name")}</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t("placeholder.service_name")}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all bg-slate-50 focus:bg-white"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">{t("provider.service_photo")}</label>
                  <div className="flex items-center gap-4">
                    {formData.imageUrl ? (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                        <img src={formData.imageUrl} alt={t("alt.preview")} className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setFormData({ ...formData, imageUrl: '' })}
                          className="absolute inset-0 bg-black/50 text-white text-xs font-bold opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          {t("provider.remove")}
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center shrink-0">
                        <span className="text-slate-400 text-xs">{t("provider.no_image")}</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <FileInput
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                      {uploading && <p className="text-xs text-blue-600 mt-1 font-medium">{t("provider.uploading")}</p>}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">{t("provider.description")}</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder={t("placeholder.service_desc")}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-none transition-all bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">{t("provider.price")}</label>
                  <div className="flex border border-slate-300 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden transition-all bg-slate-50 focus-within:bg-white">
                    <input
                      required
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: e.target.value })}
                      placeholder={t("placeholder.service_price")}
                      className="flex-1 min-w-0 px-3 py-2 outline-none text-sm bg-transparent"
                    />
                    <span className="px-3 flex items-center bg-slate-100 border-s border-slate-300 text-slate-500 font-semibold text-sm">
                      MAD
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">{t("provider.duration")}</label>
                  <div className="flex border border-slate-300 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden transition-all bg-slate-50 focus-within:bg-white">
                    <input
                      required
                      type="number"
                      min="0"
                      value={formData.duration}
                      onChange={e => setFormData({ ...formData, duration: e.target.value })}
                      placeholder={t("placeholder.service_duration")}
                      className="flex-1 min-w-0 px-3 py-2 outline-none text-sm bg-transparent"
                    />
                    <span className="px-3 flex items-center bg-slate-100 border-s border-slate-300 text-slate-500 font-semibold text-sm">
                      {t("services.min")}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm"
                  >
                    {t("provider.cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors text-sm disabled:opacity-70 shadow-sm"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    {t("provider.save")}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
