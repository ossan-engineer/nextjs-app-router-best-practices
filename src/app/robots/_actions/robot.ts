'use server'

import { revalidatePath } from 'next/cache'

import {
  createRobot as createRobotInDb,
  deleteRobot as deleteRobotInDb,
  updateRobot as updateRobotInDb,
  validateRobotName,
} from '@/lib/robots'

export type ActionState = {
  success: boolean
  error?: string
} | null

/**
 * ロボット作成 Server Action
 */
export const createRobotAction = async (
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const name = formData.get('name')

  if (typeof name !== 'string') {
    return { success: false, error: '名前は必須です' }
  }

  const validationError = validateRobotName(name)
  if (validationError) {
    return { success: false, error: validationError }
  }

  const status = formData.get('status')
  const validStatuses = ['active', 'inactive', 'maintenance'] as const

  await createRobotInDb({
    name,
    status:
      typeof status === 'string' &&
      validStatuses.includes(status as (typeof validStatuses)[number])
        ? (status as (typeof validStatuses)[number])
        : 'inactive',
  })

  revalidatePath('/robots')
  return { success: true }
}

/**
 * ロボット更新 Server Action
 */
export const updateRobotAction = async (
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const id = formData.get('id')
  const name = formData.get('name')

  if (typeof id !== 'string') {
    return { success: false, error: 'IDは必須です' }
  }

  if (typeof name !== 'string') {
    return { success: false, error: '名前は必須です' }
  }

  const validationError = validateRobotName(name)
  if (validationError) {
    return { success: false, error: validationError }
  }

  const status = formData.get('status')
  const validStatuses = ['active', 'inactive', 'maintenance'] as const

  const result = await updateRobotInDb(id, {
    name,
    status:
      typeof status === 'string' &&
      validStatuses.includes(status as (typeof validStatuses)[number])
        ? (status as (typeof validStatuses)[number])
        : undefined,
  })

  if (!result) {
    return { success: false, error: 'ロボットが見つかりません' }
  }

  revalidatePath('/robots')
  revalidatePath(`/robots/${id}`)
  return { success: true }
}

/**
 * ロボット削除 Server Action
 */
export const deleteRobotAction = async (
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const id = formData.get('id')

  if (typeof id !== 'string') {
    return { success: false, error: 'IDは必須です' }
  }

  const result = await deleteRobotInDb(id)

  if (!result) {
    return { success: false, error: 'ロボットが見つかりません' }
  }

  revalidatePath('/robots')
  return { success: true }
}
