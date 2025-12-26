import { describe, expect, it, vi } from 'vitest'

// next/cache のモック
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

import {
  createRobotAction,
  deleteRobotAction,
  updateRobotAction,
} from './robot'

const createFormData = (data: Record<string, string>): FormData => {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    formData.set(key, value)
  })
  return formData
}

describe('robot actions', () => {
  describe('createRobotAction', () => {
    it('有効なデータで作成できる', async () => {
      const formData = createFormData({ name: 'New Robot' })
      const result = await createRobotAction(null, formData)
      expect(result?.success).toBe(true)
    })

    it('名前が空の場合はエラー', async () => {
      const formData = createFormData({ name: '' })
      const result = await createRobotAction(null, formData)
      expect(result?.success).toBe(false)
      expect(result?.error).toBe('名前は必須です')
    })

    it('名前が長すぎる場合はエラー', async () => {
      const formData = createFormData({ name: 'a'.repeat(51) })
      const result = await createRobotAction(null, formData)
      expect(result?.success).toBe(false)
      expect(result?.error).toBe('名前は50文字以内で入力してください')
    })

    it('ステータスを指定して作成できる', async () => {
      const formData = createFormData({ name: 'Active Robot', status: 'active' })
      const result = await createRobotAction(null, formData)
      expect(result?.success).toBe(true)
    })
  })

  describe('updateRobotAction', () => {
    it('存在するロボットを更新できる', async () => {
      const formData = createFormData({ id: '1', name: 'Updated Name' })
      const result = await updateRobotAction(null, formData)
      expect(result?.success).toBe(true)
    })

    it('IDがない場合はエラー', async () => {
      const formData = createFormData({ name: 'Test' })
      const result = await updateRobotAction(null, formData)
      expect(result?.success).toBe(false)
      expect(result?.error).toBe('IDは必須です')
    })

    it('名前が空の場合はエラー', async () => {
      const formData = createFormData({ id: '1', name: '' })
      const result = await updateRobotAction(null, formData)
      expect(result?.success).toBe(false)
      expect(result?.error).toBe('名前は必須です')
    })

    it('存在しないロボットの場合はエラー', async () => {
      const formData = createFormData({ id: 'nonexistent', name: 'Test' })
      const result = await updateRobotAction(null, formData)
      expect(result?.success).toBe(false)
      expect(result?.error).toBe('ロボットが見つかりません')
    })
  })

  describe('deleteRobotAction', () => {
    it('存在するロボットを削除できる', async () => {
      // まず新しいロボットを作成
      const createFormData1 = createFormData({ name: 'To Delete' })
      await createRobotAction(null, createFormData1)

      const formData = createFormData({ id: '1' })
      const result = await deleteRobotAction(null, formData)
      expect(result?.success).toBe(true)
    })

    it('IDがない場合はエラー', async () => {
      const formData = new FormData()
      const result = await deleteRobotAction(null, formData)
      expect(result?.success).toBe(false)
      expect(result?.error).toBe('IDは必須です')
    })

    it('存在しないロボットの場合はエラー', async () => {
      const formData = createFormData({ id: 'nonexistent' })
      const result = await deleteRobotAction(null, formData)
      expect(result?.success).toBe(false)
      expect(result?.error).toBe('ロボットが見つかりません')
    })
  })
})
