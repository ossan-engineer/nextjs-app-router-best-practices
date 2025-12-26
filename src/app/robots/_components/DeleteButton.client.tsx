'use client'

import { useActionState } from 'react'

import { type ActionState, deleteRobotAction } from '../_actions/robot'

type DeleteButtonProps = {
  robotId: string
  robotName: string
}

/**
 * ロボット削除ボタン（Client Component）
 *
 * 確認ダイアログ + Server Actions による削除
 */
export const DeleteButtonClient = ({
  robotId,
  robotName,
}: DeleteButtonProps) => {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    deleteRobotAction,
    null
  )

  const handleSubmit = (formData: FormData) => {
    if (confirm(`「${robotName}」を削除しますか？`)) {
      formAction(formData)
    }
  }

  return (
    <form action={handleSubmit}>
      <input type="hidden" name="id" value={robotId} />
      <button
        type="submit"
        disabled={pending}
        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? '削除中...' : '削除'}
      </button>
      {state?.error && (
        <span className="ml-2 text-red-600 text-sm">{state.error}</span>
      )}
    </form>
  )
}
