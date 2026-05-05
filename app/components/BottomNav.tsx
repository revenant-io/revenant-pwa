"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/counter", label: "Counter", icon: "📊" },
  { href: "/notifications", label: "Alerts", icon: "🔔" },
  { href: "/debug", label: "Debug", icon: "🛠️" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden flex items-center justify-around bg-slate-900/95 backdrop-blur-md border-t border-slate-700 safe-bottom">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center gap-1 py-3 px-4 min-h-[56px] justify-center transition-colors ${
              isActive ? "text-blue-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
