// components/LanguageSelector.tsx
import { Globe } from "lucide-react";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "sw", name: "Swahili", flag: "🇹🇿" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
];

interface LanguageSelectorProps {
  value: string;
  onChange: (lang: string) => void;
}

const LanguageSelector = ({ value, onChange }: LanguageSelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Globe className="w-4 h-4" />
        <span>Choose explanation language</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onChange(lang.code)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg border transition-all
              ${value === lang.code 
                ? "border-primary bg-primary/10 text-primary" 
                : "border-border hover:border-primary/50 hover:bg-muted/50"
              }
            `}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};