export default function Home() {
  return (
    <div className="max-w-2xl mx-auto p-4 py-10">
      {/* Welcome header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to Revenant</h1>
        <p className="text-slate-400">Your workspace is loading up.</p>
      </div>

      {/* Skeleton cards row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-3 animate-pulse">
            <div className="h-3 w-1/2 bg-slate-700 rounded-full" />
            <div className="h-6 w-3/4 bg-slate-700 rounded-full" />
          </div>
        ))}
      </div>

      {/* Skeleton main card */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 mb-6 animate-pulse space-y-4">
        <div className="h-4 w-1/3 bg-slate-700 rounded-full" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-slate-700 rounded-full" />
          <div className="h-3 w-5/6 bg-slate-700 rounded-full" />
          <div className="h-3 w-2/3 bg-slate-700 rounded-full" />
        </div>
        <div className="h-8 w-28 bg-slate-700 rounded-lg" />
      </div>

      {/* Skeleton list */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl divide-y divide-slate-700 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-4">
            <div className="w-8 h-8 rounded-full bg-slate-700 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 bg-slate-700 rounded-full" />
              <div className="h-2.5 w-2/3 bg-slate-700/70 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
