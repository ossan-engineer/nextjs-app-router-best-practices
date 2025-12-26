/**
 * 認証・認可ロジック
 * Server 側で完結する責務を集約
 */

import { cookies } from 'next/headers'

export type User = {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

// デモ用のユーザーデータ
const users: Map<string, User> = new Map([
  [
    'user-1',
    {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
    },
  ],
  [
    'user-2',
    {
      id: 'user-2',
      name: 'Normal User',
      email: 'user@example.com',
      role: 'user',
    },
  ],
])

const SESSION_COOKIE_NAME = 'session-id'

/**
 * 現在のセッションからユーザーを取得
 * Server Component から直接呼び出す
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!sessionId) {
    return null
  }

  return users.get(sessionId) ?? null
}

/**
 * ユーザーが認証済みかどうかを確認
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser()
  return user !== null
}

/**
 * ユーザーが管理者かどうかを確認
 */
export const isAdmin = async (): Promise<boolean> => {
  const user = await getCurrentUser()
  return user?.role === 'admin'
}

/**
 * ログイン処理（デモ用）
 * 実際のアプリケーションでは認証プロバイダーを使用
 */
export const login = async (
  email: string
): Promise<{ success: boolean; error?: string }> => {
  const user = [...users.values()].find((u) => u.email === email)

  if (!user) {
    return { success: false, error: 'ユーザーが見つかりません' }
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  return { success: true }
}

/**
 * ログアウト処理
 */
export const logout = async (): Promise<void> => {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

/**
 * 認可チェック：特定のロールを持っているか
 */
export const hasRole = async (
  requiredRole: User['role']
): Promise<boolean> => {
  const user = await getCurrentUser()
  if (!user) return false

  // admin は全ての権限を持つ
  if (user.role === 'admin') return true

  return user.role === requiredRole
}
