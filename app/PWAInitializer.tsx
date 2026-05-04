"use client";

import { useEffect } from "react";
import { useServiceWorker } from "@/lib/useServiceWorker";

function useIOSViewportHeight() {
  useEffect(() => {
    const isIOS =
      /iP(ad|hone|od)/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (!isIOS) return;

    document.documentElement.classList.add("ios");

    const setAppHeight = () => {
      // window.screen dimensions are the physical screen — unaffected by iOS viewport bugs.
      // screen.width/height don't rotate on iOS, so pick the right one based on orientation.
      const isLandscape = window.innerWidth > window.innerHeight;
      const h = isLandscape ? window.screen.width : window.screen.height;
      document.documentElement.style.setProperty("--vh-ios", `${h * 0.01}px`);
    };

    setAppHeight();
    window.addEventListener("resize", setAppHeight);
    window.addEventListener("orientationchange", setAppHeight);

    return () => {
      window.removeEventListener("resize", setAppHeight);
      window.removeEventListener("orientationchange", setAppHeight);
    };
  }, []);
}

export function PWAInitializer() {
  useServiceWorker();
  useIOSViewportHeight();
  return null;
}
