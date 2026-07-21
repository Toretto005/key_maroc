"use client";

import dynamic from 'next/dynamic';
import { useLanguage } from '@/lib/i18n/LanguageContext';

function LoadingMap() {
  const { t } = useLanguage();
  return (
    <div className="h-[420px] rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 text-sm border-2 border-slate-200">
      {t("common.loading_map")}
    </div>
  );
}

const LocationPicker = dynamic(() => import('./LocationPicker'), {
  ssr: false,
  loading: () => <LoadingMap />,
});

type Props = {
  onLocationSelected: (lat: number, lng: number) => void;
};

export default function LocationPickerWrapper({ onLocationSelected }: Props) {
  return <LocationPicker onLocationSelected={onLocationSelected} />;
}
