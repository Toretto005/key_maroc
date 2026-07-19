"use client";

import { MapPin, Star, Phone, Filter, Loader2, Clock, CheckCircle2, ShieldCheck, Car, Building2, Home, Bell } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';
import AuthModal from '@/components/AuthModal';
import BackButton from '@/components/BackButton';

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
  avatarUrl?: string;
  about?: string;
};

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingProviderId, setPendingProviderId] = useState<number | null>(null);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserRole(user?.user_metadata?.role || null);
      setIsLoggedIn(!!user);
    });
  }, [supabase.auth]);

  const handleProfileClick = (e: React.MouseEvent, providerId: number) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setPendingProviderId(providerId);
      setShowAuthModal(true);
    } else {
      window.location.href = `/provider/${providerId}`;
    }
  };

  const handleLocateMe = () => {
    setLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocating(false);
          router.push(`/search?lat=${position.coords.latitude}&lng=${position.coords.longitude}`);
        },
        async (error) => {
          console.warn("GPS failed, falling back to IP location:", error);
          try {
            const res = await fetch("https://get.geojs.io/v1/ip/geo.json");
            const data = await res.json();
            if (data.latitude && data.longitude) {
              router.push(`/search?lat=${data.latitude}&lng=${data.longitude}`);
            } else {
              throw new Error("Invalid IP location data");
            }
          } catch (ipError) {
            alert("Could not get location. Please enable it in your browser or try on a secure connection.");
          } finally {
            setLocating(false);
          }
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setLocating(false);
    }
  };

  const handleTextSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ", Morocco")}`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        const lat = data[0].lat;
        const lng = data[0].lon;
        // Pushing the route will re-run the fetch for providers
        router.push(`/search?lat=${lat}&lng=${lng}`);
        setSearchQuery(""); // clear input after successful search
        setSelectedId(null);
      } else {
        alert("Location not found. Please try a different city name.");
      }
    } catch (err) {
      alert("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  };

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
    <div className="bg-slate-50 flex flex-col min-h-[calc(100dvh-4rem)] md:h-[calc(100dvh-4rem)]">
      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row flex-1 md:overflow-hidden">

        {/* Left Sidebar - List */}
        <div className="w-full md:flex-1 md:h-full md:w-[450px] lg:w-[480px] bg-slate-50 border-t md:border-t-0 md:border-r border-slate-200 md:overflow-hidden flex flex-col flex-shrink-0 order-2 md:order-1 relative pb-[88px] md:pb-0">
          <div className="p-5 pb-3 flex-shrink-0">
            <div className="mb-2 -mt-2">
              <BackButton fallback="/" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Available Locksmiths Near You</h2>
          </div>

          <div className="flex-1 px-5 pb-32 md:pb-24 flex flex-col gap-4 md:overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (!lat || !lng) ? (
              <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Find Nearby Locksmiths</h3>
                <p className="text-slate-500 text-sm mb-6 max-w-[250px]">
                  Share your location to instantly see key makers available around you.
                </p>
                <button 
                  onClick={handleLocateMe}
                  disabled={locating}
                  className="px-6 py-3 bg-[#1b344a] hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 w-full justify-center disabled:opacity-70"
                >
                  {locating ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                  {locating ? "Locating..." : "Use My Location"}
                </button>
              </div>
            ) : providers.length === 0 ? (
              <div className="text-center p-8 text-slate-500 bg-white rounded-2xl border border-slate-200">
                <p>No key makers found nearby.</p>
                {userRole === 'maker' && (
                  <Link href="/provider/new" className="inline-block mt-4 text-blue-600 font-medium hover:underline">
                    Add a Key Maker
                  </Link>
                )}
              </div>
            ) : providers.map((provider) => (
              <div
                key={provider.id}
                onClick={() => setSelectedId(provider.id)}
                className={`block p-5 rounded-2xl border transition-all bg-white cursor-pointer group flex-shrink-0 ${
                  selectedId === provider.id
                    ? 'border-blue-400 shadow-md ring-2 ring-blue-100'
                    : 'border-slate-200 hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                    {provider.avatarUrl ? (
                      <img src={provider.avatarUrl} alt={provider.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-slate-400 text-xl">{provider.name.charAt(0)}</span>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <a href={`/provider/${provider.id}`} onClick={(e) => handleProfileClick(e, provider.id)} className="block pr-2 truncate">
                        <h3 className="font-bold text-slate-900 text-lg truncate hover:text-blue-600 transition-colors">
                          {provider.name}
                        </h3>
                      </a>
                      <div className="flex items-center gap-1 text-sm text-amber-500 font-bold shrink-0">
                        <Star className="w-4 h-4 fill-current" />
                        {provider.rating.toFixed(1)}
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-600 truncate mb-1">{provider.address || 'Address not provided'}</p>
                    
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mb-2 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      ALOA Certified
                    </div>
                    
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {provider.about || "Specializations in residential, commercial, automotive 24/7."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col xl:flex-row xl:items-center justify-between mt-4 pt-4 border-t border-slate-100 gap-3">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => handleProfileClick(e, provider.id)}
                      className="flex-1 xl:flex-none px-3 py-2 bg-[#1b344a] hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition-colors shadow-sm text-center"
                    >
                      Book Now
                    </button>
                    <a 
                      href={`/provider/${provider.id}`}
                      onClick={(e) => handleProfileClick(e, provider.id)}
                      className="flex-1 xl:flex-none px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors text-center whitespace-nowrap"
                    >
                      View Profile
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium justify-start xl:justify-end pl-1">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{provider.distanceStr ? `${provider.distanceStr} away` : 'Nearby'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Service Types Tabs */}
          <div className="fixed md:absolute bottom-0 left-0 w-full bg-slate-50 border-t border-slate-200 p-4 z-[60] shadow-[0_-4px_15px_rgba(0,0,0,0.05)] md:shadow-none">
            <h4 className="text-xs font-bold text-slate-800 mb-3">Service Types</h4>
            <div className="flex items-center justify-between gap-2">
              <button className="flex flex-col items-center gap-1.5 flex-1 p-2 bg-white border-2 border-[#1b344a] rounded-xl text-[#1b344a] shadow-sm">
                <div className="relative">
                  <Bell className="w-5 h-5 fill-red-500 text-red-500" />
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                </div>
                <span className="text-xs font-bold">Emergency</span>
              </button>
              <button className="flex flex-col items-center gap-1.5 flex-1 p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:border-slate-300 transition-colors">
                <Building2 className="w-5 h-5" />
                <span className="text-xs font-medium">Commercial</span>
              </button>
              <button className="flex flex-col items-center gap-1.5 flex-1 p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:border-slate-300 transition-colors">
                <Car className="w-5 h-5" />
                <span className="text-xs font-medium">Auto</span>
              </button>
              <button className="flex flex-col items-center gap-1.5 flex-1 p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:border-slate-300 transition-colors">
                <Home className="w-5 h-5" />
                <span className="text-xs font-medium">Residential</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Area - Real Map */}
        <div className="w-full h-[40vh] md:h-auto md:flex-1 relative z-0 order-1 md:order-2 shrink-0">
          {lat && lng ? (
            <SearchMap
              userLat={userLat}
              userLng={userLng}
              providers={providers}
              selectedId={selectedId}
              onLocateMe={() => setSelectedId(null)}
            />
          ) : (
            <SearchMap
              userLat={31.7917}
              userLng={-7.0926}
              providers={providers}
              selectedId={selectedId}
              defaultZoom={5}
              showUserMarker={false}
              onLocateMe={() => setSelectedId(null)}
            />
          )}
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAuthModal(false)}></div>
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Authentication Required</h3>
              <p className="text-slate-600 mb-8">
                Please sign in or create an account to view full key maker profiles and request quotes.
              </p>
              
              <div className="flex flex-col gap-3">
                <Link 
                  href={`/auth/login?redirect=/provider/${pendingProviderId}`}
                  className="w-full py-3.5 bg-[#1b344a] hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-sm"
                >
                  Log In
                </Link>
                <Link 
                  href={`/auth/signup?redirect=/provider/${pendingProviderId}`}
                  className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
                >
                  Create an Account
                </Link>
                <button 
                  onClick={() => setShowAuthModal(false)}
                  className="mt-2 text-sm font-medium text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      , document.body)}
    </div>
  );
}

import { Suspense } from 'react';

export default function SearchResults() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
