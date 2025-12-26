'use client'

import { logoutAction } from '@/app/auth/_actions/auth'

/**
 * ログアウトボタン（Client Component）
 *
 * form action で Server Action を呼び出し
 */
export const LogoutButtonClient = () => {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
      >
        ログアウト
      </button>
    </form>
  )
}
