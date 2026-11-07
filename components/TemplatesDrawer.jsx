import { RotateCcw, X } from "lucide-react";

export default function TemplatesDrawer({ open, templates, onClose, onChange, onReset }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <button type="button" className="h-full flex-1 bg-slate-900/40" onClick={onClose} aria-label="إغلاق" />
      <aside className="h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">قوالب رسائل واتساب</h2>
            <p className="mt-1 text-sm text-slate-500">
              استخدم المتغيرات: {"{name}"} و {"{businessName}"} و {"{city}"} و {"{category}"}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5">
          {templates.map((tpl, index) => (
            <label key={tpl.id} className="block">
              <span className="mb-1 block text-sm font-semibold text-slate-700">{tpl.name}</span>
              {tpl.keywords?.length ? (
                <p className="mb-2 text-xs text-slate-500">
                  يُختار تلقائياً مع: {tpl.keywords.filter((word) => /[أ-ي]/.test(word)).slice(0, 6).join(" · ")}
                </p>
              ) : (
                <p className="mb-2 text-xs text-slate-500">يُستخدم إذا لم يطابق نشاط معين</p>
              )}
              <textarea
                value={tpl.body}
                rows={7}
                onChange={(e) => {
                  const next = templates.map((item, i) =>
                    i === index ? { ...item, body: e.target.value } : item,
                  );
                  onChange(next);
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-7 outline-none ring-teal-500/20 focus:bg-white focus:ring-4"
              />
            </label>
          ))}
        </div>

        <button
          type="button"
          onClick={onReset}
          className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <RotateCcw className="h-4 w-4" />
          استعادة القوالب الافتراضية
        </button>
      </aside>
    </div>
  );
}
