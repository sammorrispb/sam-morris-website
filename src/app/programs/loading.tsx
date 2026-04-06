export default function ProgramsLoading() {
  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto animate-pulse">
      {/* Nav bar placeholder */}
      <div className="flex gap-3 mb-8">
        <div className="bg-white/5 rounded-lg h-10 w-24" />
        <div className="bg-white/5 rounded-lg h-10 w-24" />
        <div className="bg-white/5 rounded-lg h-10 w-24" />
        <div className="bg-white/5 rounded-lg h-10 w-24" />
      </div>

      {/* Hero */}
      <div className="bg-white/5 rounded-lg h-64 mb-8" />

      {/* Content area with card grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 rounded-lg h-56" />
        <div className="bg-white/5 rounded-lg h-56" />
        <div className="bg-white/5 rounded-lg h-56" />
      </div>
    </div>
  );
}
