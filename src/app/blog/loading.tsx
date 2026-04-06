export default function BlogLoading() {
  return (
    <main className="min-h-screen pt-28 pb-20">
      <section className="px-6">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <div className="h-12 w-48 bg-white/5 rounded-lg animate-pulse mx-auto mb-4" />
          <div className="h-5 w-80 bg-white/5 rounded-lg animate-pulse mx-auto" />
        </div>
        <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="rounded-xl bg-white/5 animate-pulse">
              <div className="aspect-video bg-white/5 rounded-t-xl" />
              <div className="p-6 space-y-3">
                <div className="h-5 w-3/4 bg-white/5 rounded" />
                <div className="h-4 w-full bg-white/5 rounded" />
                <div className="h-3 w-24 bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
