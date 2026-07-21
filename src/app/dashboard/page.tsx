"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, MessageSquare, ChevronDown, Clock, Smartphone, Settings, Star, Mail, MapPin, Award, CheckCircle2, DollarSign, Activity, KeyRound, Lock, User, AlertCircle } from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import UserDropdown from '@/components/UserDropdown';
import BackButton from '@/components/BackButton';
import { useLanguage } from '@/lib/i18n/LanguageContext';

type ServiceRequest = {
  id: number;
  clientName: string;
  clientPhone: string;
  locationDetails?: string;
  latitude: number;
  longitude: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
  notes: string;
  createdAt: string;
  Service: {
    name: string;
  };
};

export default function Dashboard() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();
  const { t } = useLanguage();

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
            fetchRequests();
            fetchServices();
          }
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    });
  }, [router, supabase]);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const activeOrders = requests.filter(r => r.status === 'PENDING' || r.status === 'ACCEPTED').length;
  const completedOrders = requests.filter(r => r.status === 'COMPLETED').length;

  return (
    <div className="min-h-screen bg-[#f1f5f9] w-full font-sans">
      
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center sticky top-0 z-40">
        <div className="text-slate-800 font-medium text-sm truncate max-w-[150px] sm:max-w-none">
          {profile?.name || t("dashboard.loading")} <span className="hidden sm:inline text-slate-400">| {t("dashboard.title_dashboard")}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-4 md:p-8 max-w-[1400px] mx-auto">
        
        {/* Title above banner */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="mb-2">
              <BackButton />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{t("provider.dashboard_title")}</h1>
            <p className="text-slate-600 text-sm">{t("provider.dashboard_subtitle")}</p>
          </div>
        </div>

        {/* Dashboard Content Container */}
        <div className="flex flex-col border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
          <div className="h-14 border-b border-slate-200 flex items-center px-4 md:px-8 bg-white">
             <h3 className="text-[15px] font-semibold text-slate-800">{t("provider.dashboard_overview")}</h3>
          </div>
          
          <div className="p-4 md:p-8 bg-[#f3f4f6] flex-1">
            
            {/* Quick Stats */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-end mb-8 gap-4">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-[13px] bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-sm">
                <span className="text-slate-600 whitespace-nowrap">{t("provider.active_orders")} <strong className="text-slate-900 font-bold">{activeOrders}</strong></span>
                <span className="text-slate-300 hidden sm:inline">|</span>
                <span className="text-slate-600 whitespace-nowrap">{t("provider.completed")} <strong className="text-slate-900 font-bold">{completedOrders}</strong></span>
                <span className="text-slate-300 hidden sm:inline">|</span>
                <span className="text-slate-600 whitespace-nowrap">{t("provider.services")} <strong className="text-slate-900 font-bold">{services.length}</strong></span>
                <span className="text-slate-300 hidden sm:inline">|</span>
                <span className="text-slate-600 whitespace-nowrap">{t("provider.revenue")} <strong className="text-slate-900 font-bold">{t("provider.mad")} 0</strong> <span className="hidden sm:inline">{t("provider.this_week")}</span></span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
               <h4 className="font-bold text-slate-900">{t("provider.orders")}</h4>
               <h4 className="font-bold text-slate-900">{t("nav.services")}</h4>
            </div>

            {/* Current Orders Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
              <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-white">
                <h4 className="font-bold text-slate-900 text-sm">{t("provider.current_orders")}</h4>
                <span className="text-xs text-slate-500">5 {t("dashboard.recent")}</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-[13px] text-start">
                  <thead className="text-xs text-slate-900 font-bold bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-5 py-3 font-bold text-start">{t("provider.order_id")}</th>
                      <th className="px-5 py-3 font-bold text-start">{t("provider.customer")}</th>
                      <th className="px-5 py-3 font-bold text-start">{t("provider.service_type")}</th>
                      <th className="px-5 py-3 font-bold text-start">{t("provider.status")}</th>
                      <th className="px-5 py-3 font-bold text-start">{t("provider.order_date")}</th>
                      <th className="px-5 py-3 font-bold text-start">{t("provider.action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.length > 0 ? (
                      requests.slice(0, 5).map(req => (
                        <tr key={req.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3 font-medium text-slate-900">LOK-{req.id.toString().padStart(4, '0')}</td>
                          <td className="px-5 py-3 text-slate-600">{req.clientName}</td>
                          <td className="px-5 py-3 text-slate-600">{req.Service?.name || t("provider.service_request_fallback")}</td>
                          <td className="px-5 py-3">
                            <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full text-white inline-flex items-center whitespace-nowrap
                              ${req.status === 'PENDING' ? 'bg-[#2a6892]' : 'bg-[#1b85ce]'}
                            `}>
                              {req.status === 'PENDING' ? t("orders.status.pending") : req.status === "ACCEPTED" ? t("orders.status.in_progress") : req.status}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-slate-600">{new Date(req.createdAt).toLocaleDateString()}</td>
                          <td className="px-5 py-3">
                            <Link href={`/dashboard/orders/${req.id}`} className="text-slate-900 font-medium hover:underline">{t("provider.view")}</Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                          {t("provider.no_current_orders")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Services Managed */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-900">{t("provider.services_managed")}</h4>
                <Link href="/provider/services" className="text-sm font-bold text-blue-600 hover:underline">{t("provider.view_all")}</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {services.length > 0 ? (
                  services.slice(0,4).map((service, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col hover:border-slate-300 transition-colors">
                      {service.imageUrl ? (
                        <div className="w-full h-24 -mt-4 -ms-4 mb-3 rounded-t-xl overflow-hidden bg-slate-100" style={{ width: 'calc(100% + 2rem)' }}>
                          <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#e8f1f8] flex items-center justify-center text-[#2a6892] mb-3">
                          <KeyRound className="w-5 h-5" />
                        </div>
                      )}
                      <h5 className="font-bold text-slate-900 text-sm leading-tight mb-0.5">{service.name}</h5>
                      <span className="text-[11px] font-bold text-emerald-600 mb-2">
                        {t("provider.active")}
                      </span>
                      <div className="mt-auto">
                        {service.duration && (
                          <p className="text-[11px] text-slate-500 mb-1">
                            {t("provider.duration")}: <span dir="ltr" className="font-semibold text-slate-700">{service.duration}</span>
                          </p>
                        )}
                        <p className="text-[11px] text-slate-500">{t("provider.base_price")}</p>
                        <div className="flex items-center justify-between mt-0.5">
                          <span dir="ltr" className="font-bold text-slate-900 text-sm">{service.price}</span>
                          <div className="flex gap-1">
                             <Link href="/provider/services" className="px-3 py-1.5 text-xs font-bold text-white bg-[#112331] hover:bg-slate-800 rounded-md transition-colors shadow-sm">
                               {t("common.edit")}
                             </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center bg-white border border-slate-200 rounded-xl">
                    <p className="text-slate-500 text-sm mb-3">{t("provider.no_services")}</p>
                    <Link href="/provider/services" className="text-sm font-bold text-blue-600 hover:underline">{t("provider.create_first_service")}</Link>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
