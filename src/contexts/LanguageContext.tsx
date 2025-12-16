import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'sw' | 'fr' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string; // Translation function
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// You can add more translations here
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common phrases used across the app
    'upload.document': 'Upload Document',
    'analyze': 'Analyze',
    'results': 'Results',
    // ... add more as needed
  },
  sw: {
    'upload.document': 'Pakia Hati',
    'analyze': 'Chambua',
    'results': 'Matokeo',
  },
  fr: {
    'upload.document': 'Télécharger le Document',
    'analyze': 'Analyser',
    'results': 'Résultats',
  },
  es: {
    'upload.document': 'Subir Documento',
    'analyze': 'Analizar',
    'results': 'Resultados',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};