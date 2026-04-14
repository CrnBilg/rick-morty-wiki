// Pagination component — reusable across Characters, Episodes, Locations
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null

  const getPages = () => {
    const pages = []
    const delta = 2

    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      pages.push(i)
    }

    if (pages[0] > 1) {
      if (pages[0] > 2) pages.unshift('...')
      pages.unshift(1)
    }

    if (pages[pages.length - 1] < totalPages) {
      if (pages[pages.length - 1] < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  const btnClass = (active) =>
    `w-9 h-9 rounded-lg flex items-center justify-center text-sm font-body font-700 transition-all duration-200 ${
      active
        ? 'bg-portal-lime text-portal-dark'
        : 'text-gray-400 hover:text-white hover:bg-white/10 border border-portal-border'
    }`

  return (
    <div className="flex items-center justify-center gap-1 mt-10 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 h-9 rounded-lg text-sm font-body font-700 text-gray-400
                   hover:text-white hover:bg-white/10 border border-portal-border
                   disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
      >
        ← Prev
      </button>

      {getPages().map((page, idx) =>
        page === '...' ? (
          <span key={`dots-${idx}`} className="w-9 h-9 flex items-center justify-center text-gray-500">…</span>
        ) : (
          <button key={page} onClick={() => onPageChange(page)} className={btnClass(page === currentPage)}>
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 h-9 rounded-lg text-sm font-body font-700 text-gray-400
                   hover:text-white hover:bg-white/10 border border-portal-border
                   disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
      >
        Next →
      </button>
    </div>
  )
}
