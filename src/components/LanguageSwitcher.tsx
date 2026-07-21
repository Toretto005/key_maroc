"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();

  const toggleLanguage = () => {
    setLang(lang === "en" ? "ar" : "en");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full font-medium text-sm"
      aria-label={t("common.toggle_language")}
    >
      <Globe className="w-4 h-4" />
      <span className="hidden sm:inline">{lang === "en" ? "العربية" : "English"}</span>
      <span className="sm:hidden">{lang === "en" ? "AR" : "EN"}</span>
    </button>
  );
}
