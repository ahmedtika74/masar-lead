"use client";

import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CrmFilters from "@/components/CrmFilters";
import { EmptyIcons, EmptyState, LoadingState } from "@/components/DataStates";
import LeadsTable from "@/components/LeadsTable";
import PaginationBar, { paginate } from "@/components/PaginationBar";
import { exportLeadsToCsv, normalizeSearch } from "@/lib/formatters";

function filterCrmLeads(leads, { query, status, digitalStatus, city, phoneType }) {
  const q = normalizeSearch(query);
  return leads.filter((lead) => {
    if (status && (lead.crmStatus || "New") !== status) return false;
    if (digitalStatus && lead.digitalStatus !== digitalStatus) return false;
    if (city && lead.city !== city) return false;
    const type = lead.phoneInfo?.type || (lead.phone ? "unknown" : "none");
    if (phoneType === "mobile" && !lead.phoneInfo?.hasWhatsApp && type !== "mobile") return false;
    if (phoneType === "landline" && type !== "landline") return false;
    if (phoneType === "none" && lead.phone) return false;
    if (!q) return true;
    const haystack = normalizeSearch(
      [
        lead.name,
        lead.phone,
        lead.phoneInfo?.whatsapp,
        lead.address,
        lead.city,
        lead.category,
        lead.notes,
        lead.searchQuery,
      ].join(" "),
    );
    return haystack.includes(q);
  });
}

export default function CrmPanel({
  leads,
  loading = false,
  templates,
  templateByLead,
  onWhatsApp,
  onCrmStatus,
  onDelete,
  onTemplateChange,
}) {
  const [selected, setSelected] = useState(new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({
    query: "",
    status: "",
    digitalStatus: "",
    city: "",
    phoneType: "",
  });

  const cities = useMemo(() => {
    return [...new Set(leads.map((lead) => lead.city).filter(Boolean))].sort((a, b) => a.localeCompare(b, "ar"));
  }, [leads]);

  const filtered = useMemo(() => filterCrmLeads(leads, filters), [leads, filters]);
  const paging = useMemo(() => paginate(filtered, page, pageSize), [filtered, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [pageSize, filters.query, filters.status, filters.digitalStatus, filters.city, filters.phoneType]);

  useEffect(() => {
    if (page !== paging.page) setPage(paging.page);
  }, [page, paging.page]);

  if (loading) {
    return <LoadingState label="جاري تحميل العملاء من الـ CRM..." />;
  }

  if (leads.length === 0) {
    return (
      <EmptyState
        icon={EmptyIcons.Inbox}
        title="لا يوجد عملاء محفوظون بعد"
        description="ابحث عن أنشطة محلية بدون موقع، ثم احفظ النتائج هنا للمتابعة على واتساب."
        action={
          <Link
            href="/search"
            className="inline-flex rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            ابدأ البحث عن عملاء
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      <CrmFilters
        query={filters.query}
        status={filters.status}
        digitalStatus={filters.digitalStatus}
        city={filters.city}
        phoneType={filters.phoneType}
        cities={cities}
        total={leads.length}
        filteredCount={filtered.length}
        onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
        onReset={() =>
          setFilters({ query: "", status: "", digitalStatus: "", city: "", phoneType: "" })
        }
        onExport={() => exportLeadsToCsv(filtered, "crm-filtered.csv")}
      />
      {filtered.length === 0 ? (
        <EmptyState
          icon={EmptyIcons.FolderSearch}
          title="لا توجد نتائج مطابقة"
          description="جرّب كلمة بحث أخرى أو امسح الفلاتر لعرض كل العملاء المحفوظين."
        />
      ) : (
        <LeadsTable
          leads={paging.items}
          selected={selected}
          templates={templates}
          templateByLead={templateByLead}
          crmStatusById={Object.fromEntries(leads.map((lead) => [lead.placeId, lead.crmStatus]))}
          onToggle={(placeId) => {
            setSelected((prev) => {
              const next = new Set(prev);
              if (next.has(placeId)) next.delete(placeId);
              else next.add(placeId);
              return next;
            });
          }}
          onToggleAll={() => {
            const pageIds = paging.items.map((lead) => lead.placeId);
            const allOnPage = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
            setSelected((prev) => {
              const next = new Set(prev);
              if (allOnPage) pageIds.forEach((id) => next.delete(id));
              else pageIds.forEach((id) => next.add(id));
              return next;
            });
          }}
          onSave={() => {}}
          onWhatsApp={onWhatsApp}
          onCrmStatus={onCrmStatus}
          onTemplateChange={onTemplateChange}
          showSave={false}
        />
      )}
      {filtered.length > 0 ? (
        <PaginationBar
          page={paging.page}
          pageSize={pageSize}
          total={filtered.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      ) : null}
      {filtered.length > 0 ? (
        <div className="flex justify-end">
          <button
            type="button"
            disabled={!selected.size}
            onClick={async () => {
              for (const placeId of selected) await onDelete(placeId);
              setSelected(new Set());
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
            حذف المحدد
          </button>
        </div>
      ) : null}
    </div>
  );
}
