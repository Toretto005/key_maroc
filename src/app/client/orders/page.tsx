"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, CheckCircle2, User, Phone, ArrowLeft, Bell, ChevronDown, Clock, History, XCircle } from 'lucide-react';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

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
      case 'PENDING': return <Clock className="w-3.5 h-3.5 mr-1" />;
      case 'ACCEPTED': return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
      case 'COMPLETED': return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
      case 'REJECTED': return <XCircle className="w-3.5 h-3.5 mr-1" />;
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
              <h2 className="text-xl font-bold text-slate-900">Your Orders</h2>
              <p className="text-slate-500 text-sm">Track your service requests and their status.</p>
            </div>
          </div>

          {requestsLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">You haven't requested any services yet.</p>
              <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block font-semibold">
                Browse Services
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map(req => (
                <div key={req.id} className="p-5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white transition-colors hover:shadow-sm group">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">
                        {req.Service?.name || 'General Locksmith Service'}
                      </h3>
                      <div className="flex flex-col gap-1 mt-2 text-sm text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-700">{req.Provider?.name || 'Unknown Provider'}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <a href={`tel:${req.Provider?.phone}`} className="hover:text-blue-600 transition-colors">
                            {req.Provider?.phone || 'No phone'}
                          </a>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 border-slate-200 pt-3 sm:pt-0">
                      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-lg border uppercase tracking-wider ${getStatusColor(req.status)}`}>
                        {getStatusIcon(req.status)}
                        {req.status}
                      </span>
                      <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
