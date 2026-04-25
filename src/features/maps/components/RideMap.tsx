"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

// Fix for default marker icon in Leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface RideMapProps {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
}

const Routing = ({ origin, destination }: RideMapProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(origin.lat, origin.lng),
        L.latLng(destination.lat, destination.lng),
      ],
      lineOptions: {
        styles: [{ color: "#4f46e5", weight: 6, opacity: 0.8 }],
        extendToWaypoints: true,
        missingRouteTolerance: 1,
      },
      addWaypoints: false,
      fitSelectedRoutes: true,
      show: false, // Hide the textual directions panel
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, origin, destination]);

  return null;
};

const RideMap: React.FC<RideMapProps> = ({ origin, destination }) => {
  return (
    <div className="premium-card overflow-hidden rounded-[24px]">
      <MapContainer
        center={[origin.lat, origin.lng]}
        zoom={7}
        style={{ width: "100%", height: "400px" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Routing origin={origin} destination={destination} />
      </MapContainer>
    </div>
  );
};

export default RideMap;
