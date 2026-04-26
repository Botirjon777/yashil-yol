"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { HiSearch, HiLocationMarker, HiCheck, HiX } from "react-icons/hi";
import Button from "./Button";
import { cn } from "@/src/lib/utils";

// Fix for default marker icon in Leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapPickerProps {
  onSelect: (lat: string, lng: string, address?: string) => void;
  initialLat?: string;
  initialLng?: string;
  onCancel: () => void;
  rd: (key: string) => string;
  showActions?: boolean;
}

// Helper component to update map view
const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const MapEvents = ({
  onClick,
}: {
  onClick: (pos: [number, number]) => void;
}) => {
  useMapEvents({
    click(e) {
      onClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const MapPicker: React.FC<MapPickerProps> = ({
  onSelect,
  initialLat,
  initialLng,
  onCancel,
  rd,
  showActions = true,
}) => {
  const [position, setPosition] = useState<[number, number] | null>(
    initialLat && initialLng
      ? [parseFloat(initialLat), parseFloat(initialLng)]
      : null,
  );
  const [address, setAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const defaultCenter: [number, number] = [41.2995, 69.2401]; // Tashkent

  useEffect(() => {
    if (!initialLat && !initialLng && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos: [number, number] = [
            pos.coords.latitude,
            pos.coords.longitude,
          ];
          setPosition(newPos);
          fetchAddress(newPos[0], newPos[1]);
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        { enableHighAccuracy: true },
      );
    }
  }, [initialLat, initialLng]);

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=uz,ru,en`,
      );
      const data = await res.json();
      const addr = data.display_name || "";
      setAddress(addr);
      
      // If we are in embedded mode, update parent immediately
      if (!showActions) {
        onSelect(lat.toFixed(6), lng.toFixed(6), addr);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  const handleMapClick = (pos: [number, number]) => {
    setPosition(pos);
    fetchAddress(pos[0], pos[1]);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowResults(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery,
        )}&countrycodes=uz&limit=5&accept-language=uz,ru,en`,
      );
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    const pos: [number, number] = [lat, lon];
    setPosition(pos);
    setAddress(result.display_name);
    setShowResults(false);
    setSearchQuery(result.display_name);
    
    if (!showActions) {
      onSelect(lat.toFixed(6), lon.toFixed(6), result.display_name);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Box */}
      <div className="relative">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <HiSearch className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={rd("searchPlaceholder") || "Search for a place..."}
            className="w-full bg-white border border-border rounded-2xl pl-12 pr-10 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
              }}
              className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-dark-text"
            >
              <HiX className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Search Results Dropdown */}
        {showResults && (searchResults.length > 0 || isSearching) && (
          <div className="absolute z-1000 w-full mt-2 bg-white border border-border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
            {isSearching ? (
              <div className="p-4 flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Searching...
                </span>
              </div>
            ) : (
              <ul className="max-h-60 overflow-y-auto custom-scrollbar">
                {searchResults.map((result, idx) => (
                  <li
                    key={idx}
                    onClick={() => selectSearchResult(result)}
                    className="p-3 hover:bg-primary/5 cursor-pointer border-b border-gray-50 last:border-0 transition-colors flex items-start gap-3"
                  >
                    <HiLocationMarker className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-xs font-bold text-dark-text leading-tight">
                      {result.display_name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="relative rounded-2xl overflow-hidden border border-border shadow-inner z-0">
        <MapContainer
          center={position || defaultCenter}
          zoom={position ? 16 : 12}
          style={{ width: "100%", height: "400px" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents onClick={handleMapClick} />
          {position && <Marker position={position} />}
          {position && <ChangeView center={position} />}
        </MapContainer>

        {!position && (
          <div className="absolute inset-0 bg-dark-text/40 backdrop-blur-[2px] flex items-center justify-center p-6 text-center z-500">
            <div className="bg-white/90 backdrop-blur p-4 rounded-2xl shadow-2xl max-w-xs scale-in">
              <HiLocationMarker className="w-8 h-8 text-primary mx-auto mb-2 animate-bounce" />
              <p className="text-xs font-black text-dark-text uppercase tracking-tight">
                {rd("clickOnMap") || "Click on the map to set pick-up point"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Selected Address Info */}
      {address && (
        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
            <HiLocationMarker className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {rd("selectedLocation") || "Selected Location"}
            </p>
            <p className="text-xs font-bold text-dark-text leading-tight mt-0.5">
              {address}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            {rd("cancel") || "Cancel"}
          </Button>
          <Button
            className="flex-1 gap-2"
            disabled={!position}
            onClick={() => {
              if (position) {
                onSelect(position[0].toFixed(6), position[1].toFixed(6), address);
              }
            }}
          >
            <HiCheck className="w-4 h-4" />
            {rd("confirmLocation") || "Confirm Location"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MapPicker;
