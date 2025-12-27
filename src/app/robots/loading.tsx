/**
 * ロボット一覧のローディング UI
 *
 * page.tsx のデータ取得中に自動的に表示される
 * Suspense boundary として機能する
 */
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 bg-gray-200 rounded w-32 mb-8 animate-pulse" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 一覧のスケルトン */}
        <div className="lg:col-span-2">
          <div className="h-6 bg-gray-200 rounded w-16 mb-4 animate-pulse" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-200 rounded animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* フォームのスケルトン */}
        <div>
          <div className="h-6 bg-gray-200 rounded w-20 mb-4 animate-pulse" />
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-20 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
