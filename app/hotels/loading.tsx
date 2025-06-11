export default function Loading() {
  return (
    <div className="min-h-screen bg-black p-3">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header skeleton */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="h-8 bg-white/10 rounded w-48 mb-4 animate-pulse"></div>
          <div className="h-4 bg-white/10 rounded w-96 animate-pulse"></div>
        </div>

        {/* Search form skeleton */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="h-12 bg-white/10 rounded animate-pulse"></div>
            <div className="h-12 bg-white/10 rounded animate-pulse"></div>
            <div className="h-12 bg-white/10 rounded animate-pulse"></div>
            <div className="h-12 bg-white/10 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Results skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              <div className="h-48 bg-white/10 animate-pulse"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 bg-white/10 rounded animate-pulse"></div>
                <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-white/10 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
