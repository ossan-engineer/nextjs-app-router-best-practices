import { describe, expect, it, vi } from 'vitest'

// next/headers のモック
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

import { cookies } from 'next/headers'

import { getCurrentUser, hasRole, isAdmin, isAuthenticated } from './auth'

const mockCookies = cookies as ReturnType<typeof vi.fn>

describe('auth', () => {
  describe('getCurrentUser', () => {
    it('セッションがない場合はnullを返す', async () => {
      mockCookies.mockResolvedValue({
        get: () => undefined,
      })

      const user = await getCurrentUser()
      expect(user).toBeNull()
    })

    it('有効なセッションがある場合はユーザーを返す', async () => {
      mockCookies.mockResolvedValue({
        get: () => ({ value: 'user-1' }),
      })

      const user = await getCurrentUser()
      expect(user).not.toBeNull()
      expect(user?.id).toBe('user-1')
      expect(user?.role).toBe('admin')
    })

    it('無効なセッションIDの場合はnullを返す', async () => {
      mockCookies.mockResolvedValue({
        get: () => ({ value: 'invalid-session' }),
      })

      const user = await getCurrentUser()
      expect(user).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('ユーザーがいる場合はtrueを返す', async () => {
      mockCookies.mockResolvedValue({
        get: () => ({ value: 'user-1' }),
      })

      const result = await isAuthenticated()
      expect(result).toBe(true)
    })

    it('ユーザーがいない場合はfalseを返す', async () => {
      mockCookies.mockResolvedValue({
        get: () => undefined,
      })

      const result = await isAuthenticated()
      expect(result).toBe(false)
    })
  })

  describe('isAdmin', () => {
    it('adminユーザーの場合はtrueを返す', async () => {
      mockCookies.mockResolvedValue({
        get: () => ({ value: 'user-1' }),
      })

      const result = await isAdmin()
      expect(result).toBe(true)
    })

    it('通常ユーザーの場合はfalseを返す', async () => {
      mockCookies.mockResolvedValue({
        get: () => ({ value: 'user-2' }),
      })

      const result = await isAdmin()
      expect(result).toBe(false)
    })

    it('未認証の場合はfalseを返す', async () => {
      mockCookies.mockResolvedValue({
        get: () => undefined,
      })

      const result = await isAdmin()
      expect(result).toBe(false)
    })
  })

  describe('hasRole', () => {
    it('adminユーザーは全てのロールを持つ', async () => {
      mockCookies.mockResolvedValue({
        get: () => ({ value: 'user-1' }),
      })

      expect(await hasRole('admin')).toBe(true)
      expect(await hasRole('user')).toBe(true)
    })

    it('通常ユーザーはuserロールのみ持つ', async () => {
      mockCookies.mockResolvedValue({
        get: () => ({ value: 'user-2' }),
      })

      expect(await hasRole('user')).toBe(true)
      expect(await hasRole('admin')).toBe(false)
    })

    it('未認証の場合は全てfalse', async () => {
      mockCookies.mockResolvedValue({
        get: () => undefined,
      })

      expect(await hasRole('user')).toBe(false)
      expect(await hasRole('admin')).toBe(false)
    })
  })
})
