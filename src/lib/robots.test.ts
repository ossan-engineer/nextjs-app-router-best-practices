import { describe, expect, it } from 'vitest'

import {
  createRobot,
  deleteRobot,
  getRobotById,
  getRobots,
  getRobotsPaginated,
  updateRobot,
  validateRobotName,
} from './robots'

describe('robots', () => {
  describe('getRobots', () => {
    it('全ロボットを取得できる', async () => {
      const robots = await getRobots()
      expect(robots.length).toBeGreaterThan(0)
      expect(robots[0]).toHaveProperty('id')
      expect(robots[0]).toHaveProperty('name')
      expect(robots[0]).toHaveProperty('status')
    })
  })

  describe('getRobotsPaginated', () => {
    it('ページネーション情報を含めて取得できる', async () => {
      const result = await getRobotsPaginated(1, 2)
      expect(result).toHaveProperty('robots')
      expect(result).toHaveProperty('total')
      expect(result).toHaveProperty('totalPages')
      expect(result).toHaveProperty('currentPage')
      expect(result.currentPage).toBe(1)
      expect(result.robots.length).toBeLessThanOrEqual(2)
    })
  })

  describe('getRobotById', () => {
    it('存在するIDでロボットを取得できる', async () => {
      const robot = await getRobotById('1')
      expect(robot).not.toBeNull()
      expect(robot?.id).toBe('1')
    })

    it('存在しないIDではnullを返す', async () => {
      const robot = await getRobotById('nonexistent')
      expect(robot).toBeNull()
    })
  })

  describe('createRobot', () => {
    it('新しいロボットを作成できる', async () => {
      const robot = await createRobot({ name: 'Test Robot' })
      expect(robot).toHaveProperty('id')
      expect(robot.name).toBe('Test Robot')
      expect(robot.status).toBe('inactive')
    })

    it('ステータスを指定して作成できる', async () => {
      const robot = await createRobot({ name: 'Active Robot', status: 'active' })
      expect(robot.status).toBe('active')
    })
  })

  describe('updateRobot', () => {
    it('ロボットを更新できる', async () => {
      const created = await createRobot({ name: 'Update Test' })
      const updated = await updateRobot(created.id, { name: 'Updated Name' })
      expect(updated?.name).toBe('Updated Name')
      expect(updated?.updatedAt.getTime()).toBeGreaterThanOrEqual(
        created.updatedAt.getTime()
      )
    })

    it('存在しないIDではnullを返す', async () => {
      const result = await updateRobot('nonexistent', { name: 'Test' })
      expect(result).toBeNull()
    })
  })

  describe('deleteRobot', () => {
    it('ロボットを削除できる', async () => {
      const created = await createRobot({ name: 'Delete Test' })
      const deleted = await deleteRobot(created.id)
      expect(deleted).toBe(true)

      const found = await getRobotById(created.id)
      expect(found).toBeNull()
    })

    it('存在しないIDではfalseを返す', async () => {
      const result = await deleteRobot('nonexistent')
      expect(result).toBe(false)
    })
  })

  describe('validateRobotName', () => {
    it('有効な名前ではnullを返す', () => {
      expect(validateRobotName('Valid Name')).toBeNull()
    })

    it('空文字ではエラーメッセージを返す', () => {
      expect(validateRobotName('')).toBe('名前は必須です')
    })

    it('空白のみではエラーメッセージを返す', () => {
      expect(validateRobotName('   ')).toBe('名前は必須です')
    })

    it('51文字以上ではエラーメッセージを返す', () => {
      const longName = 'a'.repeat(51)
      expect(validateRobotName(longName)).toBe(
        '名前は50文字以内で入力してください'
      )
    })

    it('50文字ちょうどでは有効', () => {
      const maxName = 'a'.repeat(50)
      expect(validateRobotName(maxName)).toBeNull()
    })
  })
})
