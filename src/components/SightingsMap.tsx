"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { type LatLngBoundsExpression } from "leaflet";
import type { Sighting } from "@/db/queries";
import { formatSpottedAt } from "@/lib/format";

const pinIcon = L.divIcon({
  className: "map-pin",
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const FALLBACK_CENTER: [number, number] = [50.1, 8.68]; // Frankfurt, roughly central Europe

export function SightingsMap({ sightings }: { sightings: Sighting[] }) {
  const bounds = useMemo<LatLngBoundsExpression | null>(() => {
    if (sightings.length === 0) return null;
    return sightings.map((s) => [s.lat as number, s.lng as number]);
  }, [sightings]);

  return (
    <MapContainer
      className="map-container"
      center={FALLBACK_CENTER}
      zoom={5}
      bounds={bounds ?? undefined}
      boundsOptions={{ padding: [32, 32] }}
      scrollWheelZoom={false}
    >
      <TileLayer
        className="map-tiles"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {sightings.map((s) => (
        <Marker key={s.id} position={[s.lat as number, s.lng as number]} icon={pinIcon}>
          <Popup>
            <strong>{s.trainNumber}</strong>
            {s.operator ? ` · ${s.operator}` : ""}
            <br />
            {s.route && (
              <>
                {s.route}
                <br />
              </>
            )}
            {s.station}
            {s.country ? `, ${s.country}` : ""}
            <br />
            {formatSpottedAt(s.spottedAt)}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
