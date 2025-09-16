import { useMemo } from 'react';

interface PaginationProps {
  page: number;
  total: number;
  pageSize?: number;
  onChange: (page: number) => void;
}

const Pagination = ({ page, total, pageSize = 15, onChange }: PaginationProps) => {
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  const goToPage = (p: number) => {
    const clamped = Math.min(Math.max(1, p), totalPages);
    if (clamped !== page) onChange(clamped);
  };

  const renderPageNumbers = () => {
    const pages: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return (
      <div className="flex items-center gap-2">
        {start > 1 && (
          <button
            type="button"
            className="px-3 py-1 rounded-md border text-sm bg-transparent text-gray-800 dark:text-gray-200 hover:bg-white/30 transition shadow-md"
            onClick={() => goToPage(1)}
          >
            1
          </button>
        )}
        {start > 2 && <span className="text-sm opacity-70">…</span>}
        {pages.map(p => (
          <button
            key={p}
            type="button"
            className={`px-3 py-1 rounded-md border text-sm ${
              p === page
                ? 'bg-white/20 border-white/30 text-gray-800 dark:text-gray-200 hover:bg-white/30 transition shadow-md'
                : 'bg-transparent text-gray-800 dark:text-gray-200 hover:bg-white/30 transition shadow-md'
            }`}
            onClick={() => goToPage(p)}
          >
            {p}
          </button>
        ))}
        {end < totalPages - 1 && <span className="text-sm opacity-70">…</span>}
        {end < totalPages && (
          <button
            type="button"
            className="px-3 py-1 rounded-md border text-sm bg-transparent text-gray-800 dark:text-gray-200 hover:bg-white/30 transition shadow-md"
            onClick={() => goToPage(totalPages)}
          >
            {totalPages}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <button
        type="button"
        className="px-4 py-2 rounded-md border border-white/30 bg-white/20 backdrop-blur text-gray-800 dark:text-gray-200 hover:bg-white/30 transition shadow-md disabled:opacity-50"
        onClick={() => goToPage(page - 1)}
        disabled={page <= 1}
      >
        Anterior
      </button>
      {renderPageNumbers()}
      <button
        type="button"
        className="px-4 py-2 rounded-md border border-white/30 bg-white/20 backdrop-blur text-gray-800 dark:text-gray-200 hover:bg-white/30 transition shadow-md disabled:opacity-50"
        onClick={() => goToPage(page + 1)}
        disabled={page >= totalPages}
      >
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;
