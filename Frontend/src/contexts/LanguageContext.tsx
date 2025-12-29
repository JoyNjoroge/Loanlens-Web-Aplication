// contexts/LanguageContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'sw' | 'fr' | 'es' | 'it';

interface LanguageContextType {
  selectedLanguage: Language;
  setSelectedLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');

  return (
    <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const languageNames: Record<string, string> = {
  en: "English",
  sw: "Swahili", 
  fr: "French",
  es: "Spanish",
  it: "Italian",
};