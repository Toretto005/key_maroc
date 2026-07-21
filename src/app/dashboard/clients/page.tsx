"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, User, Phone, Calendar, History, Clock, CheckCircle2, XCircle } from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import UserDropdown from '@/components/UserDropdown';
import BackButton from '@/components/BackButton';
import { useLanguage } from '@/lib/i18n/LanguageContext';

type ServiceRequest = {
  id: number;
  clientName: string;
  clientPhone: string;
  clientAvatar?: string;
  status: string;
  createdAt: string;
  Service?: {
    name: string;
  };
};

type Client = {
  name: string;
  phone: string;
  avatarUrl?: string;
  totalOrders: number;
  activeOrders: number;
  history: ServiceRequest[];
};

export default function ClientsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    // Fetch profile
    fetch('/api/providers/me')
      .then(res => res.json())
      .then(data => {
        if (data.provider) setProfile(data.provider);
      })
      .catch(console.error);

    // Fetch requests and group by client
    fetch('/api/requests')
      .then(res => res.json())
      .then(data => {
        if (data.requests) {
          const clientMap = new Map<string, Client>();
          
          data.requests.forEach((req: ServiceRequest) => {
            const key = req.clientPhone;
            if (!clientMap.has(key)) {
              clientMap.set(key, {
                name: req.clientName,
                phone: req.clientPhone,
                avatarUrl: req.clientAvatar,
                totalOrders: 0,
                activeOrders: 0,
                history: []
              });
            }
            
            const client = clientMap.get(key)!;
            client.history.push(req);
            client.totalOrders++;
            if (req.status === 'PENDING' || req.status === 'ACCEPTED') {
              client.activeOrders++;
            }
          });

          // Sort history for each client by date descending
          const clientArray = Array.from(clientMap.values()).map(c => {
            c.history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            return c;
          });

          // Sort clients by most recent activity
          clientArray.sort((a, b) => new Date(b.history[0].createdAt).getTime() - new Date(a.history[0].createdAt).getTime());
          
          setClients(clientArray);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'ACCEPTED': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'COMPLETED': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'REJECTED': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'PENDING': return <Clock className="w-3 h-3 me-1" />;
      case 'ACCEPTED': return <CheckCircle2 className="w-3 h-3 me-1" />;
      case 'COMPLETED': return <CheckCircle2 className="w-3 h-3 me-1" />;
      case 'REJECTED': return <XCircle className="w-3 h-3 me-1" />;
      default: return null;
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-50 w-full font-sans pb-12">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center sticky top-0 z-40">
        <div className="text-slate-800 font-medium flex items-center gap-2 text-sm truncate max-w-[150px] sm:max-w-none">
          <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors me-1 sm:me-2 shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          {t("dashboard.provider")} <span className="hidden sm:inline text-slate-400">| {t("dashboard.title_clients")}</span>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-[1400px] mx-auto">
        <div className="mb-2">
          <BackButton />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t("provider.clients_title")}</h1>
            <p className="text-slate-500 text-sm mt-1">{t("provider.clients_subtitle")}</p>
          </div>
          <div className="w-full sm:w-auto">
            <input 
              type="text" 
              placeholder={t("provider.search_clients")} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-72 px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">{t("provider.no_clients_found")}</h3>
            <p className="text-slate-500">{t("provider.no_clients_desc")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredClients.map((client, index) => (
              <div key={index} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Card Header */}
                <div className="p-5 border-b border-slate-100 flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {client.avatarUrl ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 shrink-0">
                        <img src={client.avatarUrl} alt={client.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shrink-0">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-slate-900">{client.name}</h3>
                      <div className="flex items-center text-sm text-slate-500 mt-0.5">
                        <Phone className="w-3.5 h-3.5 me-1.5" />
                        {client.phone}
                      </div>
                    </div>
                  </div>
                  {client.activeOrders > 0 && (
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded border border-blue-200 whitespace-nowrap">
                      {t("provider.active_reservation")}
                    </span>
                  )}
                </div>

                {/* Card Body - Stats */}
                <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex justify-around">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{t("provider.total_orders")}</p>
                    <p className="text-lg font-bold text-slate-900">{client.totalOrders}</p>
                  </div>
                  <div className="w-px bg-slate-200"></div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{t("provider.latest_status")}</p>
                    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-1 rounded border mt-1 ${getStatusColor(client.history[0].status)}`}>
                      {getStatusIcon(client.history[0].status)}
                      {client.history[0].status}
                    </span>
                  </div>
                </div>

                {/* Card Footer - History preview */}
                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center">
                      <History className="w-3.5 h-3.5 me-1.5" />
                      {t("provider.recent_history")}
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {client.history.slice(0, 3).map((req) => (
                      <div key={req.id} className="flex justify-between items-start text-sm">
                        <div className="max-w-[70%]">
                          <p className="font-medium text-slate-800 truncate">{req.Service?.name || t("provider.general_locksmith")}</p>
                          <p className="text-xs text-slate-500 mt-0.5 flex items-center">
                            <Calendar className="w-3 h-3 me-1" />
                            {new Date(req.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getStatusColor(req.status)}`}>
                          {req.status}
                        </span>
                      </div>
                    ))}
                    {client.totalOrders > 3 && (
                      <div className="text-center pt-2">
                        <span className="text-xs font-medium text-blue-600">+ {client.totalOrders - 3} {t("provider.more_records")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
