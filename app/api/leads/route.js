import { getSupabase, isSupabaseConfigured } from "@/lib/supabaseServer";

function json(data, status = 200) {
  return Response.json(data, { status });
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return json({ enabled: false, leads: [] });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) return json({ enabled: true, error: error.message }, 500);
  return json({ enabled: true, leads: data || [] });
}

export async function POST(request) {
  if (!isSupabaseConfigured()) {
    return json({ enabled: false, error: "Supabase is not configured" }, 200);
  }

  const body = await request.json();
  const rows = Array.isArray(body.leads) ? body.leads : [];
  if (!rows.length) return json({ error: "leads array is required" }, 400);

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("leads")
    .upsert(rows, { onConflict: "place_id" })
    .select();

  if (error) return json({ error: error.message }, 500);
  return json({ enabled: true, leads: data || [] });
}

export async function PATCH(request) {
  if (!isSupabaseConfigured()) {
    return json({ enabled: false, error: "Supabase is not configured" }, 200);
  }

  const body = await request.json();
  const placeId = body.placeId;
  if (!placeId) return json({ error: "placeId is required" }, 400);

  const patch = {};
  if (body.status) patch.status = body.status;
  if (typeof body.notes === "string") patch.notes = body.notes;
  if (body.status === "Contacted") patch.last_contacted_at = new Date().toISOString();

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("leads")
    .update(patch)
    .eq("place_id", placeId)
    .select()
    .single();

  if (error) return json({ error: error.message }, 500);
  return json({ enabled: true, lead: data });
}

export async function DELETE(request) {
  if (!isSupabaseConfigured()) {
    return json({ enabled: false, error: "Supabase is not configured" }, 200);
  }

  const body = await request.json();
  const placeId = body.placeId;
  if (!placeId) return json({ error: "placeId is required" }, 400);

  const supabase = getSupabase();
  const { error } = await supabase.from("leads").delete().eq("place_id", placeId);
  if (error) return json({ error: error.message }, 500);
  return json({ enabled: true, ok: true });
}
