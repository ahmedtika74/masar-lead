import { FolderSearch, Inbox, LoaderCircle, Search } from "lucide-react";

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action = null,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Icon className="h-6 w-6" />
      </div>
      <h2 className="text-base font-semibold text-slate-800">{title}</h2>
      {description ? <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function LoadingState({ label = "جاري التحميل..." }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 text-sm text-slate-600">
        <LoaderCircle className="h-4 w-4 animate-spin text-teal-600" />
        {label}
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="grid grid-cols-7 gap-3 px-4 py-4">
            <div className="col-span-2 h-4 animate-pulse rounded bg-slate-100" />
            <div className="h-4 animate-pulse rounded bg-slate-100" />
            <div className="h-4 animate-pulse rounded bg-slate-100" />
            <div className="col-span-2 h-4 animate-pulse rounded bg-slate-100" />
            <div className="h-4 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export const EmptyIcons = { FolderSearch, Inbox, Search };
