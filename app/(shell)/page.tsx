export default function Home() {
  return (
    <div className="max-w-2xl mx-auto p-4 py-10">
      {/* Welcome header */}
      <div className="mb-10">
        <h1
          className="text-3xl text-[#2A1B0E] font-medium tracking-tight mb-2"
          style={{ fontFamily: "var(--font-fraunces), 'Iowan Old Style', Georgia, serif" }}
        >
          Welcome to Revenant
        </h1>
        <p className="text-[#8A6F4F]">Your workspace is loading up.</p>
      </div>

      {/* Skeleton cards row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-[#FBF7F0] border border-[#DCCFB5] rounded-xl p-4 space-y-3 animate-pulse shadow-[0_2px_4px_rgba(42,27,14,0.06)]">
            <div className="h-3 w-1/2 bg-[#DCCFB5] rounded-full" />
            <div className="h-6 w-3/4 bg-[#DCCFB5] rounded-full" />
          </div>
        ))}
      </div>

      {/* Skeleton main card */}
      <div className="bg-[#FBF7F0] border border-[#DCCFB5] rounded-xl p-5 mb-6 animate-pulse space-y-4 shadow-[0_2px_4px_rgba(42,27,14,0.06)]">
        <div className="h-4 w-1/3 bg-[#DCCFB5] rounded-full" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-[#DCCFB5] rounded-full" />
          <div className="h-3 w-5/6 bg-[#DCCFB5] rounded-full" />
          <div className="h-3 w-2/3 bg-[#DCCFB5] rounded-full" />
        </div>
        <div className="h-8 w-28 bg-[#DCCFB5] rounded-full" />
      </div>

      {/* Skeleton list */}
      <div className="bg-[#FBF7F0] border border-[#DCCFB5] rounded-xl divide-y divide-[#DCCFB5] animate-pulse shadow-[0_2px_4px_rgba(42,27,14,0.06)]">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-4">
            <div className="w-8 h-8 rounded-full bg-[#DCCFB5] shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 bg-[#DCCFB5] rounded-full" />
              <div className="h-2.5 w-2/3 bg-[#ECE3D2] rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
