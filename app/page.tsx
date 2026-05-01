"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    window.addEventListener("online", () => setIsOnline(true));
    window.addEventListener("offline", () => setIsOnline(false));

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setIsInstalled(true));

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("online", () => setIsOnline(true));
      window.removeEventListener("offline", () => setIsOnline(false));
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
        {/* Status Bar */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className={`p-4 rounded-lg border ${isOnline ? "bg-green-900/20 border-green-500" : "bg-red-900/20 border-red-500"}`}>
            <p className="text-sm text-slate-300">Network</p>
            <p className="text-lg font-semibold">{isOnline ? "🟢 Online" : "🔴 Offline"}</p>
          </div>
          <div className={`p-4 rounded-lg border ${isInstalled ? "bg-blue-900/20 border-blue-500" : "bg-amber-900/20 border-amber-500"}`}>
            <p className="text-sm text-slate-300">App Status</p>
            <p className="text-lg font-semibold">{isInstalled ? "📱 Installed" : "📥 Web App"}</p>
          </div>
        </div>

        {/* Install Prompt */}
        {deferredPrompt && !isInstalled && (
          <div className="bg-amber-900/30 border border-amber-500 rounded-lg p-4 mb-8">
            <h2 className="font-semibold mb-2">Install Revenant</h2>
            <p className="text-sm text-slate-300 mb-4">
              Get a native-like experience with offline access and push notifications.
            </p>
            <button
              onClick={handleInstall}
              className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Install App
            </button>
          </div>
        )}

        {/* iOS Instructions */}
        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 mb-8">
          <h2 className="font-semibold mb-3">📱 iPhone Install Guide</h2>
          <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
            <li>Tap the Share button (square with arrow)</li>
            <li>Scroll and tap "Add to Home Screen"</li>
            <li>Enter a name and tap "Add"</li>
            <li>The app will appear on your home screen</li>
          </ol>
        </div>

        {/* Demo Features */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/counter"
            className="block p-6 bg-slate-700/30 border border-slate-600 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">📊 Offline Counter</h2>
            <p className="text-slate-400 text-sm mb-4">
              A counter that works offline using IndexedDB. Your data persists even when disconnected.
            </p>
            <span className="text-blue-400 text-sm font-medium">Try it →</span>
          </Link>

          <Link
            href="/notifications"
            className="block p-6 bg-slate-700/30 border border-slate-600 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">🔔 Notifications</h2>
            <p className="text-slate-400 text-sm mb-4">
              Request push notification permissions and send test notifications to your device.
            </p>
            <span className="text-blue-400 text-sm font-medium">Try it →</span>
          </Link>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-slate-700/50 border border-slate-600 rounded-lg p-4">
          <h2 className="font-semibold mb-3">💡 Tips</h2>
          <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
            <li>Open DevTools (F12) → Application → Service Workers to see registration</li>
            <li>Toggle offline in DevTools → Network → toggle offline</li>
            <li>The app works offline because assets are cached by the service worker</li>
            <li>Push notifications need an HTTPS connection (not localhost on mobile)</li>
          </ul>
        </div>
    </div>
  );
}
