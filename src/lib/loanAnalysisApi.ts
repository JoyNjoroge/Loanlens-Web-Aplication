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

// Convert file to base64
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Check if PDF contains extractable text
async function extractTextFromPDF(file: File): Promise<string | null> {
  try {
    const text = await file.text();
    // Check if the text looks like valid content (not just binary garbage)
    // Valid PDFs with text usually have readable ASCII content
    const printableRatio = (text.match(/[\x20-\x7E]/g) || []).length / text.length;
    
    // If less than 50% printable characters, it's likely an image-based PDF
    if (printableRatio < 0.5) {
      return null;
    }
    
    // Try to extract text between stream markers (simplified PDF text extraction)
    const textMatches = text.match(/\(([^)]+)\)/g);
    if (textMatches && textMatches.length > 10) {
      const extractedText = textMatches
        .map(m => m.slice(1, -1))
        .filter(t => t.length > 2 && /[a-zA-Z]/.test(t))
        .join(' ');
      
      if (extractedText.length > 100) {
        return extractedText;
      }
    }
    
    return null;
  } catch {
    return null;
  }
}

export async function analyzeLoanDocument(file: File): Promise<LoanAnalysisResult> {
  const documentType = file.type;
  const fileName = file.name;
  
  let documentText: string | null = null;
  let imageBase64: string | null = null;
  
  if (file.type === "application/pdf") {
    // Try to extract text from PDF first
    documentText = await extractTextFromPDF(file);
    
    if (!documentText) {
      // PDF is image-based, convert to base64 for OCR
      console.log('PDF appears to be image-based, using OCR');
      imageBase64 = await fileToBase64(file);
    }
  } else if (file.type.startsWith("image/")) {
    // Images always need OCR
    console.log('Image file detected, using OCR');
    imageBase64 = await fileToBase64(file);
  } else {
    // Plain text or other formats
    documentText = await file.text();
  }

  const { data, error } = await supabase.functions.invoke('analyze-loan', {
    body: { 
      documentText, 
      documentType,
      imageBase64,
      fileName
    }
  });

  if (error) {
    console.error('Error calling analyze-loan function:', error);
    throw new Error(error.message || 'Failed to analyze loan document');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as LoanAnalysisResult;
}
