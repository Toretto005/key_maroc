"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, CheckCircle2, Clock, XCircle, MoreVertical, Smartphone, FileText, Settings, Wrench } from 'lucide-react';
import Link from 'next/link';

type ServiceRequest = {
  id: number;
  providerId: number;
  serviceId: number;
  clientName: string;
  clientPhone: string;
  status: string;
  notes: string;
  createdAt: string;
  Service: {
    name: string;
  };
};

export default function Dashboard() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

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
      // Check if user has a provider profile
      fetch('/api/providers/me')
        .then(res => res.json())
        .then(data => {
          if (!data.provider) {
            router.push('/provider/new');
          } else {
            fetchRequests();
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
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      // Optimistic update
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      
      await fetch(`/api/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (e) {
      console.error(e);
      // Revert on error
      fetchRequests();
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
    <div className="min-h-screen bg-slate-50 py-10">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Maker Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage your incoming service requests.</p>
          </div>
          <div className="flex gap-2">
            <Link 
              href="/provider/services"
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl font-medium hover:bg-blue-100 transition-colors shadow-sm text-sm"
            >
              <Wrench className="w-4 h-4" />
              Manage Services
            </Link>
            <Link 
              href="/provider/edit"
              className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl font-medium hover:bg-amber-100 transition-colors shadow-sm text-sm"
            >
              <Settings className="w-4 h-4" />
              Edit Profile
            </Link>
            <Link 
              href="/"
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors shadow-sm text-sm"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Requests Yet</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              When clients find your profile and request a service, they will appear here. 
              Make sure your profile is fully updated!
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {requests.map(req => (
              <div key={req.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      req.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                      req.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-700' :
                      req.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {req.status}
                    </span>
                    <span className="text-slate-400 text-sm">
                      {new Date(req.createdAt).toLocaleString()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {req.Service?.name || 'General Service Request'}
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mt-3">
                    <div className="flex items-center gap-2 text-slate-600">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                        {req.clientName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-900">{req.clientName}</span>
                    </div>
                    <a href={`tel:${req.clientPhone}`} className="flex items-center gap-1.5 text-blue-600 hover:underline">
                      <Smartphone className="w-4 h-4" />
                      {req.clientPhone}
                    </a>
                  </div>

                  {req.notes && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-xl text-sm text-slate-600 flex gap-2">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <p>{req.notes}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 md:flex-col md:w-32 shrink-0">
                  {req.status === 'PENDING' && (
                    <>
                      <button 
                        onClick={() => updateStatus(req.id, 'ACCEPTED')}
                        className="flex-1 md:w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => updateStatus(req.id, 'REJECTED')}
                        className="flex-1 md:w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl text-sm transition-colors"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  
                  {req.status === 'ACCEPTED' && (
                    <button 
                      onClick={() => updateStatus(req.id, 'COMPLETED')}
                      className="flex-1 md:w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
                    >
                      Mark Complete
                    </button>
                  )}
                  
                  {(req.status === 'COMPLETED' || req.status === 'REJECTED') && (
                    <div className="w-full text-center py-2 text-slate-400 text-sm font-medium">
                      Archived
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
