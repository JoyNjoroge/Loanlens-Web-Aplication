import { supabase } from "@/integrations/supabase/client";

export interface LoanSummary {
  loanAmount: number;
  interestRate: number;
  termMonths: number;
  lender: string;
  loanType: string;
  summary: string;
}

export interface FairnessScore {
  score: number;
  breakdown: Array<{
    label: string;
    score: number;
  }>;
}

export interface RepaymentBreakdown {
  monthlyPayment: number;
  totalRepayment: number;
  totalInterest: number;
  numberOfInstallments: number;
  effectiveAPR: number;
}

export interface PredatoryTerm {
  id: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
}

export interface LoanAnalysisResult {
  loanSummary: LoanSummary;
  fairnessScore: FairnessScore;
  repaymentBreakdown: RepaymentBreakdown;
  predatoryTerms: PredatoryTerm[];
  extractedText?: string | null;
}

export async function analyzeLoanDocument(file: File): Promise<LoanAnalysisResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentType', file.type);

  try {
    const response = await fetch('http://localhost:3001/analyze-loan', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze document');
    }

    const data = await response.json();
    return data as LoanAnalysisResult;
  } catch (error) {
    console.error('Error calling analyze-loan backend:', error);
    throw error;
  }
}