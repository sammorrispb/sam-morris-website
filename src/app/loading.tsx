export default function Loading() {
  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto animate-pulse">
      {/* Hero placeholder */}
      <div className="bg-white/5 rounded-lg h-80 mb-8" />

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white/5 rounded-lg h-20" />
        <div className="bg-white/5 rounded-lg h-20" />
        <div className="bg-white/5 rounded-lg h-20" />
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 rounded-lg h-64" />
        <div className="bg-white/5 rounded-lg h-64" />
        <div className="bg-white/5 rounded-lg h-64" />
      </div>
    </div>
  );
}
