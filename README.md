# Next.js App Router Best Practices

Next.js App Router（RSC 前提）における**最小かつ実務的な初期設計**を示すベストプラクティス集です。

## このリポジトリについて

- App Router を「使っている」ではなく**思想として理解して使う**
- CSR / Pages Router 脳から脱却した設計を示す
- RSC 前提で**責務の置き場所の判断基準**を明確にする

テンプレート集でも、フルスタック雛形でもありません。
**設計判断をコード構造で示すためのリポジトリ**です。

## Quick Start

```bash
pnpm install
pnpm dev
```

http://localhost:3000 でアプリケーションが起動します。

## 設計思想

### Server Component First

- Server Component がデフォルト
- Client Component は最後の手段
- データ取得はサーバーで完結
- useEffect は DOM が必要な場合のみ

### 責務分離

| 責務 | 配置 |
|------|------|
| データ取得 | Server Component |
| ビジネスロジック | lib/ |
| 副作用（CRUD） | Server Actions |
| UI 状態・操作 | Client Component |

## Before / After

### データ取得

**Before（CSR / useEffect）**

```tsx
'use client'
export default function RobotList() {
  const [robots, setRobots] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/robots')
      .then(res => res.json())
      .then(data => {
        setRobots(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading...</p>
  return <ul>{robots.map(r => <li key={r.id}>{r.name}</li>)}</ul>
}
```

**After（RSC）**

```tsx
// Server Component - 'use client' なし
import { getRobots } from '@/lib/robots'

export default async function RobotList() {
  const robots = await getRobots()
  return <ul>{robots.map(r => <li key={r.id}>{r.name}</li>)}</ul>
}
```

### フォーム送信

**Before（CSR / useState + fetch）**

```tsx
'use client'
export default function CreateRobotForm() {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await fetch('/api/robots', { method: 'POST', body: JSON.stringify({ name }) })
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} />
      <button disabled={submitting}>Create</button>
    </form>
  )
}
```

**After（Server Actions + useActionState）**

```tsx
'use client'
import { useActionState } from 'react'
import { createRobot } from './_actions/robot'

export default function CreateRobotForm() {
  const [state, action, pending] = useActionState(createRobot, null)

  return (
    <form action={action}>
      <input name="name" />
      <button disabled={pending}>Create</button>
      {state?.error && <p>{state.error}</p>}
    </form>
  )
}
```

## ディレクトリ構成

```
src/
├─ app/
│  ├─ layout.tsx           # ルートレイアウト（Server Component）
│  ├─ page.tsx             # トップページ（Server Component）
│  ├─ auth/
│  │  ├─ page.tsx          # 認証ページ（Server Component）
│  │  └─ _actions/         # 認証 Server Actions
│  ├─ robots/
│  │  ├─ page.tsx          # 一覧ページ（Server Component）
│  │  ├─ loading.tsx       # ローディング UI
│  │  ├─ [id]/
│  │  │  ├─ page.tsx       # 詳細ページ（Server Component）
│  │  │  └─ loading.tsx    # ローディング UI
│  │  ├─ _actions/         # Server Actions
│  │  │  ├─ robot.ts
│  │  │  └─ robot.test.ts  # テスト
│  │  └─ _components/      # ページ固有コンポーネント
│  └─ robots-paginated/    # ページネーション例
├─ components/             # 共有コンポーネント
│  ├─ Header.tsx           # Server Component
│  ├─ Pagination.tsx       # Server Component
│  └─ LogoutButton.client.tsx  # Client Component
└─ lib/                    # ビジネスロジック
   ├─ robots.ts
   ├─ robots.test.ts
   ├─ auth.ts
   └─ auth.test.ts
```

### 命名規則

- `*.client.tsx` - Client Component（明示的に区別）
- `_actions/` - Server Actions（private）
- `_components/` - ページ固有コンポーネント（private）
- `loading.tsx` - ローディング UI（自動的に Suspense boundary として機能）

## サンプル機能

### 1. Robots（CRUD + 一覧表示）

- `/robots` - 一覧表示 + 新規作成
- `/robots/[id]` - 詳細 + 編集

**ポイント:**
- Server Component でデータ取得
- Server Actions で CRUD
- useActionState でフォーム状態管理
- loading.tsx でスケルトン UI

### 2. 認証

- `/auth` - ログインページ

**ポイント:**
- Server Component で認証チェック
- 認証済みならリダイレクト
- cookies() で セッション管理

### 3. ページネーション

- `/robots-paginated` - URL パラメータでページ管理

**ポイント:**
- searchParams で状態管理
- useState ではなく URL で状態を持つ
- SEO フレンドリー

## テスト

```bash
# 全テスト実行
pnpm test

# 個別実行
pnpm test run src/lib/robots.test.ts
pnpm test run src/app/robots/_actions/robot.test.ts
```

テストファイルは本体と同じ階層に配置しています。

## やらないこと

- Pages Router 互換の設計
- CSR 前提のデータ取得（useEffect + fetch）
- API Routes を UI 専用に使う構成
- グローバルな状態管理ライブラリの導入
- hooks ディレクトリの乱立

## 参考資料

- [Next.js App Router](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

## ライセンス

MIT
