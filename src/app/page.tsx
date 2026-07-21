"use client";

import { Search, MapPin, KeyRound, ShieldCheck, Clock, Loader2, Smartphone, UserCheck, PhoneCall } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function ClientDashboard() {
  const router = useRouter();
  const [locating, setLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const { t } = useLanguage();

  const handleTextSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      // Append Morocco to improve local results
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ", Morocco")}`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        const lat = data[0].lat;
        const lng = data[0].lon;
        router.push(`/search?lat=${lat}&lng=${lng}`);
      } else {
        alert("Location not found. Please try a different city name.");
        setSearching(false); // only stop loading on fail, on success we want it to stay loading while pushing
      }
    } catch (err) {
      alert("Search failed. Please try again.");
      setSearching(false);
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
      <div className="hidden md:block fixed top-4 end-4 z-50">
        <LanguageSwitcher />
      </div>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 py-20 text-center sm:py-32 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
          <Clock className="w-4 h-4" />
          <span>{t("home.available_24_7")}</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight max-w-3xl">
          {t("home.hero_title")}
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl">
          {t("home.hero_subtitle")}
        </p>

        {/* Search Box */}
        <form onSubmit={handleTextSearch} className="w-full max-w-2xl bg-white p-2 rounded-2xl shadow-lg border border-slate-200 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 text-start">
            {searching ? (
              <Loader2 className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 animate-spin" />
            ) : (
              <MapPin className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            )}
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("home.search_placeholder")}
              className="w-full ps-12 pe-4 py-4 rounded-xl border-none bg-transparent text-lg focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={handleLocateMe}
              disabled={locating || searching}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-4 rounded-xl font-medium transition-colors"
            >
              {locating ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
              <span className="hidden sm:inline">{locating ? t("common.loading") : t("home.locate_me")}</span>
            </button>
            <button 
               type="submit"
               disabled={searching || locating}
               className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors shadow-md shadow-blue-200 disabled:opacity-70"
            >
              {searching && <Loader2 className="w-5 h-5 animate-spin" />}
              {t("home.search_button")}
            </button>
          </div>
        </form>

        {/* How It Works - LockAtlas Inspired Timeline */}
        <div className="w-full mt-24 sm:mt-32">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">{t("home.steps_title")}</h2>
            <p className="text-lg text-slate-500">{t("home.steps_subtitle")}</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Center Line for Desktop */}
            <div className="hidden md:block absolute start-1/2 top-0 bottom-0 w-0.5 bg-blue-100 -translate-x-1/2"></div>

            {/* Step 1: Left */}
            <div className="relative mb-12 md:mb-0 md:pe-[52%]">
              <div className="hidden md:flex absolute start-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-14 h-14 bg-blue-600 text-white rounded-full items-center justify-center text-2xl font-bold z-10 shadow-[0_0_20px_rgba(37,99,235,0.4)]">1</div>
              <div className="md:py-8">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] text-start">
                  <div className="flex items-start gap-4">
                    <div className="md:hidden flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">1</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Smartphone className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900">{t("home.step1_title")}</h3>
                      </div>
                      <p className="text-slate-500 leading-relaxed">
                        {t("home.step1_desc")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Right */}
            <div className="relative mb-12 md:mb-0 md:ps-[52%]">
              <div className="hidden md:flex absolute start-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-14 h-14 bg-blue-600 text-white rounded-full items-center justify-center text-2xl font-bold z-10 shadow-[0_0_20px_rgba(37,99,235,0.4)]">2</div>
              <div className="md:py-8">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] text-start">
                  <div className="flex items-start gap-4">
                    <div className="md:hidden flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">2</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                          <UserCheck className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900">{t("home.step2_title")}</h3>
                      </div>
                      <p className="text-slate-500 leading-relaxed">
                        {t("home.step2_desc")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Left */}
            <div className="relative mb-12 md:mb-0 md:pe-[52%]">
              <div className="hidden md:flex absolute start-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-14 h-14 bg-blue-600 text-white rounded-full items-center justify-center text-2xl font-bold z-10 shadow-[0_0_20px_rgba(37,99,235,0.4)]">3</div>
              <div className="md:py-8">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] text-start">
                  <div className="flex items-start gap-4">
                    <div className="md:hidden flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">3</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                          <PhoneCall className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900">{t("home.step3_title")}</h3>
                      </div>
                      <p className="text-slate-500 leading-relaxed">
                        {t("home.step3_desc")}
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
