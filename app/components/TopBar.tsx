"use client";

import { usePathname } from "next/navigation";

const pageNames: Record<string, string> = {
  "/": "Home",
  "/counter": "Counter",
  "/notifications": "Notifications",
  "/debug": "Debug",
};

export function TopBar() {
  const pathname = usePathname();
  const title = pageNames[pathname] || "Revenant";

  return (
    <header className="hidden lg:flex items-center px-6 h-16 shrink-0 border-b border-[#DCCFB5] bg-[#FBF7F0]/80 backdrop-blur-sm">
      <h2 className="text-base font-semibold text-[#2A1B0E]">{title}</h2>
    </header>
  );
}
