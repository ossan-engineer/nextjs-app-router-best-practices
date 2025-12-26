import { getRobots } from '@/lib/robots'

import { RobotFormClient } from './_components/RobotForm.client'
import { RobotList } from './_components/RobotList'

/**
 * ロボット一覧ページ（Server Component）
 *
 * - データ取得は Server Component で完結
 * - useEffect を使わずにデータ取得
 * - Client Component は操作が必要な部分のみ
 */
export default async function RobotsPage() {
  // Server Component でデータ取得
  // useEffect + fetch ではなく、直接 await
  const robots = await getRobots()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Robots</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 一覧表示（Server Component） */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">一覧</h2>
          <RobotList robots={robots} />
        </div>

        {/* 作成フォーム（Client Component） */}
        <div>
          <h2 className="text-lg font-semibold mb-4">新規作成</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <RobotFormClient mode="create" />
          </div>
        </div>
      </div>
    </div>
  )
}
