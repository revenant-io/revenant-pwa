"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function WalletIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="1.5" y="4.5" width="15" height="10.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1.5 7.5h15" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="13.5" cy="11.25" r="1.125" fill="currentColor" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.5 15.5c0-3.314 2.91-6 6.5-6s6.5 2.686 6.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

const navItems = [
  { href: "/",         label: "Home",     icon: <span className="text-lg">🏠</span> },
  { href: "/expenses", label: "Expenses", icon: <WalletIcon /> },
  { href: "/debug",    label: "Debug",    icon: <span className="text-lg">🛠️</span> },
  { href: "/profile",  label: "Profile",  icon: <UserIcon /> },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-[#DCCFB5] bg-[#FBF7F0] safe-top">
      <div className="px-6 h-16 flex items-center border-b border-[#DCCFB5]">
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
              {item.icon}
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
