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
    <nav className="lg:hidden flex items-center justify-around bg-[#FBF7F0]/95 backdrop-blur-md border-t border-[#DCCFB5] safe-bottom">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center gap-1 py-3 px-4 min-h-[56px] justify-center transition-colors duration-[140ms] ${
              isActive ? "text-[#A6553A]" : "text-[#8A6F4F] hover:text-[#2A1B0E]"
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
