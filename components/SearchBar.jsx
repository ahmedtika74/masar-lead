import { Plus, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ALL_CITIES, CITY_GROUPS } from "@/lib/egyptCities";
import { NICHE_GROUPS, NICHE_PRESETS } from "@/lib/niches";

export { NICHE_PRESETS };

export default function SearchBar({
  niche,
  cities,
  minReviews,
  minRating,
  onlyNoWebsite,
  loading,
  loadingLabel,
  onChange,
  onSearch,
}) {
  const [cityQuery, setCityQuery] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [nicheQuery, setNicheQuery] = useState("");

  const selected = useMemo(() => new Set(cities), [cities]);
  const allSelected = ALL_CITIES.length > 0 && ALL_CITIES.every((city) => selected.has(city));

  const filteredGroups = useMemo(() => {
    const q = cityQuery.trim();
    if (!q) return CITY_GROUPS;
    return CITY_GROUPS.map((group) => ({
      ...group,
      cities: group.cities.filter((city) => city.includes(q)),
    })).filter((group) => group.cities.length > 0);
  }, [cityQuery]);

  const filteredNiches = useMemo(() => {
    const q = nicheQuery.trim();
    if (!q) return NICHE_GROUPS;
    return NICHE_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item) => item.includes(q)),
    })).filter((group) => group.items.length > 0);
  }, [nicheQuery]);

  function setCities(next) {
    onChange({ cities: [...new Set(next)] });
  }

  function toggleCity(city) {
    if (selected.has(city)) setCities(cities.filter((item) => item !== city));
    else setCities([...cities, city]);
  }

  function toggleGroup(group) {
    const allOn = group.cities.every((city) => selected.has(city));
    if (allOn) setCities(cities.filter((city) => !group.cities.includes(city)));
    else setCities([...cities, ...group.cities]);
  }

  function toggleAll() {
    setCities(allSelected ? [] : ALL_CITIES);
  }

  function addCustomCity() {
    const value = customCity.trim();
    if (!value) return;
    setCities([...cities, value]);
    setCustomCity("");
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-600">النشاط / الكلمة المفتاحية</span>
          <input
            value={niche}
            onChange={(e) => onChange({ niche: e.target.value })}
            placeholder="مثال: عيادات أسنان"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none ring-teal-500/30 transition focus:bg-white focus:ring-4"
          />
        </label>
        <div className="flex items-end">
          <button
            type="button"
            onClick={onSearch}
            disabled={loading || !niche.trim() || cities.length === 0}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Search className="h-4 w-4" />
            {loading ? loadingLabel || "جاري البحث..." : `بحث في ${cities.length} موقع`}
          </button>
        </div>
      </div>

      <div className="mt-3">
        <input
          value={nicheQuery}
          onChange={(e) => setNicheQuery(e.target.value)}
          placeholder="تصفية الأنشطة... ملابس، كافيهات، صيدليات"
          className="mb-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/20 md:max-w-sm"
        />
        <div className="max-h-44 space-y-2 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50/70 p-3">
          {filteredNiches.map((group) => (
            <div key={group.id}>
              <span className="mb-1.5 block text-xs font-bold text-slate-500">{group.name}</span>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => onChange({ niche: item })}
                    className={`rounded-full px-2.5 py-1 text-xs ring-1 transition ${
                      niche === item
                        ? "bg-teal-600 text-white ring-teal-600"
                        : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">المدن والمناطق</h3>
            <p className="text-xs text-slate-500">يمكن اختيار أكثر من مدينة. كل مدينة تستهلك طلب API واحد.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleAll}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ${
                allSelected ? "bg-slate-900 text-white ring-slate-900" : "bg-slate-50 text-slate-800 ring-slate-200"
              }`}
            >
              {allSelected ? "إلغاء الكل" : "اختيار الكل"}
            </button>
            <button
              type="button"
              onClick={() => setCities([])}
              disabled={!cities.length}
              className="rounded-full px-3 py-1.5 text-sm text-slate-600 ring-1 ring-slate-200 disabled:opacity-40"
            >
              مسح التحديد
            </button>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          <input
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
            placeholder="تصفية القائمة..."
            className="min-w-48 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/20"
          />
          <div className="flex min-w-64 flex-1 gap-2">
            <input
              value={customCity}
              onChange={(e) => setCustomCity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomCity();
                }
              }}
              placeholder="أضف مدينة غير موجودة..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/20"
            />
            <button
              type="button"
              onClick={addCustomCity}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Plus className="h-4 w-4" />
              إضافة
            </button>
          </div>
        </div>

        {cities.length > 0 ? (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {cities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => toggleCity(city)}
                className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-1 text-xs text-white"
              >
                {city}
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        ) : (
          <p className="mb-3 text-sm text-amber-700">اختر مدينة واحدة على الأقل.</p>
        )}

        <div className="max-h-72 space-y-3 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50/70 p-3">
          {filteredGroups.map((group) => {
            const groupAll = group.cities.every((city) => selected.has(city));
            const groupSome = group.cities.some((city) => selected.has(city));
            return (
              <div key={group.id}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">{group.name}</span>
                  <button
                    type="button"
                    onClick={() => toggleGroup(group)}
                    className="text-xs font-medium text-teal-700 hover:underline"
                  >
                    {groupAll ? "إلغاء المجموعة" : groupSome ? "إكمال المجموعة" : "كل المجموعة"}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.cities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => toggleCity(city)}
                      className={`rounded-full px-2.5 py-1 text-xs ring-1 transition ${
                        selected.has(city)
                          ? "bg-slate-800 text-white ring-slate-800"
                          : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-sm">
        <span className="inline-flex items-center gap-1.5 font-medium text-slate-500">
          <SlidersHorizontal className="h-4 w-4" />
          فلاتر
        </span>
        <label className="flex items-center gap-2">
          <span className="text-slate-600">أقل عدد تقييمات</span>
          <input
            type="number"
            min="0"
            value={minReviews}
            onChange={(e) => onChange({ minReviews: Number(e.target.value) })}
            className="w-20 rounded-lg border border-slate-200 px-2 py-1.5"
          />
        </label>
        <label className="flex items-center gap-2">
          <span className="text-slate-600">أقل تقييم</span>
          <input
            type="number"
            min="1"
            max="5"
            step="0.5"
            value={minRating}
            onChange={(e) => onChange({ minRating: Number(e.target.value) })}
            className="w-20 rounded-lg border border-slate-200 px-2 py-1.5"
          />
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={onlyNoWebsite}
            onChange={(e) => onChange({ onlyNoWebsite: e.target.checked })}
            className="h-4 w-4 accent-teal-600"
          />
          <span className="text-slate-700">إظهار بدون موقع أو سوشيال فقط</span>
        </label>
      </div>
    </section>
  );
}
