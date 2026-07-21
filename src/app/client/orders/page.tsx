"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, CheckCircle2, User, Phone, ArrowLeft, Bell, ChevronDown, Clock, History, XCircle } from 'lucide-react';
import Link from 'next/link';
import BackButton from '@/components/BackButton';
import { useLanguage } from '@/lib/i18n/LanguageContext';

type ServiceRequest = {
  id: number;
  status: string;
  createdAt: string;
  Service?: { name: string };
  Provider?: { name: string; phone: string };
};

export default function ClientOrders() {
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState('');
  const { t } = useLanguage();

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
      
      setFullName(user.user_metadata?.full_name || '');
      setLoading(false);

      // Fetch client requests
      fetch('/api/client/requests')
        .then(res => res.json())
        .then(data => {
          if (data.requests) setRequests(data.requests);
        })
        .catch(console.error)
        .finally(() => setRequestsLoading(false));
    });
  }, [router, supabase]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'ACCEPTED': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'COMPLETED': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'REJECTED': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-3.5 h-3.5 me-1" />;
      case 'ACCEPTED': return <CheckCircle2 className="w-3.5 h-3.5 me-1" />;
      case 'COMPLETED': return <CheckCircle2 className="w-3.5 h-3.5 me-1" />;
      case 'REJECTED': return <XCircle className="w-3.5 h-3.5 me-1" />;
      default: return null;
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


      <main className="p-4 md:p-6 max-w-[1000px] mx-auto min-h-[80vh]">
        <div className="mb-6">
          <BackButton />
        </div>
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{t("orders.title")}</h2>
              <p className="text-slate-500 text-sm">{t("orders.subtitle")}</p>
            </div>
          </div>

          {requestsLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : requests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((req) => (
                <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all flex flex-col h-full group">
                  <div className="flex justify-between items-start mb-6">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(req.status)}`}>
                      {getStatusIcon(req.status)}
                      {req.status === 'PENDING' ? t("orders.pending") : 
                       req.status === 'ACCEPTED' ? t("orders.accepted") : 
                       req.status === 'COMPLETED' ? t("orders.completed") : 
                       t("orders.rejected")}
                    </span>
                    <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                      #{req.id.toString().padStart(4, '0')}
                    </span>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t("orders.service")}</p>
                      <p className="font-semibold text-slate-900">{req.Service?.name || 'General Request'}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t("orders.provider")}</p>
                      <p className="font-medium text-slate-700 flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        {req.Provider?.name || 'Not assigned yet'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t("orders.date")}</p>
                      <p className="text-sm font-medium text-slate-600">
                        {new Date(req.createdAt).toLocaleDateString(undefined, { 
                          year: 'numeric', month: 'long', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <History className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-semibold text-slate-700 mb-2">{t("orders.no_orders")}</p>
              <p className="text-slate-500 mb-6">{t("orders.no_orders_desc")}</p>
              <Link 
                href="/search"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-sm shadow-blue-200"
              >
                {t("home.search_button")}
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
