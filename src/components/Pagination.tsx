import Link from 'next/link'

type PaginationProps = {
  currentPage: number
  totalPages: number
  basePath: string
}

/**
 * ページネーション（Server Component）
 *
 * - URL パラメータによるページ切り替え
 * - useState ではなく URL で状態管理
 * - SEO フレンドリー
 */
export const Pagination = ({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) => {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className="flex items-center justify-center gap-2 mt-8" aria-label="ページネーション">
      {/* 前へ */}
      {currentPage > 1 ? (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="px-3 py-2 text-sm border rounded hover:bg-gray-100"
        >
          前へ
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm border rounded text-gray-400 cursor-not-allowed">
          前へ
        </span>
      )}

      {/* ページ番号 */}
      {pages.map((page) => (
        <Link
          key={page}
          href={`${basePath}?page=${page}`}
          className={`px-3 py-2 text-sm border rounded ${
            page === currentPage
              ? 'bg-blue-600 text-white border-blue-600'
              : 'hover:bg-gray-100'
          }`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </Link>
      ))}

      {/* 次へ */}
      {currentPage < totalPages ? (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="px-3 py-2 text-sm border rounded hover:bg-gray-100"
        >
          次へ
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm border rounded text-gray-400 cursor-not-allowed">
          次へ
        </span>
      )}
    </nav>
  )
}
