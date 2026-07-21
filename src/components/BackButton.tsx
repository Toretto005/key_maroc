"use client";

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function BackButton({ fallback = '/search' }: { fallback?: string }) {
  const router = useRouter();
  const { t } = useLanguage();

  const handleBack = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <button 
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors py-2"
    >
      <ArrowLeft className="w-4 h-4" />
      {t("common.back")}
    </button>
  );
}
