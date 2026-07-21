"use client";

import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function ContactPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-full bg-slate-50 py-20 px-4">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{t("public.contact_title")}</h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-8">
          {t("public.contact_desc")}
        </p>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-slate-700 font-medium text-lg">{t("public.email_us")}</p>
          <a href="mailto:support@sarouti.ma" className="text-blue-600 font-bold text-2xl hover:underline">
            support@sarouti.ma
          </a>
        </div>
      </div>
    </div>
  );
}
