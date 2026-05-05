"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/counter", label: "Counter", icon: "📊" },
  { href: "/notifications", label: "Notifications", icon: "🔔" },
  { href: "/debug", label: "Debug", icon: "🛠️" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-[#DCCFB5] bg-[#FBF7F0] safe-top">
      <div className="px-6 py-5 border-b border-[#DCCFB5]">
        <h1
          className="text-xl text-[#2A1B0E] font-medium tracking-[-0.01em]"
          style={{ fontFamily: "var(--font-fraunces), 'Iowan Old Style', Georgia, serif" }}
        >
          Revenant
        </h1>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-[140ms] ${
                isActive
                  ? "bg-[#F4DED1] text-[#A6553A]"
                  : "text-[#54422D] hover:bg-[#ECE3D2]"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
