"use client";

import { MessageSquareText } from "lucide-react";
import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import CrmPanel from "@/components/CrmPanel";
import TemplatesDrawer from "@/components/TemplatesDrawer";
import { deleteLead, listLeads, updateLead } from "@/lib/crmStore";
import { buildWhatsAppUrl } from "@/lib/formatters";
import { DEFAULT_TEMPLATES, loadTemplates, resolveTemplateId, saveTemplates } from "@/lib/templates";

export default function CrmPage() {
  const [crmLeads, setCrmLeads] = useState([]);
  const [crmSource, setCrmSource] = useState("local");
  const [loading, setLoading] = useState(true);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);
  const [templateByLead, setTemplateByLead] = useState({});

  useEffect(() => {
    setTemplates(loadTemplates());
    refreshCrm();
  }, []);

  async function refreshCrm({ silent = false } = {}) {
    if (!silent) setLoading(true);
    try {
      const result = await listLeads();
      setCrmLeads(result.leads);
      setCrmSource(result.source);
    } finally {
      if (!silent) setLoading(false);
    }
  }

  async function handleCrmStatus(lead, status) {
    const result = await updateLead(lead.placeId, { status, crmStatus: status });
    if (result.leads) setCrmLeads(result.leads);
    else await refreshCrm({ silent: true });
  }

  function handleWhatsApp(lead) {
    const tplId = templateByLead[lead.placeId] || resolveTemplateId(lead, templates);
    const tpl = templates.find((item) => item.id === tplId) || templates[0];
    const url = buildWhatsAppUrl(lead.phoneInfo?.whatsapp, tpl.body, {
      name: lead.name,
      businessName: lead.name,
      city: lead.city || "",
      category: lead.category,
    });
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  async function handleDeleteCrm(placeId) {
    const result = await deleteLead(placeId);
    if (result.leads) setCrmLeads(result.leads);
    else await refreshCrm({ silent: true });
  }

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
      <p className="mb-4 text-xs text-slate-500">
        {loading
          ? "جاري الاتصال بمصدر البيانات..."
          : `المصدر الحالي: ${crmSource === "supabase" ? "Supabase" : "LocalStorage"} · ${crmLeads.length} عميل`}
      </p>
      <CrmPanel
        leads={crmLeads}
        loading={loading}
        templates={templates}
        templateByLead={templateByLead}
        onWhatsApp={handleWhatsApp}
        onCrmStatus={handleCrmStatus}
        onDelete={handleDeleteCrm}
        onTemplateChange={(placeId, id) =>
          setTemplateByLead((prev) => ({ ...prev, [placeId]: id }))
        }
      />
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
