import Link from 'next/link'

import type { Robot } from '@/lib/robots'

import { DeleteButtonClient } from './DeleteButton.client'

type RobotListProps = {
  robots: readonly Robot[]
}

const statusLabels: Record<Robot['status'], string> = {
  active: 'Active',
  inactive: 'Inactive',
  maintenance: 'Maintenance',
}

const statusColors: Record<Robot['status'], string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  maintenance: 'bg-yellow-100 text-yellow-800',
}

/**
 * ロボット一覧（Server Component）
 *
 * - データは親の Server Component から props として受け取る
 * - 削除ボタンのみ Client Component として切り出し
 * - useEffect を使わずにデータ表示が完結
 */
export const RobotList = ({ robots }: RobotListProps) => {
  if (robots.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        ロボットがありません。新しく作成してください。
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              名前
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ステータス
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              作成日
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {robots.map((robot) => (
            <tr key={robot.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  href={`/robots/${robot.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {robot.name}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${statusColors[robot.status]}`}
                >
                  {statusLabels[robot.status]}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {robot.createdAt.toLocaleDateString('ja-JP')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <DeleteButtonClient robotId={robot.id} robotName={robot.name} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
