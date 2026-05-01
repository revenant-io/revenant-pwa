"use client";

import { useEffect, useState } from "react";

export default function NotificationsPage() {
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ("Notification" in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
    }
  };

  const sendTestNotification = () => {
    if ("serviceWorker" in navigator && permission === "granted") {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification("Revenant PWA Test", {
          body: "This is a test notification from your PWA! 🎉",
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          tag: "test-notification",
          requireInteraction: false,
          actions: [
            {
              action: "open",
              title: "Open App",
            },
            {
              action: "dismiss",
              title: "Dismiss",
            },
          ],
        } as NotificationOptions & { actions: any[] });
      });
    }
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading...</div>;
  }

  const isSupported = "Notification" in window;
  const isGranted = permission === "granted";
  const isDenied = permission === "denied";

  return (
    <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="space-y-8">
          {/* Support Check */}
          {!isSupported && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
              <p className="text-sm text-red-300">
                ⚠️ Notifications are not supported in your browser. Try Chrome, Firefox, or Edge.
              </p>
            </div>
          )}

          {/* Status */}
          <div className={`p-4 rounded-lg border text-center ${isGranted ? "bg-green-900/20 border-green-500" : isDenied ? "bg-red-900/20 border-red-500" : "bg-amber-900/20 border-amber-500"}`}>
            <p className="text-sm text-slate-300">Permission Status</p>
            <p className="text-lg font-semibold">
              {isGranted && "✅ Granted"}
              {isDenied && "❌ Denied"}
              {!isDenied && !isGranted && "⏳ Not Requested"}
            </p>
          </div>

          {/* Request Permission */}
          {isSupported && !isGranted && (
            <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-6">
              <h2 className="font-semibold mb-3">🔔 Enable Notifications</h2>
              <p className="text-slate-400 text-sm mb-4">
                Grant permission to receive push notifications from this app.
              </p>
              <button
                onClick={requestPermission}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Request Permission
              </button>
            </div>
          )}

          {/* Send Test Notification */}
          {isGranted && (
            <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-6">
              <h2 className="font-semibold mb-3">📨 Send Test Notification</h2>
              <p className="text-slate-400 text-sm mb-4">
                Send yourself a test notification to verify everything is working.
              </p>
              <button
                onClick={sendTestNotification}
                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Send Test Notification
              </button>
            </div>
          )}

          {/* Permission Denied */}
          {isDenied && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
              <p className="text-sm text-red-300">
                Notifications were denied. You can re-enable them in your browser settings.
              </p>
            </div>
          )}

          {/* Info */}
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
            <h2 className="font-semibold mb-3">📚 About Notifications</h2>
            <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
              <li>Push notifications are delivered via your browser and service worker</li>
              <li>They work even if the app is closed (on supported platforms)</li>
              <li>iOS has limited notification support compared to Android</li>
              <li>Requires HTTPS or localhost (for development)</li>
              <li>Users must grant permission first</li>
            </ul>
          </div>

          {/* iOS vs Android */}
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
            <h2 className="font-semibold mb-3">🍎 iOS vs 🤖 Android</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
              <div>
                <p className="font-semibold text-slate-200 mb-2">iOS (iPhone)</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Limited notification API support</li>
                  <li>Notifications require special setup</li>
                  <li>Consider in-app notifications as fallback</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-slate-200 mb-2">Android</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Full Push Notification API support</li>
                  <li>Background message delivery</li>
                  <li>Rich notification actions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
            <h2 className="font-semibold mb-3">💡 Testing Tips</h2>
            <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
              <li>Open DevTools (F12) → Application → Service Workers to see registration</li>
              <li>Check DevTools → Application → Manifest to verify manifest.json is loaded</li>
              <li>For production, you'll need Firebase Cloud Messaging (FCM) or a similar service</li>
              <li>Test on both iOS and Android to see platform differences</li>
            </ul>
          </div>
        </div>
    </div>
  );
}
