import { MapPin, Star, Phone, CheckCircle2, CalendarDays, Shield, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';
import ProviderMapWrapper from '@/components/ProviderMapWrapper';
import ServicesSection from '@/components/ServicesSection';
import RequestQuoteModal from '@/components/RequestQuoteModal';

export default async function ProviderProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: provider } = await supabaseAdmin
    .from('Provider')
    .select('*')
    .eq('id', parseInt(id))
    .single();

  if (!provider) {
    notFound();
  }



  return (
    <div className="min-h-screen bg-slate-50">

      <main className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column - Main Details */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Profile Header */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  {provider.name}
                  <CheckCircle2 className="w-6 h-6 text-blue-500" />
                </h1>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <span className="font-medium text-slate-900">{provider.rating}</span>
                    <span>({provider.reviews} reviews)</span>
                  </div>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {provider.address}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-slate-600 leading-relaxed mt-4 pt-4 border-t border-slate-100 whitespace-pre-wrap">
              {provider.about}
            </p>
          </div>

          {/* Location Map */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-slate-900">Location</h2>
            </div>
            <div style={{ height: '260px' }}>
              <ProviderMapWrapper
                lat={provider.lat}
                lng={provider.lng}
                name={provider.name}
                address={provider.address}
              />
            </div>
          </div>

          {/* Services */}
          <ServicesSection
            providerId={provider.id}
            providerUserId={provider.userId ?? null}
          />
        </div>

        {/* Right Column - CTA & Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 sticky top-24">
            <h3 className="font-bold text-slate-900 mb-2 text-lg">Contact Provider</h3>
            <p className="text-slate-500 text-sm mb-6">Call directly to discuss your needs and request immediate assistance.</p>
            
            <a
              href={`tel:${provider.phone}`}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-md shadow-blue-200 mb-3"
            >
              <Phone className="w-5 h-5" />
              {provider.phone || 'No number listed'}
            </a>
            
            <RequestQuoteModal providerId={provider.id} />

            <div className="mt-6 space-y-3 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Shield className="w-5 h-5 text-green-500" />
                <span>Verified identity & credentials</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <CreditCard className="w-5 h-5 text-slate-400" />
                <span>Accepts Cash, Card, Mobile Pay</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
