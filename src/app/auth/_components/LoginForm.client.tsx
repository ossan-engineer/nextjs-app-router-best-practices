'use client'

import { useActionState } from 'react'

import { type AuthActionState, loginAction } from '../_actions/auth'

/**
 * ログインフォーム（Client Component）
 *
 * Server Actions を使用してログイン処理
 */
export const LoginFormClient = () => {
  const [state, formAction, pending] = useActionState<
    AuthActionState,
    FormData
  >(loginAction, null)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          メールアドレス
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="admin@example.com または user@example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={pending}
        />
        <p className="text-xs text-gray-500 mt-1">
          デモ用：admin@example.com（管理者）または user@example.com（一般）
        </p>
      </div>

      {state?.error && (
        <p className="text-red-600 text-sm" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? 'ログイン中...' : 'ログイン'}
      </button>
    </form>
  )
}
