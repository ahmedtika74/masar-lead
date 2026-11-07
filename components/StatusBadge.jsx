const DIGITAL = {
  NO_WEBSITE: {
    label: "بدون موقع",
    className: "bg-red-100 text-red-800 ring-red-200",
  },
  SOCIAL_ONLY: {
    label: "سوشيال فقط",
    className: "bg-amber-100 text-amber-800 ring-amber-200",
  },
  HAS_WEBSITE: {
    label: "لديه موقع",
    className: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  },
};

const CRM = {
  New: "bg-sky-100 text-sky-800",
  Contacted: "bg-indigo-100 text-indigo-800",
  Interested: "bg-emerald-100 text-emerald-800",
  Closed: "bg-slate-200 text-slate-700",
  "Not Interested": "bg-rose-100 text-rose-800",
};

export function DigitalBadge({ status }) {
  const item = DIGITAL[status] || DIGITAL.NO_WEBSITE;
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${item.className}`}
    >
      {item.label}
    </span>
  );
}

export function CrmBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${CRM[status] || CRM.New}`}
    >
      {status}
    </span>
  );
}
