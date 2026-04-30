"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
      if (data) {
        setCount(data.count);
      }
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
    return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <header className="border-b border-slate-700 p-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm font-medium mb-2 block">
            ← Back
          </Link>
          <h1 className="text-3xl font-bold">Offline Counter</h1>
          <p className="text-slate-400 mt-1">Data persists using IndexedDB</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 py-8">
        <div className="space-y-8">
          {/* Status */}
          <div className={`p-4 rounded-lg border text-center ${isOnline ? "bg-green-900/20 border-green-500" : "bg-red-900/20 border-red-500"}`}>
            <p className="text-sm text-slate-300">Network Status</p>
            <p className="text-lg font-semibold">{isOnline ? "🟢 Online" : "🔴 Offline"}</p>
            <p className="text-xs text-slate-400 mt-2">Try toggling offline in DevTools to test</p>
          </div>

          {/* Counter Display */}
          <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-8 text-center">
            <p className="text-slate-400 text-sm mb-4">Current Count</p>
            <div className="text-6xl font-bold text-blue-400 mb-8">{count}</div>

            {/* Controls */}
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={decrement}
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                −
              </button>
              <button
                onClick={increment}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                +
              </button>
              <button
                onClick={reset}
                className="bg-slate-600 hover:bg-slate-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
            <h2 className="font-semibold mb-3">📚 How it works</h2>
            <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
              <li>Each click saves to your device's IndexedDB (offline storage)</li>
              <li>Try going offline (DevTools → Network) and the counter still works</li>
              <li>Refresh the page - your count is restored</li>
              <li>Close the app and reopen it - data persists</li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
            <h2 className="font-semibold mb-3">🛠 Tech Stack</h2>
            <p className="text-sm text-slate-300">
              This page uses <code className="bg-slate-800 px-2 py-1 rounded text-xs">Dexie.js</code> to manage IndexedDB, providing a simple async wrapper around browser storage.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
