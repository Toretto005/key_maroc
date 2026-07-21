"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  Plus, Pencil, Trash2, Loader2, X, Check, Clock, Tag, AlignLeft
} from 'lucide-react';

type Service = {
  id: number;
  name: string;
  description: string;
  price: string;
  duration: string;
  imageUrl?: string;
};

type Props = {
  providerId: number;
  providerUserId: string | null;
};

const emptyForm = { name: '', description: '', price: '', duration: '' };

export default function ServicesSection({ providerId, providerUserId }: Props) {
  const { t } = useLanguage();
  const supabase = createClient();
  const [services, setServices] = useState<Service[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Request modal state
  const [requestingService, setRequestingService] = useState<Service | null>(null);
  const [reqForm, setReqForm] = useState({ name: '', phone: '', notes: '' });
  const [sendingRequest, setSendingRequest] = useState(false);

  const fetchServices = useCallback(async () => {
    const res = await fetch(`/api/providers/${providerId}/services`);
    const data = await res.json();
    setServices(data.services ?? []);
    setLoading(false);
  }, [providerId]);

  useEffect(() => {
    fetchServices();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsOwner(!!user && user.id === providerUserId);
      if (user) {
        setReqForm(prev => ({
          ...prev,
          name: user.user_metadata?.full_name || prev.name,
          phone: user.user_metadata?.phone || prev.phone
        }));
      }
    });
  }, [fetchServices, providerUserId, supabase.auth]);

  const openAdd = () => {
    setEditingService(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (s: Service) => {
    setEditingService(s);
    // Strip " MAD" suffix when loading into the numeric input
    const rawPrice = s.price.replace(/\s*MAD$/i, '');
    setForm({ name: s.name, description: s.description, price: rawPrice, duration: s.duration });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name) return;
    setSaving(true);
    try {
      const priceFormatted = form.price ? `${form.price} MAD` : '';
      const payload = { ...form, price: priceFormatted };
      if (editingService) {
        await fetch(`/api/services/${editingService.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`/api/providers/${providerId}/services`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      await fetchServices();
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    await fetch(`/api/services/${id}`, { method: 'DELETE' });
    await fetchServices();
    setDeletingId(null);
  };

  const handleRequestSubmit = async () => {
    if (!reqForm.name || !reqForm.phone || !requestingService) return;
    setSendingRequest(true);
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId,
          serviceId: requestingService.id,
          clientName: reqForm.name,
          clientPhone: reqForm.phone,
          notes: reqForm.notes,
        })
      });
      if (!res.ok) throw new Error('Failed to send request');
      alert('Request sent successfully! The provider will contact you soon.');
      setRequestingService(null);
      setReqForm({ name: '', phone: '', notes: '' });
    } catch (e) {
      console.error(e);
      alert('Error sending request. Please try again.');
    } finally {
      setSendingRequest(false);
    }
  };

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900">{t("services.offered")}</h2>
        {isOwner && (
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        )}
      </div>

      {/* Services list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-400 text-sm">{t("services.no_services")}</p>
          {isOwner && (
            <button onClick={openAdd} className="mt-3 text-blue-600 text-sm font-medium hover:underline">
              + Add your first service
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map(s => (
            <div key={s.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative group">
              {isOwner && (
                <div className="absolute top-3 end-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={() => openEdit(s)}
                    className="p-1.5 rounded-lg bg-white/80 backdrop-blur shadow-sm hover:bg-white text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    disabled={deletingId === s.id}
                    className="p-1.5 rounded-lg bg-white/80 backdrop-blur shadow-sm hover:bg-white text-slate-600 hover:text-red-500 transition-colors"
                  >
                    {deletingId === s.id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Trash2 className="w-4 h-4" />
                    }
                  </button>
                </div>
              )}

              {s.imageUrl && (
                <div className="w-[calc(100%+2.5rem)] h-32 -mt-5 -ms-5 mb-4 rounded-t-2xl overflow-hidden bg-slate-100 shrink-0">
                  <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover" />
                </div>
              )}

              <h3 className="font-bold text-slate-900 text-base mb-1 pe-16">{s.name}</h3>
              {s.description && (
                <p className="text-slate-500 text-sm mb-3">{s.description}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {s.price && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                    <Tag className="w-3 h-3" />
                    {s.price}
                  </span>
                )}
                {s.duration && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                    <Clock className="w-3 h-3" />
                    {s.duration}
                  </span>
                )}
              </div>
              
              {!isOwner && (
                <button
                  onClick={() => setRequestingService(s)}
                  className="mt-4 w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-sm rounded-xl transition-colors"
                >
                  {t("provider.request_service")}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Service Name *</label>
                <input
                  autoFocus
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder={t("placeholder.service_name_alt")}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5"><AlignLeft className="w-3.5 h-3.5" /> {t("services.description")}</span>
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder={t("placeholder.brief_desc")}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> {t("services.price")}</span>
                  </label>
                  <div className="flex rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden transition-all">
                    <input
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                      placeholder="150"
                      className="flex-1 px-4 py-3 outline-none text-sm bg-white"
                    />
                    <span className="px-3 flex items-center bg-slate-50 border-s border-slate-200 text-slate-500 font-semibold text-sm">
                      MAD
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {t("services.duration")}</span>
                  </label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={e => setForm({ ...form, duration: e.target.value })}
                    placeholder={t("placeholder.duration_alt")}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold transition-colors"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {saving ? 'Saving…' : (editingService ? 'Save Changes' : 'Add Service')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Service Modal */}
      {requestingService && (
        <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                Request {requestingService.name}
              </h3>
              <button onClick={() => setRequestingService(null)} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Name *</label>
                <input
                  autoFocus
                  type="text"
                  value={reqForm.name}
                  onChange={e => setReqForm({ ...reqForm, name: e.target.value })}
                  placeholder={t("placeholder.name_ali")}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number *</label>
                <input
                  type="tel"
                  value={reqForm.phone}
                  onChange={e => setReqForm({ ...reqForm, phone: e.target.value })}
                  placeholder={t("placeholder.phone_alt")}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={reqForm.notes}
                  onChange={e => setReqForm({ ...reqForm, notes: e.target.value })}
                  placeholder={t("placeholder.any_details")}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setRequestingService(null)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestSubmit}
                disabled={sendingRequest || !reqForm.name || !reqForm.phone}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold transition-colors"
              >
                {sendingRequest ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {sendingRequest ? 'Sending…' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
