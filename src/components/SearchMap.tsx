"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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
};

export default function SearchMap({ userLat, userLng, providers, selectedId, defaultZoom = 16, showUserMarker = true }: Props) {
  const allPositions: [number, number][] = [
    ...(showUserMarker ? [[userLat, userLng] as [number, number]] : []),
    ...providers.map((p) => [p.lat, p.lng] as [number, number]),
  ];

  return (
    <MapContainer
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
  );
}
