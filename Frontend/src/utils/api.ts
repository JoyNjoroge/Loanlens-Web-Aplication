// utils/api.ts
export interface AnalysisParams {
  file: File;
  preferredLanguage?: string;
  salary?: number;
  existingDebt?: number;
  monthlyExpenses?: number;
  loanAmount?: number;
  simplify?: boolean;
}

export interface AnalysisResult {
  success: boolean;
  analysis: {
    extracted_terms: {
      interest_rate?: number;
      loan_amount?: number;
      penalty_fees: string[];
      hidden_clauses: string[];
    };
    financial_health: {
      debt_to_income_ratio: number;
      disposable_income: number;
      can_afford_payment: boolean;
      risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    };
    approval_status: 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW';
    confidence_score: number;
    red_flags: string[];
    recommendations: string[];
    summary: string;
    document_language?: {
      detected: string;
      confidence: number;
      name: string;
    };
  };
  processing_time_ms: number;
  document_name: string;
  language: string;
}

export async function analyzeLoanDocument(params: AnalysisParams): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('file', params.file);
  
  if (params.preferredLanguage) {
    formData.append('preferred_language', params.preferredLanguage);
  }
  if (params.salary !== undefined) {
    formData.append('salary', params.salary.toString());
  }
  if (params.existingDebt !== undefined) {
    formData.append('existing_debt', params.existingDebt.toString());
  }
  if (params.monthlyExpenses !== undefined) {
    formData.append('monthly_expenses', params.monthlyExpenses.toString());
  }
  if (params.loanAmount !== undefined) {
    formData.append('loan_amount', params.loanAmount.toString());
  }
  if (params.simplify !== undefined) {
    formData.append('simplify', params.simplify.toString());
  }

  try {
    const response = await fetch('http://localhost:8000/analyze', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Analysis failed:', error);
    throw error;
  }
}