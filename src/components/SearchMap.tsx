"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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
      {providers.map((provider) => (
        <Marker key={provider.id} position={[provider.lat, provider.lng]} icon={providerIcon}>
          <Popup>
            <div>
              <p className="font-bold text-slate-900 mb-1">{provider.name}</p>
              <p className="text-sm text-slate-600 mb-1">{provider.address}</p>
              <p className="text-sm font-medium text-blue-600">📍 {provider.distanceStr} away</p>
              <a
                href={`/provider/${provider.id}`}
                className="inline-block mt-2 text-sm bg-blue-600 text-white px-3 py-1 rounded-lg"
              >
                View Profile
              </a>
            </div>
          </Popup>
        </Marker>
      ))}

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
