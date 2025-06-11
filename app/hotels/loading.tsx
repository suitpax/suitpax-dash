export default function HotelsLoading() {
  return (
    <div className="min-h-screen bg-black p-3">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="h-8 bg-white/10 rounded w-48 mb-4 animate-pulse"></div>
          <div className="h-4 bg-white/10 rounded w-96 animate-pulse"></div>
        </div>

        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-white/10 rounded-full w-32 animate-pulse"></div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-white/10 rounded animate-pulse"></div>
            ))}
          </div>
          <div className="h-10 bg-white/10 rounded w-40 mt-4 animate-pulse"></div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="h-6 bg-white/10 rounded w-64 mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-white/10 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
