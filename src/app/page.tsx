export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="font-heading text-4xl font-bold gradient-text">
          Sam Morris
        </h1>
        <p className="font-body text-text-muted">
          Coach. Builder. Dad.
        </p>
        <p className="font-mono text-accent-lime text-sm">
          20+ Years Coaching
        </p>
        <div className="bg-navy-light glow-border glow-border-hover rounded-xl p-6 max-w-sm mx-auto transition-all">
          <p className="text-accent-blue">Electric Blue Accent</p>
          <p className="text-accent-purple">Vivid Purple</p>
          <p className="text-accent-pink">Hot Pink</p>
        </div>
      </div>
    </main>
  );
}
