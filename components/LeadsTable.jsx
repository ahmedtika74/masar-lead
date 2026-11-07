import { ExternalLink, MapPin, MessageCircle, Phone, Save, Star } from "lucide-react";
import { resolveTemplateId } from "@/lib/templates";
import { CrmBadge, DigitalBadge } from "./StatusBadge";

const CRM_STATUSES = ["New", "Contacted", "Interested", "Closed", "Not Interested"];

export default function LeadsTable({
  leads,
  selected,
  templates,
  templateByLead,
  crmStatusById,
  onToggle,
  onToggleAll,
  onSave,
  onWhatsApp,
  onCrmStatus,
  onTemplateChange,
  showSave = true,
}) {
  const allSelected = leads.length > 0 && leads.every((lead) => selected.has(lead.placeId));

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-right text-slate-600">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleAll}
                  className="h-4 w-4 accent-teal-600"
                />
              </th>
              <th className="px-4 py-3 font-semibold">النشاط</th>
              <th className="px-4 py-3 font-semibold">التصنيف</th>
              <th className="px-4 py-3 font-semibold">التقييم</th>
              <th className="px-4 py-3 font-semibold">العنوان</th>
              <th className="px-4 py-3 font-semibold">الحالة الرقمية</th>
              <th className="px-4 py-3 font-semibold">الهاتف</th>
              <th className="px-4 py-3 font-semibold">CRM</th>
              <th className="px-4 py-3 font-semibold">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-16 text-center text-slate-500">
                  لا توجد نتائج بعد. ابحث عن نشاط ومدينة للبدء.
                </td>
              </tr>
            ) : (
              leads.map((lead) => {
                const crmStatus = crmStatusById[lead.placeId] || lead.crmStatus || "New";
                const phone = lead.phoneInfo || {};
                return (
                  <tr key={lead.placeId} className="border-t border-slate-100 align-top hover:bg-slate-50/70">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(lead.placeId)}
                        onChange={() => onToggle(lead.placeId)}
                        className="h-4 w-4 accent-teal-600"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{lead.name}</div>
                      {lead.city ? <div className="text-xs text-slate-500">{lead.city}</div> : null}
                      {lead.mapsUri ? (
                        <a
                          href={lead.mapsUri}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-xs text-teal-700 hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          خرائط جوجل
                        </a>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{lead.category}</td>
                    <td className="px-4 py-3">
                      <div className="inline-flex items-center gap-1 font-medium text-slate-800">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {lead.rating ?? "—"}
                      </div>
                      <div className="text-xs text-slate-500">{lead.reviews || 0} تقييم</div>
                    </td>
                    <td className="max-w-56 px-4 py-3 text-slate-600">
                      <span className="inline-flex items-start gap-1">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                        {lead.address || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <DigitalBadge status={lead.digitalStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium dir-ltr text-left text-slate-800" dir="ltr">
                        {lead.phone || "—"}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {phone.label}
                        {phone.carrier ? ` · ${phone.carrier}` : ""}
                        {phone.hasWhatsApp ? " · واتساب" : ""}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="mb-2">
                        <CrmBadge status={crmStatus} />
                      </div>
                      <select
                        value={crmStatus}
                        onChange={(e) => onCrmStatus(lead, e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs"
                      >
                        {CRM_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex min-w-40 flex-col gap-2">
                        <select
                          value={templateByLead[lead.placeId] || resolveTemplateId(lead, templates)}
                          onChange={(e) => onTemplateChange(lead.placeId, e.target.value)}
                          className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                        >
                          {templates.map((tpl) => (
                            <option key={tpl.id} value={tpl.id}>
                              {tpl.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          disabled={!phone.hasWhatsApp}
                          onClick={() => onWhatsApp(lead)}
                          className="inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-600 px-2 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          واتساب
                        </button>
                        {lead.phone ? (
                          <a
                            href={`tel:${lead.phone}`}
                            className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <Phone className="h-3.5 w-3.5" />
                            اتصال
                          </a>
                        ) : null}
                        {showSave ? (
                          <button
                            type="button"
                            onClick={() => onSave(lead)}
                            className="inline-flex items-center justify-center gap-1 rounded-lg border border-teal-200 bg-teal-50 px-2 py-1.5 text-xs font-medium text-teal-800 hover:bg-teal-100"
                          >
                            <Save className="h-3.5 w-3.5" />
                            حفظ
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
