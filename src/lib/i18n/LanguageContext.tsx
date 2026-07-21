"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale, dictionaries, Dictionary } from "./dictionaries";

interface LanguageContextProps {
  lang: Locale;
  setLang: (lang: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ 
  children, 
  initialLang = "en" 
}: { 
  children: React.ReactNode; 
  initialLang?: Locale;
}) {
  const [lang, setLangState] = useState<Locale>(initialLang);

  const setLang = (newLang: Locale) => {
    setLangState(newLang);
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`; // 1 year
    window.location.reload(); // Hard reload to easily apply layout changes
  };

  const t = (key: string): string => {
    const dict = dictionaries[lang];
    return dict[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
