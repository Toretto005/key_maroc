"use client";

import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-full bg-slate-50 py-20 px-4">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{t("public.about_title")}</h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          {t("public.about_desc")}
        </p>
      </div>
    </div>
  );
}
