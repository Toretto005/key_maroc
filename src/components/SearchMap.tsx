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
  avatarUrl?: string | null;
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

export default function SearchMap({
  userLat,
  userLng,
  providers,
  selectedId,
  defaultZoom = 16,
  showUserMarker = true,
  onLocateMe
}: Props) {
  const router = useRouter();
  const [map, setMap] = useState<L.Map | null>(null);
  const [locating, setLocating] = useState(false);

  const handleLocateMe = () => {
    if (!map) return;
    setLocating(true);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          router.push(`/search?lat=${lat}&lng=${lng}`);
          map.flyTo([lat, lng], 16, { animate: true, duration: 1.5 });
          setLocating(false);
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
              map.flyTo([lat, lng], 16);
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
            <div className="font-semibold text-blue-600">Your Location</div>
          </Popup>
        </Marker>
      )}

      {/* Provider markers */}
      {providers.map((provider) => {
        // Custom div icon to match the mockup tooltip
        const customTooltipIcon = new L.DivIcon({
          className: 'custom-tooltip-marker',
          html: `
            <div class="flex flex-col items-center transform -translate-x-1/2 -translate-y-full drop-shadow-md">
              <span class="text-[11px] font-bold text-slate-800 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md shadow-sm whitespace-nowrap border border-white/50 mb-1 pb-0.5">${provider.name}</span>
              <div class="relative flex items-center justify-center w-10 h-10 bg-[#1b344a]" style="border-radius: 50% 50% 50% 0; transform: rotate(-45deg);">
                <div class="w-8 h-8 bg-white rounded-full overflow-hidden flex items-center justify-center border border-slate-200" style="transform: rotate(45deg);">
                  ${provider.avatarUrl 
                    ? `<img src="${provider.avatarUrl}" alt="${provider.name}" class="w-full h-full object-cover" />`
                    : `<span class="font-bold text-slate-500 text-sm">${provider.name.charAt(0)}</span>`
                  }
                </div>
              </div>
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
            <Popup className="provider-popup rounded-2xl">
              <div className="flex flex-col gap-3 min-w-[200px] p-1">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                    {provider.avatarUrl 
                      ? <img src={provider.avatarUrl} alt={provider.name} className="w-full h-full object-cover" />
                      : <span className="font-bold text-slate-500 text-lg">{provider.name.charAt(0)}</span>
                    }
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 leading-tight mb-1 text-sm">{provider.name}</h3>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      <span className="truncate max-w-[120px] inline-block align-bottom">{provider.address}</span>
                    </div>
                    {provider.distanceStr && (
                      <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded inline-block">
                        {provider.distanceStr} away
                      </div>
                    )}
                  </div>
                </div>
                
                <a 
                  href={`/provider/${provider.id}`}
                  className="w-full block text-center bg-blue-600 hover:bg-blue-700 !text-white text-sm font-bold py-2 px-4 rounded-xl transition-colors shadow-sm mt-1"
                >
                  View Profile
                </a>
              </div>
            </Popup>
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
