type Props = {
  currentPage: number;
  totalPages: number;
  onChangePage?: (page: number) => void;
};

export function Pagination({ currentPage, totalPages, onChangePage }: Props) {
  const safeTotalPages = Math.max(1, totalPages);
  const pageWindowSize = 10;
  const currentWindowIndex = Math.floor((Math.max(1, currentPage) - 1) / pageWindowSize);
  const startPage = currentWindowIndex * pageWindowSize + 1;
  const endPage = Math.min(startPage + pageWindowSize - 1, safeTotalPages);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index,
  );

  return (
    <div className="flex items-center justify-center border-t border-border/50 px-6 py-4">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onChangePage?.(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-2 py-1 text-sm font-semibold text-slate-700 transition-colors hover:text-[#2454C8] disabled:cursor-not-allowed disabled:text-slate-300"
        >
          {"<"}
        </button>
        {pageNumbers.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onChangePage?.(page)}
            className={`px-1.5 py-1 text-sm font-semibold transition-colors ${
              page === currentPage ? "text-[#2454C8]" : "text-slate-700 hover:text-[#2454C8]"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChangePage?.(currentPage + 1)}
          disabled={currentPage >= safeTotalPages}
          className="px-2 py-1 text-sm font-semibold text-slate-700 transition-colors hover:text-[#2454C8] disabled:cursor-not-allowed disabled:text-slate-300"
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
