"use client";

import React, { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { HiMap } from "react-icons/hi";
import { cn } from "@/src/lib/utils";

// Only initialize Leaflet icons on the client side
let DefaultIcon: L.Icon | undefined;
let PassengerIcon: L.Icon | undefined;
let EndIcon: L.Icon | undefined;

if (typeof window !== "undefined") {
  DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  PassengerIcon = L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  EndIcon = L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
}

interface RoutingProps {
  waypoints: L.LatLng[];
}

const Routing = ({ waypoints }: RoutingProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map || waypoints.length < 2) return;

    const routingControl = (L as any).Routing.control({
      waypoints,
      lineOptions: {
        styles: [{ color: "#6366f1", weight: 6, opacity: 0.8 }],
      },
      show: false,
      addWaypoints: false,
      routeWhileDragging: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      createMarker: () => null, // We handle markers separately
    }).addTo(map);

    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, waypoints]);

  return null;
};

interface RideMapProps {
  trip: any;
  rd: (key: string) => string;
  hideHeader?: boolean;
  height?: string;
  interactive?: boolean;
  obfuscated?: boolean;
}

export const RideMap = ({
  trip,
  rd,
  hideHeader = false,
  height = "400px",
  interactive = true,
  obfuscated = false,
}: RideMapProps) => {
  if (typeof window === "undefined") return null;

  const waypoints = useMemo(() => {
    const points: L.LatLng[] = [];

    // 1. Parse from google_map_url if it exists and has waypoints
    if (trip.google_map_url) {
      try {
        const url = new URL(trip.google_map_url);
        const origin = url.searchParams.get("origin");
        const destination = url.searchParams.get("destination");
        const waypointsStr = url.searchParams.get("waypoints");

        if (origin) {
          const [lat, lng] = origin.split(",");
          points.push(L.latLng(parseFloat(lat), parseFloat(lng)));
        }

        if (waypointsStr) {
          waypointsStr.split("|").forEach((wp) => {
            const [lat, lng] = wp.split(",");
            points.push(L.latLng(parseFloat(lat), parseFloat(lng)));
          });
        }

        if (destination) {
          const [lat, lng] = destination.split(",");
          points.push(L.latLng(parseFloat(lat), parseFloat(lng)));
        }
      } catch (e) {
        console.error("Error parsing google_maps_link", e);
      }
    }

    // 2. Fallback or merge with structured data
    if (points.length === 0) {
      const startLat = trip.start_lat || trip.starting_point?.lat;
      const startLng = trip.start_long || trip.starting_point?.long;
      if (startLat && startLng) {
        points.push(L.latLng(parseFloat(startLat), parseFloat(startLng)));
      }

      // Add passenger locations as waypoints
      const passengerPoints: L.LatLng[] = [];
      trip.bookings?.forEach((b: any) => {
        b.passengers?.forEach((p: any) => {
          if (p.latitude && p.longitude) {
            passengerPoints.push(
              L.latLng(parseFloat(p.latitude), parseFloat(p.longitude)),
            );
          }
        });
      });
      points.push(...passengerPoints);

      const endLat = trip.end_lat || trip.ending_point?.lat;
      const endLng = trip.end_long || trip.ending_point?.long;
      if (endLat && endLng) {
        points.push(L.latLng(parseFloat(endLat), parseFloat(endLng)));
      }
    }

    return points;
  }, [trip]);

  if (waypoints.length < 2) {
    return (
      <div className="premium-card p-10 text-center bg-light-bg/50 border-dashed border-2 border-border/60">
        <HiMap className="w-12 h-12 text-gray-200 mx-auto mb-4" />
        <p className="text-gray-400 font-bold text-sm">
          {rd("noMapData") || "No map data available for this trip"}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "premium-card overflow-hidden",
        interactive ? "" : "pointer-events-none",
      )}
    >
      {!hideHeader && (
        <div className="px-6 py-4 border-b border-border/60 bg-linear-to-r from-primary/3 to-transparent flex items-center justify-between">
          <h3 className="text-sm font-black text-dark-text uppercase tracking-widest flex items-center gap-2">
            <HiMap className="w-4 h-4 text-primary" />
            {rd("tripMap") || "Trip Route"}
          </h3>
        </div>
      )}
      <div style={{ height }} className="w-full relative z-0">
        <MapContainer
          center={waypoints[0]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
          dragging={interactive}
          touchZoom={interactive}
          doubleClickZoom={interactive}
          scrollWheelZoom={interactive}
          zoomControl={interactive}
          boxZoom={interactive}
          keyboard={interactive}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className={obfuscated ? "blur-[5px]" : ""}
          />

          <Routing waypoints={waypoints} />

          {/* Markers or Circles */}
          {waypoints.map((point, idx) => {
            const isStart = idx === 0;
            const isEnd = idx === waypoints.length - 1;

            if (obfuscated && (isStart || isEnd)) {
              return (
                <Circle
                  key={idx}
                  center={point}
                  radius={300}
                  pathOptions={{
                    color: isStart ? "#6366f1" : "#ef4444",
                    fillColor: isStart ? "#6366f1" : "#ef4444",
                    fillOpacity: 0.15,
                    weight: 2,
                    dashArray: "5, 10",
                  }}
                >
                  <Tooltip
                    permanent
                    direction="top"
                    className="bg-white/90! backdrop-blur-sm! px-2! py-1! rounded-lg shadow-xl text-[9px] font-black uppercase tracking-widest text-dark-text border-none opacity-100"
                  >
                    {rd("approxLocation") || "Approx. 300m"}
                  </Tooltip>
                </Circle>
              );
            }

            let icon = DefaultIcon;
            let label = "Point";

            if (isStart) {
              label = "Start";
            } else if (isEnd) {
              label = "Finish";
              icon = EndIcon;
            } else {
              label = `Passenger ${idx}`;
              icon = PassengerIcon;
            }

            return (
              <Marker key={idx} position={point} icon={icon}>
                <Popup>
                  <span className="font-bold text-xs">{label}</span>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};
