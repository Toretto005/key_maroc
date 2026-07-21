"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Loader2, ArrowLeft, User, Phone, ClipboardList, Wrench, Calendar, StickyNote } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

type ServiceRequest = {
  id: number;
  clientName: string;
  clientPhone: string;
  clientAvatar?: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
  Service?: { name: string; imageUrl?: string | null } | null;
};

export default function OrderDetailPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [profile, setProfile] = useState<any>(null);
  const [order, setOrder] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/auth/login');
        return;
      }
      fetch('/api/providers/me')
        .then(res => res.json())
        .then(data => {
          if (data.provider) setProfile(data.provider);
        })
        .catch(console.error);
    });

    fetchOrder();
  }, [id, router]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/requests');
      if (res.ok) {
        const data = await res.json();
        const found = (data.requests || []).find((r: ServiceRequest) => r.id.toString() === id);
        setOrder(found || null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!order) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/requests/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setOrder(prev => prev ? { ...prev, status } : prev);
      } else {
        alert('Failed to update status');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
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
      <header className="h-14 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center sticky top-0 z-30 shadow-sm">
        <div className="text-slate-800 font-medium flex items-center gap-2 text-sm">
          <Link href="/dashboard/orders" className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>{t("client_detail.back")}</span>
          </Link>
          <span className="text-slate-300 mx-2">/</span>
          <span className="text-slate-900 font-bold truncate max-w-[150px] sm:max-w-none">{profile?.name || t("dashboard.loading")}</span>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-[900px] mx-auto">
        {!order ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
            <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">{t("orders.order_not_found")}</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {t("orders.detail_title")} — LOK-{order.id.toString().padStart(4, '0')}
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  {new Date(order.createdAt).toLocaleDateString()} · {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <span className={`px-3 py-1.5 text-xs font-bold rounded-full text-white inline-flex items-center whitespace-nowrap
                ${order.status === 'PENDING' ? 'bg-[#2a6892]' :
                  order.status === 'COMPLETED' ? 'bg-emerald-600' :
                  order.status === 'REJECTED' ? 'bg-slate-400' :
                  'bg-[#1b85ce]'}
              `}>
                {order.status === 'PENDING' ? t("orders.status.pending") :
                 order.status === 'ACCEPTED' ? t("orders.status.in_progress") :
                 order.status === 'COMPLETED' ? t("orders.status.completed") :
                 order.status === 'REJECTED' ? t("orders.status.rejected") : order.status}
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Client Details */}
              <div className="w-full md:w-1/3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  {t("orders.client_details")}
                </h2>
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                  {order.clientAvatar ? (
                    <img src={order.clientAvatar} alt={order.clientName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold">{order.clientName.charAt(0)}</span>
                  )}
                </div>
                <div className="font-bold text-slate-900 text-lg">{order.clientName}</div>
                <div dir="ltr" className="flex items-center gap-1.5 text-slate-500 text-sm mt-1 text-end">
                  <Phone className="w-4 h-4" />
                  {order.clientPhone}
                </div>

                <div className="flex flex-col gap-2 mt-5">
                  <a
                    href={`tel:${order.clientPhone}`}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-bold text-sm transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {t("common.call")}
                  </a>
                  <Link
                    href={`/provider/client/${encodeURIComponent(order.clientPhone)}?name=${encodeURIComponent(order.clientName)}`}
                    className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-bold text-sm transition-colors"
                  >
                    {t("common.view_profile")}
                  </Link>
                </div>
              </div>

              {/* Order / Service Details */}
              <div className="w-full md:w-2/3 flex flex-col gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-blue-600" />
                    {t("orders.service_details")}
                  </h2>
                  {order.Service?.imageUrl && (
                    <div className="w-full h-40 rounded-xl overflow-hidden bg-slate-100 mb-4">
                      <img src={order.Service.imageUrl} alt={order.Service.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="font-medium text-slate-900">{order.Service?.name || t("provider.service_request_fallback")}</div>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                      <StickyNote className="w-4 h-4" />
                      {t("orders.notes")}
                    </div>
                    <p className="text-slate-700 text-sm whitespace-pre-wrap">
                      {order.notes || t("orders.no_notes")}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    {new Date(order.createdAt).toLocaleDateString()} · {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* Actions */}
                {(order.status === 'PENDING' || order.status === 'ACCEPTED') && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center gap-3">
                    {order.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleUpdateStatus('ACCEPTED')}
                          disabled={updating}
                          className="px-4 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                        >
                          {t("orders.accept")}
                        </button>
                        <button
                          onClick={() => handleUpdateStatus('REJECTED')}
                          disabled={updating}
                          className="px-4 py-2.5 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
                        >
                          {t("orders.decline")}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus('COMPLETED')}
                        disabled={updating}
                        className="px-4 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                      >
                        {t("orders.mark_complete")}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
