"use client";

import { Search, MapPin, Star, Phone, Filter, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import map to avoid SSR issues with Leaflet
const SearchMap = dynamic(() => import('@/components/SearchMap'), { ssr: false });

type Provider = {
  id: number;
  name: string;
  distanceStr: string;
  rating: number;
  reviews: number;
  address: string;
  lat: number;
  lng: number;
};

export default function SearchResults() {
  const searchParams = useSearchParams();
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (lat && lng) {
      fetch(`/api/providers/nearby?lat=${lat}&lng=${lng}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setProviders(data.providers);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [lat, lng]);

  const userLat = lat ? parseFloat(lat) : 0;
  const userLng = lng ? parseFloat(lng) : 0;

  return (
    <div className="bg-slate-50 flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Search sub-header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            readOnly
            value={lat && lng ? "Current Location" : "Unknown Location"}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium">
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

        {/* Left Sidebar - List */}
        <div className="w-full h-[50%] md:h-auto md:w-[400px] lg:w-[420px] bg-white border-t md:border-t-0 md:border-r border-slate-200 overflow-y-auto flex flex-col flex-shrink-0 order-2 md:order-1">
          <div className="p-4 border-b border-slate-100 flex-shrink-0">
            <h2 className="text-lg font-semibold text-slate-900">Locksmiths near you</h2>
            <p className="text-sm text-slate-500">Found {providers.length} professionals</p>
          </div>

          <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : providers.length === 0 ? (
              <div className="text-center p-8 text-slate-500">
                <p>No key makers found nearby. Be the first!</p>
                <Link href="/provider/new" className="inline-block mt-4 text-blue-600 font-medium hover:underline">
                  Add a Key Maker
                </Link>
              </div>
            ) : providers.map((provider) => (
              <div
                key={provider.id}
                onClick={() => setSelectedId(provider.id)}
                className={`block p-4 rounded-xl border transition-all bg-white cursor-pointer group flex-shrink-0 ${
                  selectedId === provider.id
                    ? 'border-blue-400 shadow-md ring-2 ring-blue-100'
                    : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {provider.name}
                  </h3>
                  <span className="text-sm font-medium text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                    <MapPin className="w-3 h-3" />
                    {provider.distanceStr}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-sm text-amber-500 font-medium mb-3">
                  <Star className="w-4 h-4 fill-current" />
                  {provider.rating}
                  <span className="text-slate-400 font-normal ml-1">({provider.reviews} reviews)</span>
                </div>

                <p className="text-xs text-slate-500 mb-3">{provider.address}</p>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-sm font-medium transition-colors">
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                  <Link
                    href={`/provider/${provider.id}`}
                    className="flex-1 flex items-center justify-center bg-blue-50 text-blue-700 hover:bg-blue-100 py-2 rounded-lg text-sm font-medium transition-colors"
                    onClick={e => e.stopPropagation()}
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Area - Real Map */}
        <div className="w-full h-[50%] md:h-auto flex-1 relative z-0 order-1 md:order-2">
          {lat && lng ? (
            <SearchMap
              userLat={userLat}
              userLng={userLng}
              providers={providers}
              selectedId={selectedId}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-500">
              <p>Enable location to see the map.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
