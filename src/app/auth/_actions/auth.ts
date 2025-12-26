'use server'

import { redirect } from 'next/navigation'

import { login, logout } from '@/lib/auth'

export type AuthActionState = {
  success: boolean
  error?: string
} | null

/**
 * ログイン Server Action
 */
export const loginAction = async (
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> => {
  const email = formData.get('email')

  if (typeof email !== 'string' || !email) {
    return { success: false, error: 'メールアドレスは必須です' }
  }

  const result = await login(email)

  if (!result.success) {
    return { success: false, error: result.error }
  }

  redirect('/')
}

/**
 * ログアウト Server Action
 */
export const logoutAction = async (): Promise<void> => {
  await logout()
  redirect('/auth')
}
