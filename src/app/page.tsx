import Link from 'next/link'

/**
 * トップページ（Server Component）
 */
export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        Next.js App Router Best Practices
      </h1>

      <p className="text-gray-600 mb-8">
        RSC 前提の設計を示すサンプルアプリケーション
      </p>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">サンプル機能</h2>
          <ul className="space-y-4">
            <li>
              <Link href="/robots" className="text-blue-600 hover:underline font-medium">
                Robots - CRUD + 一覧表示
              </Link>
              <p className="text-sm text-gray-500 mt-1">
                Server Component でのデータ取得、Server Actions による更新
              </p>
            </li>
            <li>
              <Link href="/robots-paginated" className="text-blue-600 hover:underline font-medium">
                Robots（ページネーション付き）
              </Link>
              <p className="text-sm text-gray-500 mt-1">
                searchParams による URL ベースの状態管理
              </p>
            </li>
            <li>
              <Link href="/auth" className="text-blue-600 hover:underline font-medium">
                認証
              </Link>
              <p className="text-sm text-gray-500 mt-1">
                Server Component での認証チェック、Server Actions によるログイン
              </p>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">設計思想</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Server Component がデフォルト</li>
            <li>Client Component は最後の手段</li>
            <li>データ取得はサーバーで完結</li>
            <li>useEffect は DOM が必要な場合のみ</li>
            <li>URL で状態管理（useState より searchParams）</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
