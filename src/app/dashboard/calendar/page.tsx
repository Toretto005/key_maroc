"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { MessageSquare, ChevronDown, ArrowLeft, ChevronLeft, ChevronRight, Loader2, Calendar as CalendarIcon, Clock, CheckCircle2, XCircle } from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import UserDropdown from '@/components/UserDropdown';
import BackButton from '@/components/BackButton';
import { useLanguage } from '@/lib/i18n/LanguageContext';

type ServiceRequest = {
  id: number;
  clientName: string;
  clientPhone: string;
  notes: string;
  status: string;
  createdAt: string;
  Service?: { name: string };
};

export default function CalendarPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { t } = useLanguage();
  
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
          } else {
            router.push('/provider/new');
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

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const today = new Date();
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const daysArray: (Date | null)[] = [];
  
  // Pad empty days
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push(null);
  }
  
  // Actual days
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(new Date(year, month, i));
  }

  const getRequestsForDay = (date: Date) => {
    return requests.filter(req => {
      const reqDate = new Date(req.createdAt);
      return reqDate.getFullYear() === date.getFullYear() && 
             reqDate.getMonth() === date.getMonth() && 
             reqDate.getDate() === date.getDate();
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'DECLINED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200'; // PENDING
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACCEPTED': return <CheckCircle2 className="w-3 h-3 inline me-1" />;
      case 'COMPLETED': return <CheckCircle2 className="w-3 h-3 inline me-1" />;
      case 'DECLINED': return <XCircle className="w-3 h-3 inline me-1" />;
      default: return <Clock className="w-3 h-3 inline me-1" />; // PENDING
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const monthNames = t("calendar.months").split(',');
  const dayNames = t("calendar.days").split(',');

  return (
    <div className="min-h-screen bg-[#f1f5f9] w-full font-sans">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center sticky top-0 z-40">
        <div className="text-slate-800 font-medium flex items-center gap-2 text-sm">
          <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors me-1">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="truncate max-w-[120px] sm:max-w-none">{profile?.name || t("dashboard.loading")}</span>
          <span className="hidden sm:inline text-slate-400">| Locksmith Pro</span>
        </div>
      </header>

      <main className="p-4 md:p-6 max-w-[1400px] mx-auto">
        <div className="mb-2">
          <BackButton />
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
              {t("provider.calendar_title")}
            </h1>
            <p className="text-slate-500 text-sm mt-1">{t("provider.calendar_subtitle")}</p>
          </div>
          
          <div className="flex items-center bg-white rounded-xl border border-slate-200 shadow-sm p-1">
            <button 
              onClick={prevMonth}
              className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="w-40 text-center font-bold text-slate-800">
              {monthNames[month]} {year}
            </div>
            <button 
              onClick={nextMonth}
              className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Calendar Header */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
            {dayNames.map(day => (
              <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.charAt(0)}</span>
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 bg-slate-200 gap-px">
            {daysArray.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="bg-slate-50 min-h-[120px] p-2"></div>;
              }
              
              const isToday = date.getDate() === today.getDate() && 
                              date.getMonth() === today.getMonth() && 
                              date.getFullYear() === today.getFullYear();
                              
              const dayRequests = getRequestsForDay(date);
              
              return (
                <div key={date.toISOString()} className={`min-h-[120px] p-2 transition-colors ${isToday ? 'bg-blue-50/50' : 'bg-white'}`}>
                  <div className={`text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full mb-2 ${isToday ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700'}`}>
                    {date.getDate()}
                  </div>
                  
                  <div className="space-y-1.5 flex flex-col">
                    {dayRequests.map(req => (
                      <Link 
                        key={req.id}
                        href="/dashboard/orders"
                        className={`text-[11px] p-1.5 rounded-lg border flex flex-col gap-0.5 hover:opacity-80 transition-opacity ${getStatusColor(req.status)}`}
                      >
                        <div className="font-bold truncate" title={req.clientName}>
                          {req.clientName}
                        </div>
                        <div className="truncate opacity-90 flex items-center">
                          {getStatusIcon(req.status)}
                          {req.Service?.name || t("provider.general_request")}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
