import { MapPin, Star, Phone, CheckCircle2, CalendarDays, Shield, CreditCard, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProviderMapWrapper from '@/components/ProviderMapWrapper';
import ServicesSection from '@/components/ServicesSection';
import RequestQuoteModal from '@/components/RequestQuoteModal';
import BackButton from '@/components/BackButton';

export default async function ProviderProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const provider = await prisma.provider.findUnique({
    where: { id: parseInt(id) },
    include: {
      services: true,
      clientReviews: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!provider) {
    notFound();
  }



  return (
    <div className="min-h-screen bg-slate-50">

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-4">
          <BackButton />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column - Main Details */}
          <div className="md:col-span-2 space-y-6">
          
          {/* Profile Header */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
              <div className="flex gap-4 md:gap-6 items-start">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-100 border border-slate-200 shadow-sm overflow-hidden shrink-0 flex items-center justify-center">
                  {provider.avatarUrl ? (
                    <img src={provider.avatarUrl} alt={provider.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-slate-400 text-3xl">{provider.name.charAt(0)}</span>
                  )}
                </div>
                <div className="pt-1 md:pt-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                    {provider.name}
                    <CheckCircle2 className="w-6 h-6 text-blue-500" />
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-current" />
                      <span className="font-medium text-slate-900">{provider.rating}</span>
                      <span>({provider.reviews} reviews)</span>
                    </div>
                    <span className="hidden md:inline text-slate-300">|</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {provider.address}
                    </span>
                  </div>
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

          {/* Services Section */}
          <ServicesSection providerId={provider.id} providerUserId={provider.userId ?? null} />
          
          {/* Reviews Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h2 className="font-semibold text-slate-900 text-lg">Client Reviews</h2>
              </div>
              <div className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-amber-500 inline mr-1 pb-0.5" />
                {provider.rating} <span className="text-slate-500 font-normal">({provider.clientReviews.length})</span>
              </div>
            </div>
            
            <div className="p-5">
              {provider.clientReviews && provider.clientReviews.length > 0 ? (
                <div className="space-y-4">
                  {provider.clientReviews.map((review: any) => (
                    <div key={review.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-bold text-slate-900">{review.clientPhone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-***-$3')}</div>
                          <div className="text-xs text-slate-500">
                            {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                        <div className="flex text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-slate-600 text-sm leading-relaxed mt-2">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <MessageSquare className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p>No reviews yet for this provider.</p>
                </div>
              )}
            </div>
          </div>
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
        </div>
      </main>
    </div>
  );
}
