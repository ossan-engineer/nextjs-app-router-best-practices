/**
 * Robot データの型定義と取得・操作ロジック
 * Server 側で完結する責務を集約
 */

export type Robot = {
  id: string
  name: string
  status: 'active' | 'inactive' | 'maintenance'
  createdAt: Date
  updatedAt: Date
}

export type CreateRobotInput = {
  name: string
  status?: Robot['status']
}

export type UpdateRobotInput = {
  name?: string
  status?: Robot['status']
}

// インメモリデータストア（デモ用）
const robots: Map<string, Robot> = new Map([
  [
    '1',
    {
      id: '1',
      name: 'Alpha-01',
      status: 'active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ],
  [
    '2',
    {
      id: '2',
      name: 'Beta-02',
      status: 'maintenance',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-03-15'),
    },
  ],
  [
    '3',
    {
      id: '3',
      name: 'Gamma-03',
      status: 'inactive',
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-01'),
    },
  ],
])

/**
 * 全ロボットを取得
 */
export const getRobots = async (): Promise<readonly Robot[]> => {
  // 実際のアプリケーションでは DB からの取得
  await simulateDelay()
  return [...robots.values()]
}

/**
 * ページネーション付きでロボットを取得
 */
export const getRobotsPaginated = async (
  page: number,
  perPage: number = 10
): Promise<{
  robots: readonly Robot[]
  total: number
  totalPages: number
  currentPage: number
}> => {
  await simulateDelay()
  const allRobots = [...robots.values()]
  const total = allRobots.length
  const totalPages = Math.ceil(total / perPage)
  const start = (page - 1) * perPage
  const end = start + perPage

  return {
    robots: allRobots.slice(start, end),
    total,
    totalPages,
    currentPage: page,
  }
}

/**
 * ID でロボットを取得
 */
export const getRobotById = async (id: string): Promise<Robot | null> => {
  await simulateDelay()
  return robots.get(id) ?? null
}

/**
 * ロボットを作成
 */
export const createRobot = async (input: CreateRobotInput): Promise<Robot> => {
  await simulateDelay()
  const id = generateId()
  const now = new Date()
  const robot: Robot = {
    id,
    name: input.name,
    status: input.status ?? 'inactive',
    createdAt: now,
    updatedAt: now,
  }
  robots.set(id, robot)
  return robot
}

/**
 * ロボットを更新
 */
export const updateRobot = async (
  id: string,
  input: UpdateRobotInput
): Promise<Robot | null> => {
  await simulateDelay()
  const existing = robots.get(id)
  if (!existing) return null

  const updated: Robot = {
    ...existing,
    ...input,
    updatedAt: new Date(),
  }
  robots.set(id, updated)
  return updated
}

/**
 * ロボットを削除
 */
export const deleteRobot = async (id: string): Promise<boolean> => {
  await simulateDelay()
  return robots.delete(id)
}

// ヘルパー関数
const simulateDelay = () => new Promise((resolve) => setTimeout(resolve, 100))

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9)
}

// バリデーション
export const validateRobotName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return '名前は必須です'
  }
  if (name.length > 50) {
    return '名前は50文字以内で入力してください'
  }
  return null
}
