"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { CalendarDays, X, Loader2, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function RequestQuoteModal({ providerId }: { providerId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientAvatar: '',
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      // Try to pre-fill user details if logged in
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user && user.user_metadata) {
          setFormData(prev => ({
            ...prev,
            clientName: prev.clientName || user.user_metadata.full_name || '',
            clientPhone: prev.clientPhone || user.user_metadata.phone || '',
            clientAvatar: prev.clientAvatar || user.user_metadata.avatar_url || ''
          }));
        }
      });
    }
    setMounted(true);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId,
          clientName: formData.clientName,
          clientPhone: formData.clientPhone,
          clientAvatar: formData.clientAvatar,
          notes: formData.notes
        })
      });

      if (!res.ok) {
        throw new Error('Failed to submit request');
      }

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setFormData({ clientName: '', clientPhone: '', clientAvatar: '', notes: '' });
      }, 3000);
    } catch (error) {
      console.error(error);
      alert(t("request_quote.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenClick = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth/login');
      return;
    }
    setIsOpen(true);
  };

  return (
    <>
      <button 
        onClick={handleOpenClick}
        className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-medium transition-colors"
      >
        <CalendarDays className="w-5 h-5" />
        {t("request_quote.button")}
      </button>

      {mounted && isOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative z-10">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">{t("request_quote.title")}</h3>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {success ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{t("request_quote.sent_title")}</h4>
                  <p className="text-slate-500">{t("request_quote.sent_desc")}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">{t("request_quote.your_name")}</label>
                    <input
                      required
                      type="text"
                      value={formData.clientName}
                      onChange={e => setFormData({...formData, clientName: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder={t("placeholder.john_doe")}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">{t("profile.phone_number")}</label>
                    <input
                      required
                      type="tel"
                      value={formData.clientPhone}
                      onChange={e => setFormData({...formData, clientPhone: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="+212 6 00 00 00 00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">{t("request_quote.details")}</label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={e => setFormData({...formData, notes: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                      placeholder={t("placeholder.help_desc")}
                    ></textarea>
                  </div>
                  
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-70 shadow-sm"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t("request_quote.send")}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      , document.body)}
    </>
  );
}
