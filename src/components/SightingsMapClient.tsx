"use client";

import dynamic from "next/dynamic";

// react-leaflet touches `window` at import time, so it can't be prerendered.
// `ssr: false` is only allowed inside a Client Component (Next.js 16+), hence
// this thin wrapper around the actual map in SightingsMap.tsx.
export const SightingsMapClient = dynamic(
  () => import("./SightingsMap").then((m) => m.SightingsMap),
  { ssr: false },
);
