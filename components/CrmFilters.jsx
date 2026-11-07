import { Download, FilterX, Search } from "lucide-react";

const CRM_STATUSES = ["New", "Contacted", "Interested", "Closed", "Not Interested"];

const DIGITAL_OPTIONS = [
  { value: "", label: "كل الحالات الرقمية" },
  { value: "NO_WEBSITE", label: "بدون موقع" },
  { value: "SOCIAL_ONLY", label: "سوشيال فقط" },
  { value: "HAS_WEBSITE", label: "لديه موقع" },
];

const PHONE_OPTIONS = [
  { value: "", label: "كل الأرقام" },
  { value: "mobile", label: "موبايل / واتساب" },
  { value: "landline", label: "أرضي" },
  { value: "none", label: "بدون رقم" },
];

export default function CrmFilters({
  query,
  status,
  digitalStatus,
  city,
  phoneType,
  cities,
  total,
  filteredCount,
  onChange,
  onReset,
  onExport,
}) {
  const hasFilters = Boolean(query || status || digitalStatus || city || phoneType);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <label className="relative xl:col-span-2">
          <Search className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => onChange({ query: e.target.value })}
            placeholder="بحث بالاسم، الهاتف، العنوان، المدينة..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-10 pl-3 text-sm outline-none ring-teal-500/20 focus:bg-white focus:ring-4"
          />
        </label>
        <select
          value={status}
          onChange={(e) => onChange({ status: e.target.value })}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
        >
          <option value="">كل حالات CRM</option>
          {CRM_STATUSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          value={digitalStatus}
          onChange={(e) => onChange({ digitalStatus: e.target.value })}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
        >
          {DIGITAL_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <select
          value={city}
          onChange={(e) => onChange({ city: e.target.value })}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
        >
          <option value="">كل المدن</option>
          {cities.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          value={phoneType}
          onChange={(e) => onChange({ phoneType: e.target.value })}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
        >
          {PHONE_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className="text-slate-500">
          {filteredCount} من أصل {total} عميل
          {hasFilters ? " مطابق للبحث" : ""}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onReset}
            disabled={!hasFilters}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 font-medium text-slate-700 disabled:opacity-40"
          >
            <FilterX className="h-4 w-4" />
            مسح الفلاتر
          </button>
          <button
            type="button"
            onClick={onExport}
            disabled={!filteredCount}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 font-medium text-slate-700 disabled:opacity-40"
          >
            <Download className="h-4 w-4" />
            تصدير النتائج
          </button>
        </div>
      </div>
    </section>
  );
}
