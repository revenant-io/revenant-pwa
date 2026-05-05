import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";
import { ChatWidget } from "./ChatWidget";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex full-height overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto overscroll-contain safe-top lg:pt-0">
          {children}
        </main>
        <BottomNav />
      </div>
      <ChatWidget />
    </div>
  );
}
