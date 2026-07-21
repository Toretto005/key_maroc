"use client";

import { useId, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface FileInputProps {
  accept?: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function FileInput({ accept, disabled, onChange, className }: FileInputProps) {
  const { t } = useLanguage();
  const id = useId();
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className={`flex items-center gap-4 ${className || ""}`}>
      <label
        htmlFor={id}
        className={`shrink-0 py-2 px-4 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {t("file.choose")}
      </label>
      <span className="text-sm text-slate-500 truncate">
        {fileName || t("file.no_file_chosen")}
      </span>
      <input
        id={id}
        type="file"
        accept={accept}
        disabled={disabled}
        className="hidden"
        onChange={(e) => {
          setFileName(e.target.files?.[0]?.name || null);
          onChange(e);
        }}
      />
    </div>
  );
}
