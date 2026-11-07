"use client";

import { FolderKanban, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getUsage } from "@/lib/usage";

const NAV = [
  { href: "/", label: "الـ CRM", icon: FolderKanban },
  { href: "/search", label: "مولّد العملاء", icon: Search },
];

export default function AppHeader({ extra = null }) {
  const pathname = usePathname();
  const [usage, setUsage] = useState({ count: 0, limit: 1000 });

  useEffect(() => {
    setUsage(getUsage());
  }, [pathname]);

  const usagePct = Math.min(100, Math.round((usage.count / usage.limit) * 100));
  const onCrm = pathname === "/";
  const onSearch = pathname.startsWith("/search");

  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-teal-700">B2B Lead Finder · مصر</p>
        <h1 className="text-2xl font-bold text-slate-900">
          {onSearch ? "مولّد العملاء المحليين" : "الـ CRM"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {onSearch
            ? "ابحث عن أنشطة بدون موقع إلكتروني، ثم احفظهم في الـ CRM."
            : "العملاء المحفوظون، المتابعة على واتساب، وحالة كل صفقة."}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <nav className="flex rounded-xl bg-slate-200/70 p-1">
          {NAV.map((item) => {
            const active = item.href === "/" ? onCrm : onSearch;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${
                  active ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="min-w-52 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
            <span>استهلاك Places هذا الشهر</span>
            <span>
              {usage.count} / {usage.limit}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full ${usagePct > 80 ? "bg-amber-500" : "bg-teal-600"}`}
              style={{ width: `${usagePct}%` }}
            />
          </div>
        </div>
        {extra}
      </div>
    </header>
  );
}
