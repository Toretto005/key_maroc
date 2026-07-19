"use client";

import { useState, useEffect, useRef } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NotificationBell() {
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/requests')
      .then(res => res.json())
      .then(data => {
        if (data.requests) {
          const pending = data.requests.filter((r: any) => r.status === 'PENDING');
          setPendingRequests(pending);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-slate-400 hover:text-slate-600 relative p-1 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {!loading && pendingRequests.length > 0 && (
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse shadow-sm"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-[-4rem] sm:right-0 mt-3 w-[320px] max-w-[90vw] sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-[100] transform origin-top transition-all">
          <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800">Notifications</h3>
            {pendingRequests.length > 0 && (
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {pendingRequests.length} New
              </span>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-8 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>
            ) : pendingRequests.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <Bell className="w-8 h-8 text-slate-200 mb-2" />
                <span className="text-sm text-slate-500 font-medium">You're all caught up!</span>
              </div>
            ) : (
              <div className="flex flex-col">
                {pendingRequests.slice(0, 5).map(req => (
                  <Link 
                    key={req.id} 
                    href="/dashboard/orders"
                    onClick={() => setIsOpen(false)}
                    className="p-3 border-b border-slate-50 hover:bg-blue-50/50 transition-colors flex flex-col gap-1 group"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-sm text-slate-800 group-hover:text-blue-700 transition-colors truncate pr-2">
                        {req.clientName}
                      </span>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 shrink-0">
                        PENDING
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 truncate">
                      Requested: {req.Service?.name || 'General Locksmith Service'}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-2 border-t border-slate-100 bg-slate-50">
            <Link 
              href="/dashboard/orders" 
              onClick={() => setIsOpen(false)}
              className="block w-full text-center text-xs font-bold text-blue-600 hover:text-blue-700 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
            >
              View all orders
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
