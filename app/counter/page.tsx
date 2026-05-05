"use client";

import { useEffect, useState } from "react";
import { Dexie, type Table } from "dexie";

interface CounterData {
  id?: number;
  count: number;
  lastUpdated: number;
}

const db = new Dexie("RevenantDB");
db.version(1).stores({
  counters: "++id",
});

type CountersTable = Table<CounterData>;
const counters = db.table("counters") as CountersTable;

export default function CounterPage() {
  const [count, setCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    loadCounter();
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const loadCounter = async () => {
    try {
      const data = await counters.limit(1).first();
      if (data) setCount(data.count);
    } catch (error) {
      console.error("Failed to load counter:", error);
    }
  };

  const saveCounter = async (newCount: number) => {
    try {
      const existing = await counters.limit(1).first();
      if (existing) {
        await counters.update(existing.id!, { count: newCount, lastUpdated: Date.now() });
      } else {
        await counters.add({ count: newCount, lastUpdated: Date.now() });
      }
      setCount(newCount);
    } catch (error) {
      console.error("Failed to save counter:", error);
    }
  };

  const increment = () => saveCounter(count + 1);
  const decrement = () => saveCounter(Math.max(0, count - 1));
  const reset = () => saveCounter(0);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#F5EFE6] text-[#2A1B0E] flex items-center justify-center">
        Loading…
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 py-8">
      <div className="space-y-8">
        {/* Network status */}
        <div className={`p-4 rounded-lg border text-center ${
          isOnline
            ? "bg-[#DDE6CC] border-[#6B8A5A] text-[#4A6A48]"
            : "bg-[#F4D5D1] border-[#B8392E] text-[#B8392E]"
        }`}>
          <p className="text-sm">Network status</p>
          <p className="text-lg font-semibold">{isOnline ? "Online" : "Offline"}</p>
          <p className="text-xs mt-2 opacity-70">Try toggling offline in DevTools to test</p>
        </div>

        {/* Counter display */}
        <div className="bg-[#FBF7F0] border border-[#DCCFB5] rounded-xl p-8 text-center shadow-[0_2px_4px_rgba(42,27,14,0.06)]">
          <p className="text-sm text-[#8A6F4F] mb-4">Current count</p>
          <div
            className="text-7xl text-[#A6553A] mb-8 font-medium"
            style={{
              fontFamily: "var(--font-fraunces), 'Iowan Old Style', Georgia, serif",
              fontFeatureSettings: "'tnum','lnum'",
            }}
          >
            {count}
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={decrement}
              className="bg-[#F4D5D1] hover:bg-[#F4D5D1]/80 text-[#B8392E] px-6 py-3 rounded-full font-semibold transition-colors duration-[140ms]"
            >
              −
            </button>
            <button
              onClick={increment}
              className="bg-[#A6553A] hover:bg-[#C16A4D] text-[#FBF7F0] px-6 py-3 rounded-full font-semibold transition-colors duration-[140ms]"
            >
              +
            </button>
            <button
              onClick={reset}
              className="bg-[#ECE3D2] hover:bg-[#DCCFB5] text-[#54422D] px-6 py-3 rounded-full font-semibold transition-colors duration-[140ms]"
            >
              Reset
            </button>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-[#FBF7F0] border border-[#DCCFB5] rounded-xl p-5 shadow-[0_2px_4px_rgba(42,27,14,0.06)]">
          <h2 className="font-semibold text-[#2A1B0E] mb-3">How it works</h2>
          <ul className="text-sm text-[#54422D] space-y-2 list-disc list-inside">
            <li>Each click saves to your device's IndexedDB (offline storage)</li>
            <li>Try going offline (DevTools → Network) and the counter still works</li>
            <li>Refresh the page — your count is restored</li>
            <li>Close the app and reopen it — data persists</li>
          </ul>
        </div>

        {/* Tech stack */}
        <div className="bg-[#FBF7F0] border border-[#DCCFB5] rounded-xl p-5 shadow-[0_2px_4px_rgba(42,27,14,0.06)]">
          <h2 className="font-semibold text-[#2A1B0E] mb-3">Tech stack</h2>
          <p className="text-sm text-[#54422D]">
            This page uses{" "}
            <code className="bg-[#ECE3D2] px-2 py-0.5 rounded text-xs font-mono text-[#2A1B0E]">Dexie.js</code>{" "}
            to manage IndexedDB, providing a simple async wrapper around browser storage.
          </p>
        </div>
      </div>
    </div>
  );
}
