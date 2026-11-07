"use client";

import axios from "axios";
import { Download, LoaderCircle, MessageSquareText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AppHeader from "@/components/AppHeader";
import { EmptyIcons, EmptyState, LoadingState } from "@/components/DataStates";
import LeadsTable from "@/components/LeadsTable";
import PaginationBar, { paginate } from "@/components/PaginationBar";
import SearchBar from "@/components/SearchBar";
import TemplatesDrawer from "@/components/TemplatesDrawer";
import { listLeads, saveLeads, updateLead } from "@/lib/crmStore";
import { buildWhatsAppUrl, exportLeadsToCsv } from "@/lib/formatters";
import { DEFAULT_TEMPLATES, loadTemplates, resolveTemplateId, saveTemplates } from "@/lib/templates";
import { cacheKey, getCachedSearch, incrementUsage, setCachedSearch } from "@/lib/usage";

export default function SearchPage() {
  const [niche, setNiche] = useState("عيادات أسنان");
  const [cities, setCities] = useState(["المنصورة"]);
  const [minReviews, setMinReviews] = useState(20);
  const [minRating, setMinRating] = useState(3.5);
  const [onlyNoWebsite, setOnlyNoWebsite] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [leads, setLeads] = useState([]);
  const [pageTokens, setPageTokens] = useState({});
  const [rawCount, setRawCount] = useState(0);
  const [loadingLabel, setLoadingLabel] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [crmLeads, setCrmLeads] = useState([]);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);
  const [templateByLead, setTemplateByLead] = useState({});
  const [notice, setNotice] = useState("");
  const [resultsPage, setResultsPage] = useState(1);
  const [resultsPageSize, setResultsPageSize] = useState(10);

  const citiesLabel = cities.join("، ");

  useEffect(() => {
    setTemplates(loadTemplates());
    refreshCrm();
  }, []);

  async function refreshCrm() {
    const result = await listLeads();
    setCrmLeads(result.leads);
  }

  const crmStatusById = useMemo(() => {
    const map = {};
    for (const lead of crmLeads) map[lead.placeId] = lead.crmStatus;
    return map;
  }, [crmLeads]);

  const visibleLeads = useMemo(() => {
    if (!onlyNoWebsite) return leads;
    return leads.filter(
      (lead) => lead.digitalStatus === "NO_WEBSITE" || lead.digitalStatus === "SOCIAL_ONLY",
    );
  }, [leads, onlyNoWebsite]);

  const resultsPaging = useMemo(
    () => paginate(visibleLeads, resultsPage, resultsPageSize),
    [visibleLeads, resultsPage, resultsPageSize],
  );

  useEffect(() => {
    setResultsPage(1);
  }, [onlyNoWebsite, resultsPageSize]);

  useEffect(() => {
    if (resultsPage !== resultsPaging.page) setResultsPage(resultsPaging.page);
  }, [resultsPage, resultsPaging.page]);

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2500);
  }

  async function runSearch({ append = false } = {}) {
    if (!niche.trim() || cities.length === 0) return;
    setHasSearched(true);
    setLoading(true);
    setError("");

    const targets = append ? cities.filter((city) => pageTokens[city]) : cities;
    if (!targets.length) {
      setLoading(false);
      return;
    }

    if (!append) {
      setLeads([]);
      setSelected(new Set());
      setTemplateByLead({});
      setPageTokens({});
      setRawCount(0);
      setResultsPage(1);
    }

    const nextTokens = append ? { ...pageTokens } : {};
    let totalRaw = append ? rawCount : 0;
    let cacheHits = 0;
    const errors = [];
    try {
      for (let i = 0; i < targets.length; i += 1) {
        const city = targets[i];
        const query = `${niche.trim()} في ${city}`;
        const pageToken = append ? nextTokens[city] : undefined;
        setLoadingLabel(`جاري البحث في ${city} (${i + 1}/${targets.length})`);

        const key = cacheKey({ query, minRating, minReviews, pageToken });
        let data = getCachedSearch(key);
        if (data) {
          cacheHits += 1;
        } else {
          try {
            const response = await axios.post("/api/search-leads", {
              query,
              minRating,
              minReviews,
              pageToken: pageToken || undefined,
            });
            data = response.data;
            setCachedSearch(key, data);
            incrementUsage();
          } catch (err) {
            errors.push(`${city}: ${err.response?.data?.error || err.message || "فشل البحث"}`);
            continue;
          }
        }

        const incoming = data.leads || [];
        totalRaw += data.rawCount || incoming.length;
        nextTokens[city] = data.nextPageToken || null;

        setLeads((prev) => {
          const seen = new Set(prev.map((item) => item.placeId));
          const merged = [...prev];
          for (const lead of incoming) {
            if (!seen.has(lead.placeId)) {
              seen.add(lead.placeId);
              merged.push({ ...lead, city, searchQuery: query });
            }
          }
          return merged;
        });
        setTemplateByLead((prev) => {
          const next = { ...prev };
          for (const lead of incoming) {
            if (!next[lead.placeId]) next[lead.placeId] = resolveTemplateId(lead, templates, niche);
          }
          return next;
        });
      }

      setPageTokens(nextTokens);
      setRawCount(totalRaw);
      if (cacheHits === targets.length) {
        showNotice("تم التحميل من الكاش — بدون استهلاك من الحصة");
      } else if (cacheHits > 0) {
        showNotice(`تم استخدام الكاش لـ ${cacheHits} مدينة`);
      }
      if (errors.length) setError(errors.join(" · "));
    } finally {
      setLoading(false);
      setLoadingLabel("");
    }
  }

  function toggle(placeId) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(placeId)) next.delete(placeId);
      else next.add(placeId);
      return next;
    });
  }

  function toggleAll() {
    const pageIds = resultsPaging.items.map((lead) => lead.placeId);
    const allOnPage = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPage) pageIds.forEach((id) => next.delete(id));
      else pageIds.forEach((id) => next.add(id));
      return next;
    });
  }

  async function handleSave(leadOrList) {
    const list = Array.isArray(leadOrList) ? leadOrList : [leadOrList];
    if (!list.length) return;
    const result = await saveLeads(list, {
      city: list[0]?.city || cities[0],
      searchQuery: `${niche.trim()} في ${citiesLabel}`,
    });
    if (result.leads) setCrmLeads(result.leads);
    else await refreshCrm();
    showNotice(`تم حفظ ${list.length} عميل في الـ CRM`);
  }

  async function handleCrmStatus(lead, status) {
    const exists = crmLeads.some((item) => item.placeId === lead.placeId);
    if (!exists) {
      await handleSave({ ...lead, crmStatus: status });
      return;
    }
    const result = await updateLead(lead.placeId, { status, crmStatus: status });
    if (result.leads) setCrmLeads(result.leads);
    else await refreshCrm();
  }

  function handleWhatsApp(lead) {
    const tplId = templateByLead[lead.placeId] || resolveTemplateId(lead, templates, niche);
    const tpl = templates.find((item) => item.id === tplId) || templates[0];
    const url = buildWhatsAppUrl(lead.phoneInfo?.whatsapp, tpl.body, {
      name: lead.name,
      businessName: lead.name,
      city: lead.city || cities[0] || "",
      category: lead.category,
    });
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  const selectedLeads = visibleLeads.filter((lead) => selected.has(lead.placeId));

  return (
    <main>
      <AppHeader
        extra={
          <button
            type="button"
            onClick={() => setTemplatesOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <MessageSquareText className="h-4 w-4" />
            قوالب الرسائل
          </button>
        }
      />

      <SearchBar
        niche={niche}
        cities={cities}
        minReviews={minReviews}
        minRating={minRating}
        onlyNoWebsite={onlyNoWebsite}
        loading={loading}
        loadingLabel={loadingLabel}
        onChange={(patch) => {
          if (patch.niche !== undefined) setNiche(patch.niche);
          if (patch.cities !== undefined) setCities(patch.cities);
          if (patch.minReviews !== undefined) setMinReviews(patch.minReviews);
          if (patch.minRating !== undefined) setMinRating(patch.minRating);
          if (patch.onlyNoWebsite !== undefined) setOnlyNoWebsite(patch.onlyNoWebsite);
        }}
        onSearch={() => runSearch({ append: false })}
      />

      {notice ? (
        <div className="mt-4 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2 text-sm text-teal-800">{notice}</div>
      ) : null}
      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-700">النتائج ({visibleLeads.length})</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!selectedLeads.length}
            onClick={() => handleSave(selectedLeads)}
            className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-300"
          >
            حفظ المحدد في CRM ({selectedLeads.length})
          </button>
          <button
            type="button"
            disabled={!visibleLeads.length}
            onClick={() =>
              exportLeadsToCsv(
                visibleLeads.map((lead) => ({
                  ...lead,
                  crmStatus: crmStatusById[lead.placeId] || "New",
                })),
                `leads-${cities.join("-") || "egypt"}.csv`,
              )
            }
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
          >
            <Download className="h-4 w-4" />
            تصدير CSV
          </button>
        </div>
      </div>

      {rawCount ? (
        <p className="mt-2 text-xs text-slate-500">جوجل أرجع {rawCount} نتيجة قبل فلتر التقييمات</p>
      ) : null}

      <div className="mt-4">
        {loading && visibleLeads.length === 0 ? (
          <LoadingState label={loadingLabel || "جاري البحث عن العملاء..."} />
        ) : !hasSearched ? (
          <EmptyState
            icon={EmptyIcons.Search}
            title="ابدأ البحث عن عملاء"
            description="اختر نشاطاً ومدينة ثم اضغط بحث. النتائج ستظهر هنا ويمكن حفظها مباشرة في الـ CRM."
          />
        ) : visibleLeads.length === 0 ? (
          <EmptyState
            icon={EmptyIcons.FolderSearch}
            title="لا توجد نتائج"
            description="لا توجد أنشطة مطابقة للفلاتر الحالية. جرّب تخفيض حد التقييمات أو إلغاء خيار بدون موقع فقط."
          />
        ) : (
          <>
            {loading ? (
              <div className="mb-3 flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2 text-sm text-teal-800">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                {loadingLabel || "جاري جلب المزيد من النتائج..."}
              </div>
            ) : null}
            <LeadsTable
              leads={resultsPaging.items}
              selected={selected}
              templates={templates}
              templateByLead={templateByLead}
              crmStatusById={crmStatusById}
              onToggle={toggle}
              onToggleAll={toggleAll}
              onSave={handleSave}
              onWhatsApp={handleWhatsApp}
              onCrmStatus={handleCrmStatus}
              onTemplateChange={(placeId, id) =>
                setTemplateByLead((prev) => ({ ...prev, [placeId]: id }))
              }
            />
            <div className="mt-3">
              <PaginationBar
                page={resultsPaging.page}
                pageSize={resultsPageSize}
                total={visibleLeads.length}
                onPageChange={setResultsPage}
                onPageSizeChange={setResultsPageSize}
                extra={
                  Object.values(pageTokens).some(Boolean) ? (
                    <button
                      type="button"
                      onClick={() => runSearch({ append: true })}
                      disabled={loading}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                    >
                      جلب نتائج إضافية من جوجل
                    </button>
                  ) : null
                }
              />
            </div>
          </>
        )}
      </div>

      <TemplatesDrawer
        open={templatesOpen}
        templates={templates}
        onClose={() => setTemplatesOpen(false)}
        onChange={(next) => {
          setTemplates(next);
          saveTemplates(next);
        }}
        onReset={() => {
          setTemplates(DEFAULT_TEMPLATES);
          saveTemplates(DEFAULT_TEMPLATES);
        }}
      />
    </main>
  );
}
