const ARABIC_INDIC = "٠١٢٣٤٥٦٧٨٩";
const EASTERN_ARABIC = "۰۱۲۳۴۵۶۷۸۹";

const MOBILE_CARRIERS = {
  "010": "Vodafone",
  "011": "Etisalat",
  "012": "Orange",
  "015": "WE",
};

const LANDLINE_PREFIXES = [
  { prefix: "02", label: "القاهرة / الجيزة" },
  { prefix: "03", label: "الإسكندرية" },
  { prefix: "013", label: "القليوبية" },
  { prefix: "040", label: "الغربية" },
  { prefix: "045", label: "البحيرة" },
  { prefix: "047", label: "كفر الشيخ" },
  { prefix: "048", label: "المنوفية" },
  { prefix: "050", label: "الدقهلية" },
  { prefix: "055", label: "الشرقية" },
  { prefix: "057", label: "دمياط" },
  { prefix: "062", label: "السويس" },
  { prefix: "064", label: "الإسماعيلية" },
  { prefix: "065", label: "البحر الأحمر" },
  { prefix: "066", label: "بورسعيد" },
  { prefix: "068", label: "شمال سيناء" },
  { prefix: "069", label: "جنوب سيناء" },
  { prefix: "082", label: "بني سويف" },
  { prefix: "084", label: "الفيوم" },
  { prefix: "086", label: "المنيا" },
  { prefix: "088", label: "أسيوط" },
  { prefix: "092", label: "الوادي الجديد" },
  { prefix: "093", label: "سوهاج" },
  { prefix: "095", label: "قنا" },
  { prefix: "096", label: "الأقصر" },
  { prefix: "097", label: "أسوان" },
].sort((a, b) => b.prefix.length - a.prefix.length);

export function normalizeSearch(value) {
  return toWesternDigits(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function toWesternDigits(value) {
  return String(value ?? "").replace(/[٠-٩۰-۹]/g, (char) => {
    const arabic = ARABIC_INDIC.indexOf(char);
    if (arabic !== -1) return String(arabic);
    const eastern = EASTERN_ARABIC.indexOf(char);
    return eastern === -1 ? char : String(eastern);
  });
}

export function digitsOnly(value) {
  return toWesternDigits(value).replace(/\D/g, "");
}

function toLocalEgypt(digits) {
  let d = digits;
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("20")) d = d.slice(2);
  if (d && !d.startsWith("0")) d = `0${d}`;
  return d;
}

export function parseEgyptPhone(nationalPhoneNumber, internationalPhoneNumber) {
  const raw = internationalPhoneNumber || nationalPhoneNumber || "";
  const digits = digitsOnly(raw);

  if (!digits) {
    return {
      raw: "",
      local: "",
      type: "unknown",
      label: "لا يوجد رقم",
      carrier: null,
      whatsapp: null,
      hasWhatsApp: false,
    };
  }

  const local = toLocalEgypt(digits);

  if (/^01[0125]\d{8}$/.test(local)) {
    const prefix = local.slice(0, 3);
    return {
      raw,
      local,
      type: "mobile",
      label: "موبايل",
      carrier: MOBILE_CARRIERS[prefix] || null,
      whatsapp: `20${local.slice(1)}`,
      hasWhatsApp: true,
    };
  }

  if (/^19\d{3,5}$/.test(local) || /^019\d{3,5}$/.test(local)) {
    return {
      raw,
      local,
      type: "hotline",
      label: "خط ساخن",
      carrier: null,
      whatsapp: null,
      hasWhatsApp: false,
    };
  }

  const landline = LANDLINE_PREFIXES.find((entry) => local.startsWith(entry.prefix));
  if (landline) {
    return {
      raw,
      local,
      type: "landline",
      label: `أرضي · ${landline.label}`,
      carrier: null,
      whatsapp: null,
      hasWhatsApp: false,
    };
  }

  return {
    raw,
    local,
    type: "unknown",
    label: "رقم غير معروف",
    carrier: null,
    whatsapp: null,
    hasWhatsApp: false,
  };
}

export function fillTemplate(template, vars = {}) {
  const values = {
    name: vars.name || vars.businessName || "",
    businessName: vars.businessName || vars.name || "",
    city: vars.city || "",
    category: vars.category || "",
  };

  return String(template || "").replace(
    /\{(name|businessName|city|category)\}/g,
    (_, key) => values[key] ?? "",
  );
}

export function buildWhatsAppUrl(whatsappPhone, template, vars) {
  if (!whatsappPhone) return null;
  const text = fillTemplate(template, vars);
  return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(text)}`;
}

function csvEscape(value) {
  const str = value == null ? "" : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function leadsToCsv(leads) {
  const headers = [
    "الاسم",
    "التصنيف",
    "التقييم",
    "عدد التقييمات",
    "العنوان",
    "المدينة",
    "الحالة الرقمية",
    "الهاتف",
    "واتساب",
    "نوع الرقم",
    "الموقع",
    "خرائط جوجل",
    "حالة CRM",
  ];

  const rows = leads.map((lead) => [
    lead.name,
    lead.category,
    lead.rating ?? "",
    lead.reviews ?? "",
    lead.address,
    lead.city,
    lead.digitalStatus,
    lead.phone,
    lead.phoneInfo?.whatsapp || "",
    lead.phoneInfo?.type || "",
    lead.websiteUri || "",
    lead.mapsUri || "",
    lead.crmStatus || "",
  ]);

  return [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\r\n");
}

export function exportLeadsToCsv(leads, filename = "leads.csv") {
  const csv = `\uFEFF${leadsToCsv(leads)}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const TYPE_LABELS = {
  dentist: "عيادة أسنان",
  dental_clinic: "عيادة أسنان",
  doctor: "عيادة طبية",
  hospital: "مستشفى",
  medical_clinic: "مركز طبي",
  pharmacy: "صيدلية",
  restaurant: "مطعم",
  cafe: "كافيه",
  bakery: "مخبز",
  lawyer: "مكتب محاماة",
  attorney: "مكتب محاماة",
  accounting: "مكتب محاسبة",
  real_estate_agency: "عقارات",
  general_contractor: "تشطيبات",
  painter: "دهانات",
  plumber: "سباكة",
  electrician: "كهرباء",
  car_repair: "ورشة سيارات",
  car_wash: "مغسلة سيارات",
  beauty_salon: "صالون تجميل",
  hair_care: "صالون شعر",
  spa: "سبا",
  clothing_store: "ملابس",
  shoe_store: "أحذية",
  jewelry_store: "إكسسوارات",
  furniture_store: "مفروشات",
  home_goods_store: "مفروشات منزلية",
  electronics_store: "أجهزة كهربائية",
  cell_phone_store: "موبايلات",
  supermarket: "سوبر ماركت",
  gym: "جيم",
  school: "تعليم",
  preschool: "حضانة",
  moving_company: "شحن ونقل",
  laundry: "مغسلة",
};

export function categoryFromTypes(types = []) {
  for (const type of types) {
    if (TYPE_LABELS[type]) return TYPE_LABELS[type];
  }
  if (!types.length) return "نشاط تجاري";
  return types[0].replace(/_/g, " ");
}
