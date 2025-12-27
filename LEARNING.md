# LEARNING.md - RSC 学習カリキュラム

このドキュメントは、React Server Components（RSC）について何も知らない状態から、このコードベースを理解できるようになるための学習カリキュラムです。

## 前提知識

- React の基本（コンポーネント、props、useState）
- TypeScript の基本
- Next.js の存在を知っている程度で OK

---

## Step 1: Server Component と Client Component の違いを知る

### 概念

React には 2 種類のコンポーネントがあります。

| 種類 | 実行場所 | 特徴 |
|------|----------|------|
| Server Component | サーバー | データ取得可能、useState 不可 |
| Client Component | ブラウザ | useState 可能、イベントハンドラ・DOM・ブラウザ API を扱える |

**重要**: Next.js App Router では、**デフォルトが Server Component** です。

### 読むファイル

1. **[src/app/page.tsx](src/app/page.tsx)** - トップページ

   ```tsx
   // 'use client' がない = Server Component
   export default function Home() {
     return <div>...</div>
   }
   ```

   **確認ポイント**:
   - ファイルの先頭に `'use client'` がない
   - これが Server Component である証拠

2. **[src/components/LogoutButton.client.tsx](src/components/LogoutButton.client.tsx)** - ログアウトボタン

   ```tsx
   'use client'  // ← これが Client Component の宣言

   export const LogoutButtonClient = () => {
     return <form>...</form>
   }
   ```

   **確認ポイント**:
   - ファイル先頭の `'use client'`
   - ファイル名に `.client.tsx` をつけて明示的に区別（このプロジェクトの規約）

### 練習問題

以下のファイルが Server / Client どちらか判定してください。

1. `src/app/robots/page.tsx` → ?
2. `src/app/robots/_components/RobotForm.client.tsx` → ?
3. `src/components/Header.tsx` → ?

<details>
<summary>答え</summary>

1. Server Component（`'use client'` がない）
2. Client Component（`'use client'` がある）
3. Server Component（`'use client'` がない）

</details>

---

## Step 2: Server Component でのデータ取得

### 概念

Server Component では、**コンポーネント関数を async にして直接 await できます**。

これが RSC 最大の特徴です。

### Before（従来の CSR）

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
  return <ul>...</ul>
}
```

**問題点**:
- useEffect でデータ取得
- ローディング状態の管理が必要
- クライアントで実行されるので遅い

### After（RSC）

```tsx
// Server Component - 'use client' なし
// ページコンポーネント（app/robots/page.tsx）でデータ取得
export default async function RobotsPage() {
  const robots = await getRobots()  // 直接 await！
  return <RobotList robots={robots} />  // 表示用コンポーネントに渡す
}
```

**ポイント**: データ取得は `page.tsx`（async）で行い、表示用コンポーネントには props で渡す。

**メリット**:
- useEffect 不要
- ローディング状態の管理不要
- サーバーで実行されるので速い

### 読むファイル

1. **[src/app/robots/page.tsx](src/app/robots/page.tsx)** - ロボット一覧

   ```tsx
   export default async function RobotsPage() {
     // ↑ async がついている！

     const robots = await getRobots()
     // ↑ 直接 await できる！

     return (
       <div>
         <RobotList robots={robots} />
       </div>
     )
   }
   ```

   **確認ポイント**:
   - `async function` になっている
   - `await getRobots()` で直接データ取得
   - useEffect も useState も使っていない

2. **[src/lib/robots.ts](src/lib/robots.ts)** - データ取得関数

   ```tsx
   export const getRobots = async (): Promise<readonly Robot[]> => {
     await simulateDelay()
     return [...robots.values()]
   }
   ```

   **確認ポイント**:
   - 純粋な async 関数
   - 実際のアプリでは DB アクセスなどに置き換える

### 練習問題

`src/app/robots/[id]/page.tsx` を開いて、以下を確認してください。

1. どこでデータを取得しているか？
2. 存在しない ID の場合、どうなるか？

<details>
<summary>答え</summary>

1. `const robot = await getRobotById(id)` で取得
2. `notFound()` を呼び出して 404 ページを表示

</details>

---

## Step 3: Server Component と Client Component の組み合わせ

### 概念

実際のアプリでは、両方を組み合わせます。

**原則**: できるだけ Server Component を使い、**必要な部分だけ** Client Component にする

### いつ Client Component が必要か？

| ケース | 理由 |
|--------|------|
| クリックイベント | onClick は ブラウザで動く |
| フォーム入力 | useState で入力値を管理 |
| アニメーション | DOM を操作する |
| ブラウザ API | localStorage, window など |

### 読むファイル

1. **[src/app/robots/page.tsx](src/app/robots/page.tsx)** - 親（Server Component）

   ```tsx
   export default async function RobotsPage() {
     const robots = await getRobots()  // サーバーでデータ取得

     return (
       <div>
         {/* Server Component にデータを渡す */}
         <RobotList robots={robots} />

         {/* Client Component（フォーム入力が必要） */}
         <RobotFormClient mode="create" />
       </div>
     )
   }
   ```

2. **[src/app/robots/_components/RobotList.tsx](src/app/robots/_components/RobotList.tsx)** - 一覧（Server Component）

   ```tsx
   // 'use client' がない = Server Component
   export const RobotList = ({ robots }: RobotListProps) => {
     return (
       <table>
         {robots.map((robot) => (
           <tr key={robot.id}>
             <td>{robot.name}</td>
             {/* 削除ボタンだけ Client Component */}
             <DeleteButtonClient robotId={robot.id} robotName={robot.name} />
           </tr>
         ))}
       </table>
     )
   }
   ```

   **確認ポイント**:
   - RobotList 自体は Server Component
   - 削除ボタン（クリックイベントが必要）だけ Client Component

3. **[src/app/robots/_components/DeleteButton.client.tsx](src/app/robots/_components/DeleteButton.client.tsx)** - 削除ボタン

   ```tsx
   'use client'  // クリックイベントがあるので Client

   export const DeleteButtonClient = ({ robotId, robotName }) => {
     const handleSubmit = (formData: FormData) => {
       if (confirm(`「${robotName}」を削除しますか？`)) {
         formAction(formData)
       }
     }

     return <form action={handleSubmit}>...</form>
   }
   ```

### 図解

```
RobotsPage (Server)
├── RobotList (Server)
│   └── DeleteButtonClient (Client) ← クリックが必要な部分だけ
└── RobotFormClient (Client) ← フォーム入力が必要
```

### 練習問題

`src/components/Header.tsx` を開いて、以下を確認してください。

1. Header 自体は Server / Client どちら？
2. なぜ LogoutButtonClient だけ Client Component にしている？

<details>
<summary>答え</summary>

1. Server Component（`'use client'` がない、async で認証チェックしている）
2. ログアウトボタンはクリックイベント（form action）が必要だから

</details>

---

## Step 4: Server Actions を理解する

### 概念

Server Actions は、**フォーム送信をサーバーで処理する仕組み**です。

従来は API Routes を作って fetch していましたが、Server Actions では不要になりました。

### Before（従来の方法）

```tsx
// 1. API Route を作る（pages/api/robots.ts）
export default function handler(req, res) {
  if (req.method === 'POST') {
    // 作成処理
  }
}

// 2. クライアントから fetch
const handleSubmit = async () => {
  await fetch('/api/robots', {
    method: 'POST',
    body: JSON.stringify({ name })
  })
}
```

### After（Server Actions）

```tsx
// 1. Server Action を定義
'use server'
export async function createRobotAction(formData: FormData) {
  const name = formData.get('name')
  await createRobot({ name })
  revalidatePath('/robots')
}

// 2. フォームから直接呼び出し
<form action={createRobotAction}>
  <input name="name" />
  <button>作成</button>
</form>
```

### 読むファイル

1. **[src/app/robots/_actions/robot.ts](src/app/robots/_actions/robot.ts)** - Server Actions

   ```tsx
   'use server'  // ← これが Server Action の宣言

   export const createRobotAction = async (
     _prevState: ActionState,
     formData: FormData
   ): Promise<ActionState> => {
     const name = formData.get('name')

     // バリデーション
     const validationError = validateRobotName(name)
     if (validationError) {
       return { success: false, error: validationError }
     }

     // データ作成
     await createRobotInDb({ name })

     // キャッシュを更新
     revalidatePath('/robots')

     return { success: true }
   }
   ```

   **確認ポイント**:
   - ファイル先頭の `'use server'`
   - formData から値を取得
   - `revalidatePath` でページを再取得

2. **[src/app/robots/_components/RobotForm.client.tsx](src/app/robots/_components/RobotForm.client.tsx)** - フォーム

   ```tsx
   'use client'
   import { useActionState } from 'react'
   import { createRobotAction } from '../_actions/robot'

   export const RobotFormClient = () => {
     const [state, formAction, pending] = useActionState(createRobotAction, null)
     // state: Server Action の戻り値
     // formAction: フォームに渡す関数
     // pending: 送信中かどうか

     return (
       <form action={formAction}>
         <input name="name" />
         <button disabled={pending}>
           {pending ? '処理中...' : '作成'}
         </button>
         {state?.error && <p>{state.error}</p>}
       </form>
     )
   }
   ```

   **確認ポイント**:
   - `useActionState` で Server Action をラップ
   - `action={formAction}` でフォームに紐づけ
   - `pending` でローディング表示

### 図解

```
ユーザー → フォーム送信 → Server Action（サーバー実行）
                              ↓
                         DB 更新
                              ↓
                         revalidatePath
                              ↓
                         ページ再描画
```

### 練習問題

`src/app/robots/_actions/robot.ts` の `deleteRobotAction` を読んで、以下を確認してください。

1. どのように ID を受け取っている？
2. 削除が成功したらどうなる？

<details>
<summary>答え</summary>

1. `formData.get('id')` で取得（hidden input から）
2. `revalidatePath('/robots')` でロボット一覧が再取得される

</details>

---

## Step 5: 認証パターンを理解する

### 概念

Server Component では、**レンダリング時に認証チェックができます**。

CSR では useEffect で認証チェックしていましたが、RSC ではサーバーで直接チェックします。

### 読むファイル

1. **[src/lib/auth.ts](src/lib/auth.ts)** - 認証ロジック

   ```tsx
   import { cookies } from 'next/headers'

   export const getCurrentUser = async (): Promise<User | null> => {
     const cookieStore = await cookies()
     const sessionId = cookieStore.get('session-id')?.value

     if (!sessionId) return null
     return users.get(sessionId) ?? null
   }
   ```

   **確認ポイント**:
   - `cookies()` でサーバーサイドで Cookie を読む
   - この関数は Server Component からのみ呼び出せる

   > **補足**: Next.js 15 以降では、`cookies()` / `headers()` は Promise を返すため `await` が必要です。

2. **[src/components/Header.tsx](src/components/Header.tsx)** - 認証状態による表示切り替え

   ```tsx
   export const Header = async () => {
     const user = await getCurrentUser()  // サーバーで認証チェック

     return (
       <header>
         {user ? (
           // ログイン済み
           <div>
             <span>{user.name}</span>
             <LogoutButtonClient />
           </div>
         ) : (
           // 未ログイン
           <Link href="/auth">ログイン</Link>
         )}
       </header>
     )
   }
   ```

   **確認ポイント**:
   - Server Component で直接認証チェック
   - useEffect での認証チェックは不要

3. **[src/app/auth/page.tsx](src/app/auth/page.tsx)** - 認証済みリダイレクト

   ```tsx
   export default async function AuthPage() {
     const user = await getCurrentUser()

     // 既にログイン済みならリダイレクト
     if (user) {
       redirect('/')
     }

     return <LoginFormClient />
   }
   ```

   **確認ポイント**:
   - サーバーサイドでリダイレクト判定
   - クライアントでの useEffect + router.push は不要

### 練習問題

CSR での認証チェックと比較して、RSC のメリットを 2 つ挙げてください。

<details>
<summary>答え</summary>

1. **初期表示が速い** - サーバーで認証済みの状態でレンダリングされるため、チラつきがない
2. **コードがシンプル** - useEffect, useState, ローディング状態が不要

</details>

---

## Step 6: URL による状態管理

### 概念

RSC では、**useState ではなく URL（searchParams）で状態を管理**するパターンが推奨されます。

### メリット

- ブックマーク可能
- 共有可能
- ブラウザの戻る/進むが使える
- SEO フレンドリー

### 読むファイル

1. **[src/app/robots-paginated/page.tsx](src/app/robots-paginated/page.tsx)** - ページネーション

   ```tsx
   type Props = {
     searchParams: Promise<{ page?: string }>
   }

   export default async function RobotsPaginatedPage({ searchParams }: Props) {
     const params = await searchParams
     const page = Math.max(1, parseInt(params.page ?? '1', 10))

     const { robots, totalPages } = await getRobotsPaginated(page, 2)

     return (
       <div>
         {robots.map(...)}
         <Pagination currentPage={page} totalPages={totalPages} />
       </div>
     )
   }
   ```

   **確認ポイント**:
   - `searchParams` で URL パラメータを取得
   - useState は使っていない
   - URL が `/robots-paginated?page=2` のようになる

   > **補足**: Next.js 15 以降では、`params` / `searchParams` は Promise を返すため `await` が必要です。

2. **[src/components/Pagination.tsx](src/components/Pagination.tsx)** - ページネーションコンポーネント

   ```tsx
   export const Pagination = ({ currentPage, totalPages, basePath }) => {
     return (
       <nav>
         <Link href={`${basePath}?page=${currentPage - 1}`}>前へ</Link>

         {pages.map((page) => (
           <Link href={`${basePath}?page=${page}`}>{page}</Link>
         ))}

         <Link href={`${basePath}?page=${currentPage + 1}`}>次へ</Link>
       </nav>
     )
   }
   ```

   **確認ポイント**:
   - ページ遷移は Link で URL を変更するだけ
   - useState も onClick も不要

### Before / After

**Before（CSR + useState）**

```tsx
'use client'
export default function PaginatedList() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])

  useEffect(() => {
    fetch(`/api/items?page=${page}`)
      .then(res => res.json())
      .then(setData)
  }, [page])

  return (
    <div>
      {data.map(...)}
      <button onClick={() => setPage(p => p + 1)}>次へ</button>
    </div>
  )
}
```

**After（RSC + searchParams）**

```tsx
export default async function PaginatedList({ searchParams }) {
  const page = parseInt(searchParams.page ?? '1')
  const data = await getItems(page)

  return (
    <div>
      {data.map(...)}
      <Link href={`?page=${page + 1}`}>次へ</Link>
    </div>
  )
}
```

---

## Step 7: ローディング UI

### 概念

Server Component はサーバーでデータ取得が完了してからレンダリング結果を返します。
その間のローディング表示は、**`loading.tsx`** または **`<Suspense>`** で宣言的に管理します。

### 方法 1: `loading.tsx`（ルートレベル）

ページと同じディレクトリに `loading.tsx` を配置すると、自動的にローディング UI が表示されます。

```
src/app/robots/
├── page.tsx
└── loading.tsx  ← これを追加
```

### 方法 2: `<Suspense>`（コンポーネントレベル）

部分的にローディングを制御したい場合は `Suspense` を使います。

```tsx
import { Suspense } from 'react'

export default function RobotsPage() {
  return (
    <div>
      <h1>Robots</h1>

      {/* この部分だけローディング表示 */}
      <Suspense fallback={<p>一覧を読み込み中...</p>}>
        <RobotList />
      </Suspense>

      {/* フォームは即座に表示 */}
      <RobotFormClient mode="create" />
    </div>
  )
}

// 別の async Server Component
const RobotList = async () => {
  const robots = await getRobots()
  return <ul>...</ul>
}
```

### CSR との違い

| CSR | RSC |
|-----|-----|
| useState + useEffect で自分で管理 | loading.tsx / Suspense で宣言的に管理 |
| ローディング中は空 or スピナー表示 | ストリーミングで段階的に表示可能 |

### 読むファイル

1. **[src/app/robots/loading.tsx](src/app/robots/loading.tsx)** - 一覧ページのローディング

   ```tsx
   export default function Loading() {
     return (
       <div className="container mx-auto px-4 py-8">
         <div className="h-8 bg-gray-200 rounded w-32 mb-8 animate-pulse" />
         {/* スケルトン UI */}
       </div>
     )
   }
   ```

2. **[src/app/robots/[id]/loading.tsx](src/app/robots/[id]/loading.tsx)** - 詳細ページのローディング

### 練習問題

`loading.tsx` と `<Suspense>` の使い分けを説明してください。

<details>
<summary>答え</summary>

- **loading.tsx**: ページ全体のローディング（ルート単位）
- **Suspense**: コンポーネント単位のローディング（部分的に段階表示したい場合）

例えば、ヘッダーは即座に表示し、メインコンテンツだけローディングしたい場合は `Suspense` を使う。

</details>

---

## Step 8: Server → Client のシリアライズ境界

### 概念

Server Component から Client Component に props を渡すとき、**シリアライズ（JSON 変換）可能な値のみ**渡せます。

これは RSC 初学者が最もハマりやすいポイントの一つです。

### 渡せるもの / 渡せないもの

| 渡せる | 渡せない |
|--------|----------|
| string, number, boolean | 関数 |
| 配列、オブジェクト | クラスインスタンス |
| Date（シリアライズされる） | Map, Set |
| null, undefined | Symbol |

### なぜこの制約があるのか？

Server Component はサーバーで実行され、その結果がクライアントに送信されます。
このとき、データは JSON 形式でシリアライズされます。

```
Server Component（サーバー）
        ↓ シリアライズ（JSON 変換）
        ↓ ネットワーク転送
        ↓
Client Component（ブラウザ）
```

関数やクラスインスタンスは JSON に変換できないため、渡せません。

### よくあるエラー

```tsx
// ❌ エラーになる例
export default async function Page() {
  const handleClick = () => console.log('clicked')  // 関数

  return <ClientButton onClick={handleClick} />  // 関数は渡せない！
}
```

```
Error: Functions cannot be passed directly to Client Components
```

### 正しいパターン

```tsx
// ✅ Server Action を渡す
// Server Action は特別に渡せる（'use server' がついているため）
import { deleteRobotAction } from './_actions/robot'

export default async function Page() {
  return <DeleteButton action={deleteRobotAction} />
}
```

```tsx
// ✅ データだけ渡し、イベントハンドラは Client で定義
export default async function Page() {
  const robot = await getRobot(id)
  return <RobotCard robot={robot} />  // データのみ
}

// Client Component
'use client'
export const RobotCard = ({ robot }) => {
  const handleClick = () => console.log(robot.name)  // ここで定義
  return <button onClick={handleClick}>{robot.name}</button>
}
```

### このプロジェクトでの実践

このプロジェクトでは、以下の設計でシリアライズ境界の問題を回避しています。

1. **ビジネスロジックは lib/ に集約**（Server 側で完結）
2. **Client Component には「データ」と「Server Action」のみ渡す**
3. **イベントハンドラは Client Component 内で定義**

### 読むファイル

**[src/app/robots/_components/RobotList.tsx](src/app/robots/_components/RobotList.tsx)**

```tsx
// Server Component
export const RobotList = ({ robots }: RobotListProps) => {
  return (
    <table>
      {robots.map((robot) => (
        <tr key={robot.id}>
          {/* データ（string）を渡す - OK */}
          <DeleteButtonClient robotId={robot.id} robotName={robot.name} />
        </tr>
      ))}
    </table>
  )
}
```

**[src/app/robots/_components/DeleteButton.client.tsx](src/app/robots/_components/DeleteButton.client.tsx)**

```tsx
'use client'

export const DeleteButtonClient = ({ robotId, robotName }) => {
  // イベントハンドラは Client Component 内で定義
  const handleSubmit = (formData: FormData) => {
    if (confirm(`「${robotName}」を削除しますか？`)) {
      formAction(formData)
    }
  }

  return <form action={handleSubmit}>...</form>
}
```

### 練習問題

以下のコードはエラーになります。なぜでしょうか？

```tsx
export default async function Page() {
  const robots = new Map([['1', { name: 'Alpha' }]])
  return <RobotListClient robots={robots} />
}
```

<details>
<summary>答え</summary>

Map はシリアライズできないため、Client Component に渡せません。

**解決策**: 配列に変換してから渡す

```tsx
const robots = new Map([['1', { name: 'Alpha' }]])
return <RobotListClient robots={[...robots.values()]} />
```

</details>

---

## Step 9: テストを読む

テストコードを読むと、各関数の使い方がわかります。

### 読むファイル

1. **[src/lib/robots.test.ts](src/lib/robots.test.ts)** - lib 層のテスト

   ```tsx
   describe('getRobots', () => {
     it('全ロボットを取得できる', async () => {
       const robots = await getRobots()
       expect(robots.length).toBeGreaterThan(0)
     })
   })

   describe('validateRobotName', () => {
     it('空文字ではエラーメッセージを返す', () => {
       expect(validateRobotName('')).toBe('名前は必須です')
     })
   })
   ```

2. **[src/app/robots/_actions/robot.test.ts](src/app/robots/_actions/robot.test.ts)** - Server Actions のテスト

   ```tsx
   describe('createRobotAction', () => {
     it('有効なデータで作成できる', async () => {
       const formData = createFormData({ name: 'New Robot' })
       const result = await createRobotAction(null, formData)
       expect(result?.success).toBe(true)
     })

     it('名前が空の場合はエラー', async () => {
       const formData = createFormData({ name: '' })
       const result = await createRobotAction(null, formData)
       expect(result?.error).toBe('名前は必須です')
     })
   })
   ```

### テスト実行

```bash
# 全テスト
pnpm test

# 個別ファイル
pnpm test run src/lib/robots.test.ts
```

---

## まとめ: RSC の設計原則

### 1. Server Component First

```
デフォルト = Server Component
必要な時だけ = Client Component
```

### 2. Client Component を使う基準

| 必要なもの | 判断 |
|-----------|------|
| データ取得のみ | Server Component |
| クリックイベント | Client Component |
| フォーム入力（useState） | Client Component |
| ブラウザ API | Client Component |

### 3. データフロー

```
Server Component でデータ取得
        ↓
props で子コンポーネントに渡す
        ↓
必要な操作だけ Client Component
```

### 4. 状態管理

| 状態の種類 | 管理方法 |
|-----------|----------|
| サーバーデータ | Server Component で取得 |
| URL 状態（ページ番号等） | searchParams |
| 一時的な UI 状態 | useState（Client Component） |

### 5. シリアライズ境界を意識する

```
Server Component → Client Component
        ↓
渡せるのはシリアライズ可能な値のみ
（string, number, 配列, オブジェクト, Server Action）
        ↓
関数・クラス・Map・Set は渡せない
```

---

## 次のステップ

1. `pnpm dev` でアプリを起動して触ってみる
2. Chrome DevTools の Network タブでリクエストを確認
3. 新しい機能を追加してみる（例: ロボットの検索機能）

## 参考資料

- [Next.js - Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Next.js - Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React - Server Components](https://react.dev/reference/rsc/server-components)
