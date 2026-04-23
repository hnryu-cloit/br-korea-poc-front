import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

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
    <div className="flex items-center justify-center px-6 py-4">
      <div className="flex items-center gap-1.5">
        <div>
          <button
            type="button"
            onClick={() => onChangePage?.(1)}
            disabled={currentPage <= 1}
            className="px-2 py-1 text-sm font-semibold text-[#653819] transition-colors disabled:cursor-not-allowed disabled:text-[#CAD5E2]"
          >
            <ChevronFirstIcon />
          </button>
          <button
            type="button"
            onClick={() => onChangePage?.(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-2 py-1 text-sm font-semibold text-[#653819] transition-colors disabled:cursor-not-allowed disabled:text-[#CAD5E2]"
          >
            <ChevronLeftIcon />
          </button>
        </div>
        <div>
          {pageNumbers.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onChangePage?.(page)}
              className={` text-[#653819] text-md font-bold leading-[150%] p-[2px_12px] ${
                page === currentPage && "bg-[#FF671F4D] rounded-[12px]"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        <div>
          <button
            type="button"
            onClick={() => onChangePage?.(currentPage + 1)}
            disabled={currentPage >= safeTotalPages}
            className="px-2 py-1 text-sm font-semibold text-[#653819] transition-colors disabled:cursor-not-allowed disabled:text-[#CAD5E2]"
          >
            <ChevronRightIcon />
          </button>
          <button
            type="button"
            onClick={() => onChangePage?.(safeTotalPages)}
            disabled={currentPage >= safeTotalPages}
            className="px-2 py-1 text-sm font-semibold text-[#653819] transition-colors disabled:cursor-not-allowed disabled:text-[#CAD5E2]"
          >
            <ChevronLastIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
