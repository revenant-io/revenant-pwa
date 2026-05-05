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
    <header className="hidden lg:flex items-center px-6 h-16 shrink-0 border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
    </header>
  );
}
