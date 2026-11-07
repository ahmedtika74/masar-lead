export const DEFAULT_TEMPLATES = [
  {
    id: "clinics",
    name: "العيادات والمراكز الطبية",
    keywords: [
      "عياد",
      "أسنان",
      "طبي",
      "صيدلي",
      "تحاليل",
      "جلد",
      "عيون",
      "علاج طبيعي",
      "clinic",
      "dental",
      "medical",
      "hospital",
      "pharmacy",
    ],
    body: `السلام عليكم {name}،
أنا بتواصل معاكم بخصوص حضوركم الرقمي. لاحظت إن المكان مش ظاهر بشكل قوي على الإنترنت بموقع خاص بيه.
أقدر أساعدكم بعمل موقع بسيط يعرض الخدمات وطريقة الحجز ويسهّل على المرضى يلاقوكم.
لو مناسب، نقدر نتكلم دقيقة؟`,
  },
  {
    id: "fashion",
    name: "الملابس والمحلات",
    keywords: [
      "ملابس",
      "عبايات",
      "أطفال",
      "أحذية",
      "إكسسوار",
      "مفروشات",
      "موبايلات",
      "أجهزة",
      "سوبر ماركت",
      "تجزئة",
      "clothes",
      "fashion",
      "boutique",
    ],
    body: `السلام عليكم {name} في {city}،
شفت المحل وشغلكم حلو، ولاحظت إن الاعتماد الأكبر على السوشيال ومفيش موقع يعرض المنتجات والأسعار والتوصيل.
موقع بسيط يخلي العملاء يتصفحوا الأصناف ويطلبوا أسهل، ويبني ثقة أكتر من الصفحة بس.
لو حابب، أقدر أشارككم شكل الموقع المناسب لـ {category}.`,
  },
  {
    id: "food",
    name: "المطاعم والكافيهات",
    keywords: [
      "مطعم",
      "مطاعم",
      "كافيه",
      "كافية",
      "قهوة",
      "كوفي",
      "حلويات",
      "مخبز",
      "مخابز",
      "عصائر",
      "كشري",
      "بيتزا",
      "restaurant",
      "cafe",
      "coffee",
      "bakery",
      "food",
    ],
    body: `السلام عليكم {name}،
شفت المكان في {city} ولاحظت إن مفيش موقع يعرض المنيو ورقم الطلب وساعات العمل بشكل واضح.
موقع بسيط بيساعد العملاء يطلبوا أسرع ويلاقوكم أسهل على جوجل، مش بس على فيسبوك.
حابب أشوف معاكم نموذج لمطعم/كافيه؟`,
  },
  {
    id: "beauty",
    name: "التجميل والعناية",
    keywords: ["تجميل", "صالون", "باربر", "سبا", "عطور", "ليزر", "salon", "spa", "barber", "beauty"],
    body: `السلام عليكم {name}،
لاحظت إن المركز معتمد على الإنستجرام/فيسبوك ومفيش موقع يعرض الخدمات والأسعار ونظام الحجز.
موقع بسيط يخلي العميلة تحجز أسهل ويظهر شغلكم بشكل أرقى على جوجل.
لو مناسب، نقدر نعمل تجربة سريعة لـ {category} في {city}.`,
  },
  {
    id: "finishing",
    name: "التشطيبات والعقارات",
    keywords: [
      "تشطيب",
      "ديكور",
      "عقارات",
      "ألوميتال",
      "نجارة",
      "تكييف",
      "ستائر",
      "سيراميك",
      "رخام",
      "real estate",
      "decor",
      "finishing",
      "interior",
    ],
    body: `السلام عليكم {name} في {city}،
لاحظت إن الشغل معتمد على صفحات السوشيال فقط ومفيش موقع احترافي يعرض المشاريع والأسعار.
موقع بسيط بيساعد العملاء يثقوا في الشغل ويتواصلوا أسرع.
حابب أشارككم نموذج؟`,
  },
  {
    id: "offices",
    name: "المكاتب المهنية",
    keywords: ["محام", "محاسب", "lawyer", "attorney", "accounting"],
    body: `السلام عليكم أستاذ / {name}،
لاحظت إن المكتب في {city} مش ظاهر بموقع يعرّف بالتخصصات وطريقة التواصل والاستشارة.
موقع بسيط ورسمي بيرفع ثقة العملاء ويخلي الناس تلاقيكم أسهل على جوجل.
لو حابب، أقدر أوضح شكل مناسب لمكتب {category}.`,
  },
  {
    id: "auto",
    name: "السيارات والصيانة",
    keywords: ["ورش", "ورشة", "سيارات", "مغاسل", "مغسلة", "صيانة موبايل", "car", "auto", "repair"],
    body: `السلام عليكم {name}،
شفت الشغل في {city} ولاحظت إن مفيش موقع يوضح الخدمات والأسعار ورقم الواتساب بشكل ثابت.
العميل غالباً بيدور على جوجل قبل ما يتصل، والموقع بيخلي الورشة/المحل يبان أقرب وأوثق.
نقدر نعمل صفحة بسيطة لـ {category} في دقايق لو حابب.`,
  },
  {
    id: "edu",
    name: "التعليم والرياضة",
    keywords: ["سنتر", "سناتر", "حضانة", "حضانات", "جيم", "نادي", "أندية", "مدارس", "تعليم", "gym", "school", "nursery"],
    body: `السلام عليكم {name}،
لاحظت إن المكان في {city} مش ظاهر بموقع يعرض البرامج، المواعيد، وطريقة التسجيل.
موقع بسيط يسهّل على الأهالي/العملاء يتعرفوا على {category} ويتواصلوا أسرع من الرسالة العشوائية.
لو مناسب، أشارككم نموذج؟`,
  },
  {
    id: "services",
    name: "الخدمات والدعاية",
    keywords: ["طباعة", "دعاية", "تصوير", "شحن", "نقل", "printing", "shipping", "photo"],
    body: `السلام عليكم {name}،
شفت نشاط {category} في {city} ولاحظت إن مفيش موقع يعرض الخدمات السابقة وطريقة الطلب.
موقع بسيط بيخلي العميل يشوف الشغل ويتواصل مباشرة، وده بيفرق عن الاعتماد على السوشيال فقط.
حابب نعمل تجربة سريعة؟`,
  },
  {
    id: "general",
    name: "قالب عام",
    keywords: [],
    body: `السلام عليكم {name}،
شفت نشاطكم في {city} ولاحظت إن مفيش موقع إلكتروني مخصص ليكم.
أقدر أساعدكم تعملوا موقع يعرّف العملاء بخدماتكم ويسهّل التواصل.
ممكن نتكلم؟`,
  },
];

const STORAGE_KEY = "leadfinder.templates";

export function loadTemplates() {
  if (typeof window === "undefined") return DEFAULT_TEMPLATES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_TEMPLATES;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_TEMPLATES;
    return DEFAULT_TEMPLATES.map((fallback) => {
      const saved = parsed.find((item) => item.id === fallback.id);
      return saved ? { ...fallback, body: saved.body || fallback.body, name: saved.name || fallback.name } : fallback;
    });
  } catch {
    return DEFAULT_TEMPLATES;
  }
}

export function saveTemplates(templates) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

export function pickTemplateId(niche = "", category = "", templates = DEFAULT_TEMPLATES) {
  return resolveTemplateId({ searchQuery: niche, category }, templates);
}

export function resolveTemplateId(lead = {}, templates = DEFAULT_TEMPLATES, extraNiche = "") {
  const haystack = [
    extraNiche,
    lead.searchQuery,
    lead.category,
    lead.name,
    ...(Array.isArray(lead.types) ? lead.types : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  let bestId = "general";
  let bestLen = 0;
  for (const tpl of templates) {
    if (tpl.id === "general") continue;
    for (const word of tpl.keywords || []) {
      const needle = String(word).toLowerCase();
      if (needle && haystack.includes(needle) && needle.length > bestLen) {
        bestId = tpl.id;
        bestLen = needle.length;
      }
    }
  }
  return bestId;
}
