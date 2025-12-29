// components/LoanAnalysisForm.tsx
import { useState } from "react";
import FileUpload from "./FileUpload";
import LanguageSelector from "./LanguageSelector";
import FinancialInputs from "./FinancialInputs";
import ResultsDisplay from "./ResultsDisplay";
import { analyzeLoanDocument } from "@/utils/api";

const LoanAnalysisForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [userPreferences, setUserPreferences] = useState({
    preferredLanguage: "en",
    salary: 50000,
    existingDebt: 0,
    monthlyExpenses: 2000,
    loanAmount: 0,
    simplify: true,
  });

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsLoading(true);
    setResults(null);

    try {
      const analysis = await analyzeLoanDocument({
        file: selectedFile,
        ...userPreferences,
      });
      setResults(analysis);
    } catch (error) {
      // Handle error (show toast notification)
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (lang: string) => {
    setUserPreferences(prev => ({ ...prev, preferredLanguage: lang }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">LoanLens</h1>
        <p className="text-muted-foreground">
          Upload any loan document in any language. Get instant analysis.
        </p>
      </div>

      {/* Step 1: Language Selection */}
      <LanguageSelector 
        value={userPreferences.preferredLanguage}
        onChange={handleLanguageChange}
      />

      {/* Step 2: File Upload */}
      <FileUpload 
        onFileSelect={handleFileSelect}
        isLoading={isLoading}
      />

      {/* Step 3: Financial Inputs (Optional) */}
      <FinancialInputs 
        values={userPreferences}
        onChange={setUserPreferences}
        disabled={isLoading}
      />

      {/* Step 4: Results Display */}
      {results && <ResultsDisplay data={results} />}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-4 rounded-lg bg-muted">
          <div className="text-2xl font-bold">5+</div>
          <div className="text-sm">Languages</div>
        </div>
        <div className="p-4 rounded-lg bg-muted">
          <div className="text-2xl font-bold">Instant</div>
          <div className="text-sm">Analysis</div>
        </div>
        <div className="p-4 rounded-lg bg-muted">
          <div className="text-2xl font-bold">No Data</div>
          <div className="text-sm">Stored</div>
        </div>
        <div className="p-4 rounded-lg bg-muted">
          <div className="text-2xl font-bold">Free</div>
          <div className="text-sm">Forever</div>
        </div>
      </div>
    </div>
  );
};