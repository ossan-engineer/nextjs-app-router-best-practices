import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getRobotById } from '@/lib/robots'

import { RobotFormClient } from '../_components/RobotForm.client'

type RobotDetailPageProps = {
  params: Promise<{ id: string }>
}

/**
 * ロボット詳細ページ（Server Component）
 *
 * - 動的ルートでIDを取得
 * - データ取得は Server Component で完結
 * - 存在しない場合は notFound() で 404
 */
export default async function RobotDetailPage({ params }: RobotDetailPageProps) {
  const { id } = await params
  const robot = await getRobotById(id)

  if (!robot) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/robots" className="text-blue-600 hover:underline">
          ← 一覧に戻る
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-8">{robot.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 詳細情報（Server Component で描画） */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">詳細情報</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">ID</dt>
              <dd className="mt-1">{robot.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">名前</dt>
              <dd className="mt-1">{robot.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">ステータス</dt>
              <dd className="mt-1">{robot.status}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">作成日</dt>
              <dd className="mt-1">
                {robot.createdAt.toLocaleDateString('ja-JP')}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">更新日</dt>
              <dd className="mt-1">
                {robot.updatedAt.toLocaleDateString('ja-JP')}
              </dd>
            </div>
          </dl>
        </div>

        {/* 編集フォーム（Client Component） */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">編集</h2>
          <RobotFormClient robot={robot} mode="edit" />
        </div>
      </div>
    </div>
  )
}
