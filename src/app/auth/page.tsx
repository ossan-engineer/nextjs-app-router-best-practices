import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/lib/auth'

import { LoginFormClient } from './_components/LoginForm.client'

/**
 * 認証ページ（Server Component）
 *
 * - Server Component で認証状態をチェック
 * - 認証済みの場合はリダイレクト
 * - CSR での認証チェックではなく、サーバーサイドで判定
 */
export default async function AuthPage() {
  // Server Component で認証チェック
  const user = await getCurrentUser()

  // 既にログイン済みならトップへリダイレクト
  if (user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>
        <LoginFormClient />
      </div>
    </div>
  )
}
