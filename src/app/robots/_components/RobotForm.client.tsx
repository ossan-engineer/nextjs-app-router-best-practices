'use client'

import { useActionState } from 'react'

import type { Robot } from '@/lib/robots'

import {
  type ActionState,
  createRobotAction,
  updateRobotAction,
} from '../_actions/robot'

type RobotFormProps = {
  robot?: Robot
  mode: 'create' | 'edit'
}

/**
 * ロボット作成・編集フォーム（Client Component）
 *
 * useActionState を使用して Server Actions と連携
 * CSR 的な useState + fetch ではなく、Server Actions を直接使用
 */
export const RobotFormClient = ({ robot, mode }: RobotFormProps) => {
  const action = mode === 'create' ? createRobotAction : updateRobotAction
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    null
  )

  return (
    <form action={formAction} className="space-y-4">
      {mode === 'edit' && robot && (
        <input type="hidden" name="id" value={robot.id} />
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          名前
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={robot?.name ?? ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={pending}
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium mb-1">
          ステータス
        </label>
        <select
          id="status"
          name="status"
          defaultValue={robot?.status ?? 'inactive'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={pending}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      {state?.error && (
        <p className="text-red-600 text-sm" role="alert">
          {state.error}
        </p>
      )}

      {state?.success && (
        <p className="text-green-600 text-sm" role="status">
          {mode === 'create' ? '作成しました' : '更新しました'}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending
          ? '処理中...'
          : mode === 'create'
            ? '作成'
            : '更新'}
      </button>
    </form>
  )
}
