"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { MessageSquare, ChevronDown, ArrowLeft, Loader2, Search, Filter, ClipboardList } from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import UserDropdown from '@/components/UserDropdown';

type ServiceRequest = {
  id: number;
  clientName: string;
  clientPhone: string;
  notes: string;
  status: string;
  createdAt: string;
  Service?: { name: string };
};

export default function OrdersPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [filter, setFilter] = useState('ALL');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/auth/login');
        return;
      }
      fetch('/api/providers/me')
        .then(res => res.json())
        .then(data => {
          if (data.provider) {
            setProfile(data.provider);
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

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
      } else {
        alert('Failed to update status');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to update status');
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'ALL') return true;
    if (filter === 'ACTIVE') return req.status === 'PENDING' || req.status === 'ACCEPTED';
    return req.status === filter;
  });

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
      <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center sticky top-0 z-40">
        <div className="text-slate-800 font-medium flex items-center gap-2 text-sm truncate max-w-[150px] sm:max-w-none">
          <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors mr-1 sm:mr-2 shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          {profile?.name || 'Loading...'} <span className="hidden sm:inline text-slate-400">| Locksmith Pro - Orders</span>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-[1400px] mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Manage Orders</h1>
          <p className="text-slate-600 text-sm mt-1">View and process all client service requests.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Controls Bar */}
          <div className="p-4 md:p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
            
            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
              {['ALL', 'ACTIVE', 'PENDING', 'COMPLETED'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                    filter === tab 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab === 'ALL' ? 'All Orders' : tab.charAt(0) + tab.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* Search/Filter */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search orders..." 
                  className="pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-slate-50 focus:bg-white"
                />
              </div>
              <button className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-900 font-bold bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        LOK-{req.id.toString().padStart(4, '0')}
                      </td>
                      <td className="px-6 py-4">
                        <Link 
                          href={`/provider/client/${encodeURIComponent(req.clientPhone)}?name=${encodeURIComponent(req.clientName)}`} 
                          className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors block"
                        >
                          {req.clientName}
                        </Link>
                        <div className="text-xs text-slate-500 mt-0.5">{req.clientPhone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-700">{req.Service?.name || 'Custom Request'}</div>
                        {req.notes && (
                          <div className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px]" title={req.notes}>
                            {req.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <div className="font-medium">{new Date(req.createdAt).toLocaleDateString()}</div>
                        <div className="text-xs text-slate-400">{new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full text-white inline-flex items-center
                          ${req.status === 'PENDING' ? 'bg-[#2a6892]' : 
                            req.status === 'COMPLETED' ? 'bg-emerald-600' :
                            'bg-[#1b85ce]'}
                        `}>
                          {req.status === 'PENDING' ? 'Pending' : req.status === 'ACCEPTED' ? 'In Progress' : req.status === 'COMPLETED' ? 'Completed' : req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {req.status === 'PENDING' ? (
                            <>
                              <button 
                                onClick={() => handleUpdateStatus(req.id, 'ACCEPTED')}
                                className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                              >
                                Accept
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                                className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                              >
                                Decline
                              </button>
                            </>
                          ) : req.status === 'ACCEPTED' ? (
                            <button 
                              onClick={() => handleUpdateStatus(req.id, 'COMPLETED')}
                              className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
                            >
                              Mark Complete
                            </button>
                          ) : (
                            <button className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                              View Details
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                        <ClipboardList className="w-6 h-6 text-slate-400" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mb-1">No orders found</h3>
                      <p className="text-sm text-slate-500">
                        {filter === 'ALL' ? "You don't have any service requests yet." : `No orders matching filter: ${filter}`}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination (Static UI for now) */}
          {filteredRequests.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Showing <span className="font-bold text-slate-900">{filteredRequests.length}</span> results
              </span>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1 border border-slate-300 rounded-md text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-50" disabled>Prev</button>
                <button className="px-3 py-1 border border-slate-300 rounded-md text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-50" disabled>Next</button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
