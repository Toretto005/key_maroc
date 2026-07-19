"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import { useRouter } from "next/navigation";
import { Locate, Loader2 } from "lucide-react";
import L from "leaflet";

// Fix default Leaflet marker icons broken by webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const providerIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});



function ZoomToSelected({ providers, selectedId }: { providers: Provider[], selectedId?: number | null }) {
  const map = useMap();
  useEffect(() => {
    if (selectedId) {
      const p = providers.find(p => p.id === selectedId);
      if (p) {
        const lat = parseFloat(String(p.lat));
        const lng = parseFloat(String(p.lng));
        if (!isNaN(lat) && !isNaN(lng)) {
          map.setView([lat, lng], 16);
        } else {
          console.error("Invalid coordinates for provider:", p);
        }
      }
    }
  }, [map, providers, selectedId]);
  return null;
}

type Provider = {
  id: number;
  name: string;
  address: string;
  distanceStr: string;
  lat: number;
  lng: number;
};

type Props = {
  userLat: number;
  userLng: number;
  providers: Provider[];
  selectedId?: number | null;
  defaultZoom?: number;
  showUserMarker?: boolean;
  onLocateMe?: () => void;
};

export default function SearchMap({ userLat, userLng, providers, selectedId, defaultZoom = 16, showUserMarker = true, onLocateMe }: Props) {
  const router = useRouter();
  const [locating, setLocating] = useState(false);
  const [map, setMap] = useState<L.Map | null>(null);

  const handleLocateMe = () => {
    setLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocating(false);
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          router.push(`/search?lat=${lat}&lng=${lng}`);
          if (map) map.flyTo([lat, lng], 16);
          if (onLocateMe) onLocateMe();
        },
        async (error) => {
          console.warn("GPS failed, falling back to IP location:", error);
          try {
            const res = await fetch("https://get.geojs.io/v1/ip/geo.json");
            const data = await res.json();
            if (data.latitude && data.longitude) {
              const lat = data.latitude;
              const lng = data.longitude;
              router.push(`/search?lat=${lat}&lng=${lng}`);
              if (map) map.flyTo([lat, lng], 16);
              if (onLocateMe) onLocateMe();
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

  const allPositions: [number, number][] = [
    ...(showUserMarker ? [[userLat, userLng] as [number, number]] : []),
    ...providers.map((p) => [p.lat, p.lng] as [number, number]),
  ];

  // React to prop changes (e.g. when user uses text search in parent component)
  useEffect(() => {
    if (map) {
      map.flyTo([userLat, userLng], defaultZoom);
    }
  }, [userLat, userLng, map, defaultZoom]);

  return (
    <div className="relative w-full h-full">
      <MapContainer
      ref={setMap}
      center={[userLat, userLng]}
      zoom={defaultZoom}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User location marker (only show if location is known) */}
      {showUserMarker && (
        <Marker position={[userLat, userLng]} icon={userIcon}>
          <Popup>
            <div className="font-semibold text-blue-600">📍 Your Location</div>
          </Popup>
        </Marker>
      )}

      {/* Provider markers */}
      {providers.map((provider) => {
        // Custom div icon to match the mockup tooltip
        const customTooltipIcon = new L.DivIcon({
          className: 'custom-tooltip-marker',
          html: `
            <div class="flex items-center gap-2 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] p-2 pr-3 border border-slate-100 whitespace-nowrap transform -translate-x-1/2 -translate-y-full">
              <div class="w-8 h-8 bg-slate-100 rounded-full border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                <span class="font-bold text-slate-500 text-xs">${provider.name.charAt(0)}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Closest Technician:</span>
                <span class="text-xs font-bold text-slate-800 leading-none mb-0.5">${provider.name}</span>
                <span class="text-[10px] text-slate-500 font-medium leading-none">${provider.distanceStr} • 5-min ETA</span>
              </div>
              <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-transparent border-t-white drop-shadow-sm"></div>
            </div>
            <div class="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1b344a] flex items-center justify-center shadow-md border-2 border-white mt-1">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        return (
          <Marker 
            key={provider.id} 
            position={[provider.lat, provider.lng]} 
            icon={customTooltipIcon}
          >
          </Marker>
        );
      })}

      <ZoomToSelected providers={providers} selectedId={selectedId} />
    </MapContainer>

    {/* Floating Locate Me Button */}
    <button
      onClick={handleLocateMe}
      disabled={locating}
      className="absolute bottom-6 right-6 z-[1000] w-12 h-12 bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-all border border-slate-200"
      title="Locate Me"
    >
      {locating ? (
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
      ) : (
        <Locate className="w-5 h-5" />
      )}
    </button>
  </div>
  );
}
