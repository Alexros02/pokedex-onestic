import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';

/**
 * Paginación para listas: navegación previa/siguiente y numeración.
 * Mantiene coherencia visual entre vista compacta (móvil) y completa.
 */
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
      <div className="hidden sm:flex items-center gap-2">
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
            className={`px-3 py-1 rounded-md border text-sm transition shadow-md ${
              p === page
                ? 'bg-white/20 border-white/30 text-gray-800 dark:text-gray-200 hover:bg-white/30'
                : 'bg-transparent text-gray-800 dark:text-gray-200 hover:bg-white/30'
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
      {/* Botones y numeración para >= sm */}
      <button
        type="button"
        className="hidden sm:inline-flex px-4 py-2 rounded-md border border-white/30 bg-white/20 backdrop-blur text-gray-800 dark:text-gray-200 hover:bg-white/30 transition shadow-md disabled:opacity-50"
        onClick={() => goToPage(page - 1)}
        disabled={page <= 1}
      >
        Anterior
      </button>
      {renderPageNumbers()}
      <button
        type="button"
        className="hidden sm:inline-flex px-4 py-2 rounded-md border border-white/30 bg-white/20 backdrop-blur text-gray-800 dark:text-gray-200 hover:bg-white/30 transition shadow-md disabled:opacity-50"
        onClick={() => goToPage(page + 1)}
        disabled={page >= totalPages}
      >
        Siguiente
      </button>

      {/* Versión compacta */}
      <div className="flex items-center gap-3 sm:hidden">
        <button
          type="button"
          aria-label="Página anterior"
          className="px-3 py-1 rounded-md border border-white/30 bg-white/20 backdrop-blur text-gray-800 dark:text-gray-200 hover:bg-white/30 transition shadow-md disabled:opacity-50"
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-sm text-gray-800 dark:text-gray-200">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          aria-label="Página siguiente"
          className="px-3 py-1 rounded-md border border-white/30 bg-white/20 backdrop-blur text-gray-800 dark:text-gray-200 hover:bg-white/30 transition shadow-md disabled:opacity-50"
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
