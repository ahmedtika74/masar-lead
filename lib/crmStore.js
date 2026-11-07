import axios from "axios";

const LS_KEY = "leadfinder.leads";

function readLocal() {
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocal(leads) {
  window.localStorage.setItem(LS_KEY, JSON.stringify(leads));
}

async function fetchRemoteLeads() {
  try {
    const { data } = await axios.get("/api/leads");
    if (data.enabled === false) return { enabled: false, leads: [] };
    return { enabled: true, leads: data.leads || [] };
  } catch {
    return { enabled: false, leads: [] };
  }
}

export function fromApiLead(row) {
  return {
    id: row.id,
    placeId: row.place_id,
    name: row.name,
    category: row.category,
    rating: row.rating,
    reviews: row.reviews,
    address: row.address,
    city: row.city,
    phone: row.phone,
    websiteUri: row.website_uri,
    digitalStatus: row.digital_status,
    mapsUri: row.maps_uri,
    searchQuery: row.search_query,
    crmStatus: row.status || "New",
    notes: row.notes || "",
    lastContactedAt: row.last_contacted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    phoneInfo: {
      type: row.phone_type || "unknown",
      whatsapp: row.whatsapp_phone || null,
      hasWhatsApp: Boolean(row.whatsapp_phone),
      label: row.phone_type === "mobile" ? "موبايل" : row.phone_type === "landline" ? "أرضي" : "رقم",
      carrier: null,
      local: row.phone || "",
    },
  };
}

export function toApiLead(lead, extras = {}) {
  return {
    place_id: lead.placeId,
    name: lead.name,
    category: lead.category,
    rating: lead.rating ?? null,
    reviews: lead.reviews ?? null,
    address: lead.address || null,
    city: extras.city || lead.city || null,
    phone: lead.phone || null,
    whatsapp_phone: lead.phoneInfo?.whatsapp || null,
    phone_type: lead.phoneInfo?.type || "unknown",
    website_uri: lead.websiteUri || null,
    digital_status: lead.digitalStatus,
    maps_uri: lead.mapsUri || null,
    search_query: extras.searchQuery || lead.searchQuery || null,
    status: lead.crmStatus || "New",
    notes: lead.notes || "",
  };
}

export async function listLeads() {
  const remote = await fetchRemoteLeads();
  if (!remote.enabled) return { source: "local", leads: readLocal() };
  return { source: "supabase", leads: remote.leads.map(fromApiLead) };
}

export async function saveLeads(leads, extras = {}) {
  const remote = await fetchRemoteLeads();
  if (!remote.enabled) {
    const existing = readLocal();
    const byId = new Map(existing.map((item) => [item.placeId, item]));
    for (const lead of leads) {
      const prev = byId.get(lead.placeId);
      byId.set(lead.placeId, {
        ...lead,
        city: extras.city || lead.city || prev?.city || "",
        searchQuery: extras.searchQuery || lead.searchQuery || prev?.searchQuery || "",
        crmStatus: prev?.crmStatus || lead.crmStatus || "New",
        notes: prev?.notes || lead.notes || "",
        savedAt: prev?.savedAt || new Date().toISOString(),
      });
    }
    const next = Array.from(byId.values());
    writeLocal(next);
    return { source: "local", leads: next };
  }

  const { data } = await axios.post("/api/leads", {
    leads: leads.map((lead) => toApiLead(lead, extras)),
  });
  return { source: "supabase", leads: (data.leads || []).map(fromApiLead) };
}

export async function updateLead(placeId, patch) {
  const remote = await fetchRemoteLeads();
  if (!remote.enabled) {
    const next = readLocal().map((lead) =>
      lead.placeId === placeId
        ? {
            ...lead,
            ...patch,
            updatedAt: new Date().toISOString(),
          }
        : lead,
    );
    writeLocal(next);
    return { source: "local", leads: next };
  }

  const { data } = await axios.patch("/api/leads", { placeId, ...patch });
  return { source: "supabase", lead: data.lead ? fromApiLead(data.lead) : null };
}

export async function deleteLead(placeId) {
  const remote = await fetchRemoteLeads();
  if (!remote.enabled) {
    const next = readLocal().filter((lead) => lead.placeId !== placeId);
    writeLocal(next);
    return { source: "local", leads: next };
  }

  await axios.delete("/api/leads", { data: { placeId } });
  return { source: "supabase" };
}
