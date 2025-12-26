import Link from 'next/link'

import { Pagination } from '@/components/Pagination'
import { getRobotsPaginated } from '@/lib/robots'

type RobotsPaginatedPageProps = {
  searchParams: Promise<{ page?: string }>
}

/**
 * ページネーション付きロボット一覧（Server Component）
 *
 * - searchParams で現在のページを取得
 * - URL で状態管理（useState は使わない）
 * - Server Component でデータ取得
 */
export default async function RobotsPaginatedPage({
  searchParams,
}: RobotsPaginatedPageProps) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? '1', 10))
  const perPage = 2 // デモ用に少なく設定

  // Server Component でページネーション付きデータ取得
  const { robots, totalPages, currentPage, total } = await getRobotsPaginated(
    page,
    perPage
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/robots" className="text-blue-600 hover:underline">
          ← 通常の一覧に戻る
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-2">Robots（ページネーション付き）</h1>
      <p className="text-gray-600 mb-8">
        全 {total} 件（{currentPage} / {totalPages} ページ）
      </p>

      <div className="space-y-4">
        {robots.map((robot) => (
          <div
            key={robot.id}
            className="p-4 bg-white border rounded-lg shadow-sm"
          >
            <h2 className="font-semibold">{robot.name}</h2>
            <p className="text-sm text-gray-500">
              ステータス: {robot.status} | 作成日:{' '}
              {robot.createdAt.toLocaleDateString('ja-JP')}
            </p>
          </div>
        ))}

        {robots.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            ロボットがありません
          </p>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/robots-paginated"
      />
    </div>
  )
}
