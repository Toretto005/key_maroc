"use client";

import { Search, MapPin, KeyRound, ShieldCheck, Clock, Loader2, Smartphone, UserCheck, PhoneCall } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [locating, setLocating] = useState(false);

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
            // Fallback to IP based location (very useful for local LAN testing where iOS blocks HTTP GPS)
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 py-20 text-center sm:py-32 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
          <Clock className="w-4 h-4" />
          <span>Available 24/7 in your area</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
          Find the Nearest <span className="text-blue-600">Key Maker</span> <br className="hidden sm:block" /> in Seconds.
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl">
          Locked out? Need a spare key? Sarouti connects you with trusted local locksmiths. 
          Use your location to find the closest professionals immediately.
        </p>

        {/* Search Box */}
        <div className="w-full max-w-2xl bg-white p-2 rounded-2xl shadow-lg border border-slate-200 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 text-left">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Enter your city or region..." 
              className="w-full pl-12 pr-4 py-4 rounded-xl border-none bg-transparent text-lg focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleLocateMe}
              disabled={locating}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-4 rounded-xl font-medium transition-colors"
            >
              {locating ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
              <span className="hidden sm:inline">{locating ? "Locating..." : "Locate Me"}</span>
            </button>
            <Link 
               href="/search"
               className="flex-1 sm:flex-none flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors shadow-md shadow-blue-200"
            >
              Explore Map
            </Link>
          </div>
        </div>

        {/* How It Works - LockAtlas Inspired Timeline */}
        <div className="w-full mt-24 sm:mt-32">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Three Simple Steps to Safety</h2>
            <p className="text-lg text-slate-500">From locked out to back inside in minutes.</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Center Line for Desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-100 -translate-x-1/2"></div>

            {/* Step 1: Left */}
            <div className="relative mb-12 md:mb-0 md:pr-[52%]">
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-14 h-14 bg-blue-600 text-white rounded-full items-center justify-center text-2xl font-bold z-10 shadow-[0_0_20px_rgba(37,99,235,0.4)]">1</div>
              <div className="md:py-8">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] text-left">
                  <div className="flex items-start gap-4">
                    <div className="md:hidden flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">1</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Smartphone className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900">Search & Locate</h3>
                      </div>
                      <p className="text-slate-500 leading-relaxed">
                        Enter your location or let your GPS do the work. We'll instantly scan the area to find the closest available key makers near you.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Right */}
            <div className="relative mb-12 md:mb-0 md:pl-[52%]">
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-14 h-14 bg-blue-600 text-white rounded-full items-center justify-center text-2xl font-bold z-10 shadow-[0_0_20px_rgba(37,99,235,0.4)]">2</div>
              <div className="md:py-8">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] text-left">
                  <div className="flex items-start gap-4">
                    <div className="md:hidden flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">2</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                          <UserCheck className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900">Pick a Provider</h3>
                      </div>
                      <p className="text-slate-500 leading-relaxed">
                        Browse through profiles of verified local locksmiths. See their transparent pricing, read customer reviews, and check their exact distance from you.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Left */}
            <div className="relative mb-12 md:mb-0 md:pr-[52%]">
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-14 h-14 bg-blue-600 text-white rounded-full items-center justify-center text-2xl font-bold z-10 shadow-[0_0_20px_rgba(37,99,235,0.4)]">3</div>
              <div className="md:py-8">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] text-left">
                  <div className="flex items-start gap-4">
                    <div className="md:hidden flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">3</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                          <PhoneCall className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900">Get It Done</h3>
                      </div>
                      <p className="text-slate-500 leading-relaxed">
                        Tap to call the key maker directly. No middlemen, no waiting on hold. Your local expert will be on their way to help you in minutes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
