"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { MapPin, Loader2 } from "lucide-react";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const selectedIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

type LatLng = { lat: number; lng: number };

function ClickHandler({ onSelect }: { onSelect: (pos: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function FlyTo({ position }: { position: LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 16, { duration: 1 });
    }
  }, [position, map]);
  return null;
}

type Props = {
  onLocationSelected: (lat: number, lng: number, address?: string) => void;
};

export default function LocationPicker({ onLocationSelected }: Props) {
  const [selected, setSelected] = useState<LatLng | null>(null);
  const [locating, setLocating] = useState(false);

  const fetchAndCallAddress = async (lat: number, lng: number) => {
    onLocationSelected(lat, lng);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`);
      const data = await res.json();
      if (data && data.address) {
        const city = data.address.city || data.address.town || data.address.village || data.address.county || data.address.state;
        const country = data.address.country;
        const addressString = city && country ? `${city}, ${country}` : data.display_name;
        onLocationSelected(lat, lng, addressString);
      }
    } catch (e) {
      console.error("Geocoding failed", e);
    }
  };

  const handleMapClick = (pos: LatLng) => {
    setSelected(pos);
    fetchAndCallAddress(pos.lat, pos.lng);
  };

  const handleLocateMe = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setSelected(newPos);
        fetchAndCallAddress(newPos.lat, newPos.lng);
        setLocating(false);
      },
      () => {
        alert("Could not get your location. Please click on the map instead.");
        setLocating(false);
      }
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Instructions */}
      <div className={`flex items-center justify-between p-3 rounded-xl border-2 transition-colors ${
        selected ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
      }`}>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className={`w-4 h-4 ${selected ? 'text-green-600' : 'text-blue-600'}`} />
          {selected ? (
            <span className="text-green-700 font-medium">
              Location set! You can drag the pin or click elsewhere to adjust.
            </span>
          ) : (
            <span className="text-blue-700">
              Click on the map to pin your exact location.
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={locating}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex-shrink-0 ml-3"
        >
          {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
          {locating ? "Locating…" : "Use My Location"}
        </button>
      </div>

      {/* Map */}
      <div className="rounded-xl overflow-hidden border-2 border-slate-200" style={{ height: '360px', cursor: 'crosshair' }}>
        <MapContainer
          center={[31.7917, -7.0926]}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onSelect={handleMapClick} />
          <FlyTo position={selected} />
          {selected && (
            <Marker
              position={[selected.lat, selected.lng]}
              icon={selectedIcon}
              draggable={true}
              eventHandlers={{
                dragend(e) {
                  const marker = e.target;
                  const pos = marker.getLatLng();
                  setSelected({ lat: pos.lat, lng: pos.lng });
                  fetchAndCallAddress(pos.lat, pos.lng);
                },
              }}
            />
          )}
        </MapContainer>
      </div>

      {selected && (
        <p className="text-xs text-slate-400 text-center">
          Coordinates: {selected.lat.toFixed(6)}, {selected.lng.toFixed(6)} — You can drag the pin to fine-tune.
        </p>
      )}
    </div>
  );
}
