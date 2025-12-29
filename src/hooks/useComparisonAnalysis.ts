import { useState } from "react";
import { analyzeLoanDocument, LoanAnalysisResult } from "@/lib/loanAnalysisApi";
import { toast } from "sonner";

export interface ComparisonLoan {
  id: string;
  fileName: string;
  lender: string;
  loanAmount: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  totalRepayment: number;
  totalInterest: number;
  fairnessScore: number;
  loanType: string;
  summary: string;
  predatoryTermsCount: number;
  analysisResult: LoanAnalysisResult;
}

interface UploadedFile {
  id: string;
  file: File;
  name: string;
}

export function useComparisonAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [loans, setLoans] = useState<ComparisonLoan[]>([]);
  const [error, setError] = useState<string | null>(null);

  const analyzeDocuments = async (files: UploadedFile[]) => {
    setIsLoading(true);
    setError(null);
    setProgress({ current: 0, total: files.length });

    const analyzedLoans: ComparisonLoan[] = [];

    for (let i = 0; i < files.length; i++) {
      const uploadedFile = files[i];
      setProgress({ current: i + 1, total: files.length });

      try {
        const result = await analyzeLoanDocument(uploadedFile.file);
        
        analyzedLoans.push({
          id: uploadedFile.id,
          fileName: uploadedFile.name,
          lender: result.loanSummary.lender,
          loanAmount: result.loanSummary.loanAmount,
          interestRate: result.loanSummary.interestRate,
          termMonths: result.loanSummary.termMonths,
          monthlyPayment: result.repaymentBreakdown.monthlyPayment,
          totalRepayment: result.repaymentBreakdown.totalRepayment,
          totalInterest: result.repaymentBreakdown.totalInterest,
          fairnessScore: result.fairnessScore.score,
          loanType: result.loanSummary.loanType,
          summary: result.loanSummary.summary,
          predatoryTermsCount: result.predatoryTerms.length,
          analysisResult: result,
        });
      } catch (err) {
        console.error(`Error analyzing ${uploadedFile.name}:`, err);
        toast.error(`Failed to analyze ${uploadedFile.name}`);
      }
    }

    if (analyzedLoans.length < 2) {
      setError("Need at least 2 successfully analyzed documents to compare");
      toast.error("Need at least 2 documents analyzed successfully");
      setIsLoading(false);
      return null;
    }

    setLoans(analyzedLoans);
    setIsLoading(false);
    toast.success(`Successfully analyzed ${analyzedLoans.length} documents!`);
    return analyzedLoans;
  };

  const reset = () => {
    setLoans([]);
    setError(null);
    setProgress({ current: 0, total: 0 });
  };

  return {
    isLoading,
    progress,
    loans,
    error,
    analyzeDocuments,
    reset,
  };
}
