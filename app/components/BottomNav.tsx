"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function WalletIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="1.5" y="4.5" width="15" height="10.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1.5 7.5h15" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="13.5" cy="11.25" r="1.125" fill="currentColor" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.5 15.5c0-3.314 2.91-6 6.5-6s6.5 2.686 6.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

const tabs = [
  { href: "/",        label: "Home",     icon: <span className="text-lg">🏠</span> },
  { href: "/expenses", label: "Expenses", icon: <WalletIcon /> },
  { href: "/debug",   label: "Debug",    icon: <span className="text-lg">🛠️</span> },
  { href: "/profile", label: "Profile",  icon: <UserIcon /> },
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
            {tab.icon}
            <span className="text-xs font-medium">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
