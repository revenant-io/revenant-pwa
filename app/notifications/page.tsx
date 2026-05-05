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
          body: "This is a test notification from your PWA.",
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          tag: "test-notification",
          requireInteraction: false,
          actions: [
            { action: "open", title: "Open App" },
            { action: "dismiss", title: "Dismiss" },
          ],
        } as NotificationOptions & { actions: any[] });
      });
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#F5EFE6] text-[#2A1B0E] flex items-center justify-center">
        Loading…
      </div>
    );
  }

  const isSupported = "Notification" in window;
  const isGranted = permission === "granted";
  const isDenied = permission === "denied";

  return (
    <div className="max-w-2xl mx-auto p-4 py-8">
      <div className="space-y-8">
        {/* Support check */}
        {!isSupported && (
          <div className="bg-[#F4D5D1] border border-[#B8392E] rounded-lg p-4">
            <p className="text-sm text-[#B8392E]">
              Notifications are not supported in your browser. Try Chrome, Firefox, or Edge.
            </p>
          </div>
        )}

        {/* Permission status */}
        <div className={`p-4 rounded-lg border text-center ${
          isGranted
            ? "bg-[#DDE6CC] border-[#6B8A5A] text-[#4A6A48]"
            : isDenied
            ? "bg-[#F4D5D1] border-[#B8392E] text-[#B8392E]"
            : "bg-[#FCF1D9] border-[#E8B84A] text-[#B8901E]"
        }`}>
          <p className="text-sm">Permission status</p>
          <p className="text-lg font-semibold">
            {isGranted && "Granted"}
            {isDenied && "Denied"}
            {!isDenied && !isGranted && "Not requested"}
          </p>
        </div>

        {/* Request permission */}
        {isSupported && !isGranted && (
          <div className="bg-[#FBF7F0] border border-[#DCCFB5] rounded-xl p-6 shadow-[0_2px_4px_rgba(42,27,14,0.06)]">
            <h2 className="font-semibold text-[#2A1B0E] mb-3">Enable notifications</h2>
            <p className="text-[#8A6F4F] text-sm mb-4">
              Grant permission to receive push notifications from this app.
            </p>
            <button
              onClick={requestPermission}
              className="bg-[#A6553A] hover:bg-[#C16A4D] text-[#FBF7F0] px-6 py-2 rounded-full font-semibold transition-colors duration-[140ms]"
            >
              Request permission
            </button>
          </div>
        )}

        {/* Send test */}
        {isGranted && (
          <div className="bg-[#FBF7F0] border border-[#DCCFB5] rounded-xl p-6 shadow-[0_2px_4px_rgba(42,27,14,0.06)]">
            <h2 className="font-semibold text-[#2A1B0E] mb-3">Send a test notification</h2>
            <p className="text-[#8A6F4F] text-sm mb-4">
              Send yourself a test notification to verify everything is working.
            </p>
            <button
              onClick={sendTestNotification}
              className="bg-[#DDE6CC] hover:bg-[#6B8A5A] hover:text-[#FBF7F0] text-[#4A6A48] px-6 py-2 rounded-full font-semibold transition-colors duration-[140ms]"
            >
              Send test notification
            </button>
          </div>
        )}

        {/* Permission denied */}
        {isDenied && (
          <div className="bg-[#F4D5D1] border border-[#B8392E] rounded-lg p-4">
            <p className="text-sm text-[#B8392E]">
              Notifications were denied. You can re-enable them in your browser settings.
            </p>
          </div>
        )}

        {/* About */}
        <div className="bg-[#FBF7F0] border border-[#DCCFB5] rounded-xl p-5 shadow-[0_2px_4px_rgba(42,27,14,0.06)]">
          <h2 className="font-semibold text-[#2A1B0E] mb-3">About notifications</h2>
          <ul className="text-sm text-[#54422D] space-y-2 list-disc list-inside">
            <li>Push notifications are delivered via your browser and service worker</li>
            <li>They work even if the app is closed (on supported platforms)</li>
            <li>iOS has limited notification support compared to Android</li>
            <li>Requires HTTPS or localhost (for development)</li>
            <li>Users must grant permission first</li>
          </ul>
        </div>

        {/* iOS vs Android */}
        <div className="bg-[#FBF7F0] border border-[#DCCFB5] rounded-xl p-5 shadow-[0_2px_4px_rgba(42,27,14,0.06)]">
          <h2 className="font-semibold text-[#2A1B0E] mb-3">iOS vs Android</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-[#54422D]">
            <div>
              <p className="font-semibold text-[#2A1B0E] mb-2">iOS (iPhone)</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Limited notification API support</li>
                <li>Notifications require special setup</li>
                <li>Consider in-app notifications as fallback</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-[#2A1B0E] mb-2">Android</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Full Push Notification API support</li>
                <li>Background message delivery</li>
                <li>Rich notification actions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Testing tips */}
        <div className="bg-[#FBF7F0] border border-[#DCCFB5] rounded-xl p-5 shadow-[0_2px_4px_rgba(42,27,14,0.06)]">
          <h2 className="font-semibold text-[#2A1B0E] mb-3">Testing tips</h2>
          <ul className="text-sm text-[#54422D] space-y-2 list-disc list-inside">
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
