import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeLoanDocument, LoanAnalysisResult } from "@/lib/loanAnalysisApi";
import { toast } from "sonner";

export function useLoanAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<LoanAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const analyzeDocument = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeLoanDocument(file);
      setAnalysisResult(result);
      
      // Store result in sessionStorage for the results page
      sessionStorage.setItem('loanAnalysisResult', JSON.stringify(result));
      
      toast.success("Document analyzed successfully!");
      navigate("/results");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze document";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    analysisResult,
    error,
    analyzeDocument,
  };
}
