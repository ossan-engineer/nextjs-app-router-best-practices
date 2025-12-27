/**
 * ロボット詳細ページのローディング UI
 */
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-4 bg-gray-200 rounded w-24 mb-4 animate-pulse" />
      <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 詳細情報のスケルトン */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-1">
                <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
                <div className="h-5 bg-gray-200 rounded w-32 animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* 編集フォームのスケルトン */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="h-6 bg-gray-200 rounded w-12 mb-4 animate-pulse" />
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-20 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
