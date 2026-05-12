"use client";

export const dynamic = 'force-dynamic'

import { useEffect, useState } from "react";
import Link from "next/link";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Debug() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setIsInstalled(true));

    // Check standalone mode asynchronously to avoid synchronous setState in effect
    Promise.resolve(window.matchMedia("(display-mode: standalone)").matches).then(
      (isStandalone) => { if (isStandalone) setIsInstalled(true); }
    );

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      {/* Status bar */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className={`p-4 rounded-lg border ${
          isOnline
            ? "bg-[#DDE6CC] border-[#6B8A5A] text-[#4A6A48]"
            : "bg-[#F4D5D1] border-[#B8392E] text-[#B8392E]"
        }`}>
          <p className="text-sm">Network</p>
          <p className="text-lg font-semibold">{isOnline ? "Online" : "Offline"}</p>
        </div>
        <div className={`p-4 rounded-lg border ${
          isInstalled
            ? "bg-[#F4DED1] border-[#A6553A] text-[#8E4A33]"
            : "bg-[#FCF1D9] border-[#E8B84A] text-[#B8901E]"
        }`}>
          <p className="text-sm">App status</p>
          <p className="text-lg font-semibold">{isInstalled ? "Installed" : "Web App"}</p>
        </div>
      </div>

      {/* Install prompt */}
      {deferredPrompt && !isInstalled && (
        <div className="bg-[#FCF1D9] border border-[#E8B84A] rounded-xl p-5 mb-8">
          <h2 className="font-semibold text-[#2A1B0E] mb-2">Install Revenant</h2>
          <p className="text-sm text-[#54422D] mb-4">
            Get a native-like experience with offline access and push notifications.
          </p>
          <button
            onClick={handleInstall}
            className="bg-[#A6553A] hover:bg-[#C16A4D] text-[#FBF7F0] px-4 py-2 rounded-full font-medium transition-colors duration-[140ms]"
          >
            Install app
          </button>
        </div>
      )}

      {/* iOS guide */}
      <div className="bg-[#FBF7F0] border border-[#DCCFB5] rounded-xl p-5 mb-8 shadow-[0_2px_4px_rgba(42,27,14,0.06)]">
        <h2 className="font-semibold text-[#2A1B0E] mb-3">iPhone install guide</h2>
        <ol className="text-sm text-[#54422D] space-y-2 list-decimal list-inside">
          <li>Tap the Share button (square with arrow)</li>
          <li>Scroll and tap &ldquo;Add to Home Screen&rdquo;</li>
          <li>Enter a name and tap &ldquo;Add&rdquo;</li>
          <li>The app will appear on your home screen</li>
        </ol>
      </div>

      {/* Demo features */}
      <div className="grid md:grid-cols-2 gap-6">
        <Link
          href="/notifications"
          className="block p-6 bg-[#FBF7F0] border border-[#DCCFB5] rounded-xl hover:bg-[#ECE3D2] transition-colors duration-[140ms] shadow-[0_2px_4px_rgba(42,27,14,0.06)]"
        >
          <h2 className="text-lg font-semibold text-[#2A1B0E] mb-2">Notifications</h2>
          <p className="text-[#8A6F4F] text-sm mb-4">
            Request push notification permissions and send test notifications to your device.
          </p>
          <span className="text-[#A6553A] text-sm font-medium">Try it →</span>
        </Link>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-[#FBF7F0] border border-[#DCCFB5] rounded-xl p-5 shadow-[0_2px_4px_rgba(42,27,14,0.06)]">
        <h2 className="font-semibold text-[#2A1B0E] mb-3">Tips</h2>
        <ul className="text-sm text-[#54422D] space-y-2 list-disc list-inside">
          <li>Open DevTools (F12) → Application → Service Workers to see registration</li>
          <li>Toggle offline in DevTools → Network → toggle offline</li>
          <li>The app works offline because assets are cached by the service worker</li>
          <li>Push notifications need an HTTPS connection (not localhost on mobile)</li>
        </ul>
      </div>
    </div>
  );
}
