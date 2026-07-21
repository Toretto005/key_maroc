"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, CheckCircle2, User, Phone, Save, Upload, Image as ImageIcon, Mail } from 'lucide-react';
import Link from 'next/link';
import BackButton from '@/components/BackButton';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function ClientSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    avatarUrl: '',
  });
  const [uploadingImage, setUploadingImage] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const { error } = await supabase.auth.updateUser({
        email: formData.email,
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
          avatar_url: formData.avatarUrl
        }
      });

      if (error) throw error;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      console.error(error);
      alert(error.message || t("settings.error"));
    } finally {
      setSaving(false);
    }
  };

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
        <div className="mb-6">
          <BackButton />
        </div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
            <Save className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{t("settings.title")}</h2>
            <p className="text-slate-500 text-sm">{t("settings.subtitle")}</p>
          </div>
        </div>

        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex-1 max-w-md">
              <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">{t("auth.full_name")}</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  required
                  type="text"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full ps-10 pe-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder={t("placeholder.john_doe")}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">{t("auth.email")}</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full ps-10 pe-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder={t("placeholder.john_email")}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">{t("profile.phone_number")}</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full ps-10 pe-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="+212 6 00 00 00 00"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-70 shadow-sm mt-4"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : t("settings.save")}
            </button>

              {success && (
                <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 py-3 rounded-xl text-sm font-bold border border-green-200 mt-4">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  {t("settings.success")}
                </div>
              )}
            </form>
          </div>

          <div className="w-full sm:w-64 shrink-0">
            <label className="block text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide">{t("settings.profile_image")}</label>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-sm mb-4 relative group">
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt={t("alt.profile")} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <User className="w-12 h-12" />
                  </div>
                )}
                
                <label className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-all">
                  {uploadingImage ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6 text-white" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingImage}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      setUploadingImage(true);
                      try {
                        const fileExt = file.name.split('.').pop();
                        const fileName = `client_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

                        const { error: uploadError } = await supabase.storage
                          .from('provider_avatars')
                          .upload(fileName, file);

                        if (uploadError) throw uploadError;

                        const { data } = supabase.storage
                          .from('provider_avatars')
                          .getPublicUrl(fileName);

                        setFormData({ ...formData, avatarUrl: data.publicUrl });
                      } catch (err: any) {
                        alert(t("client_settings.error_image") + err.message);
                      } finally {
                        setUploadingImage(false);
                      }
                    }}
                  />
                </label>
              </div>
              <p className="text-xs text-slate-500 text-center">{t("settings.upload_hint")}</p>
            </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
