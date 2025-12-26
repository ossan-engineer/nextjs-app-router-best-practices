import Link from 'next/link'

import { getCurrentUser } from '@/lib/auth'

import { LogoutButtonClient } from './LogoutButton.client'

/**
 * ヘッダー（Server Component）
 *
 * - Server Component で認証状態を取得
 * - 認証状態に応じた表示切り替え
 * - ログアウトボタンのみ Client Component
 */
export const Header = async () => {
  // Server Component で認証チェック
  const user = await getCurrentUser()

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          App Router Demo
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/robots" className="hover:underline">
            Robots
          </Link>
          <Link href="/robots-paginated" className="hover:underline">
            Paginated
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user.name}（{user.role}）
              </span>
              <LogoutButtonClient />
            </div>
          ) : (
            <Link
              href="/auth"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              ログイン
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
