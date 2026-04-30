"use client";

import { useServiceWorker } from "@/lib/useServiceWorker";

export function PWAInitializer() {
  useServiceWorker();
  return null;
}
