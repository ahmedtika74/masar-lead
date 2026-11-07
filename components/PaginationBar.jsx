import { ChevronLeft, ChevronRight } from "lucide-react";

export const PAGE_SIZE_OPTIONS = [10, 20, 50];

export function paginate(items, page, pageSize) {
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize) || 1);
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * pageSize;
  return {
    total,
    pageCount,
    page: safePage,
    start,
    end: Math.min(start + pageSize, total),
    items: items.slice(start, start + pageSize),
  };
}

function pageWindow(current, pageCount) {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const pages = new Set([1, pageCount, current - 1, current, current + 1]);
  return [...pages]
    .filter((n) => n >= 1 && n <= pageCount)
    .sort((a, b) => a - b)
    .reduce((acc, n, i, arr) => {
      if (i > 0 && n - arr[i - 1] > 1) acc.push("…");
      acc.push(n);
      return acc;
    }, []);
}

export default function PaginationBar({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  extra = null,
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize) || 1);
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const pages = pageWindow(page, pageCount);

  if (total === 0) return extra;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
      <div className="flex flex-wrap items-center gap-3 text-slate-600">
        <span>
          عرض {start}–{end} من {total}
        </span>
        <label className="inline-flex items-center gap-2">
          <span>لكل صفحة</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        {extra}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 font-medium text-slate-700 disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
          السابق
        </button>
        {pages.map((item, index) =>
          item === "…" ? (
            <span key={`gap-${index}`} className="px-1 text-slate-400">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              className={`min-w-8 rounded-lg px-2.5 py-1.5 font-semibold ${
                item === page ? "bg-teal-600 text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item}
            </button>
          ),
        )}
        <button
          type="button"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 font-medium text-slate-700 disabled:opacity-40"
        >
          التالي
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
