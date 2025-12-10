export const mockLoanSummary = {
  loanAmount: 25000,
  interestRate: 12.5,
  termMonths: 36,
  loanType: "Personal Loan",
  lender: "QuickCash Financial",
  startDate: "2024-01-15",
  summary:
    "This is a 36-month personal loan for $25,000 at 12.5% annual interest. Monthly payments of $837.45 are required. The loan includes standard terms with some notable clauses regarding late payments and early repayment penalties.",
};

export const mockFairnessScore = {
  score: 72,
  rating: "Borderline",
  breakdown: [
    { label: "Interest Rate Fairness", score: 68 },
    { label: "Fee Transparency", score: 75 },
    { label: "Terms Clarity", score: 80 },
    { label: "Repayment Flexibility", score: 65 },
  ],
};

export const mockRepaymentBreakdown = {
  monthlyPayment: 837.45,
  totalRepayment: 30148.2,
  totalInterest: 5148.2,
  numberOfInstallments: 36,
  effectiveAPR: 13.2,
};

export const mockPredatoryTerms = [
  {
    id: 1,
    title: "Hidden Penalty Fee",
    description:
      "A 5% penalty fee is applied for payments made after 5 PM on the due date, even if technically not late.",
    severity: "high",
  },
  {
    id: 2,
    title: "Unusual Compounding Frequency",
    description:
      "Interest compounds daily rather than monthly, increasing effective interest by approximately 0.7%.",
    severity: "medium",
  },
  {
    id: 3,
    title: "Early Repayment Penalty",
    description:
      "Paying off the loan early incurs a penalty of 2 months' interest, reducing benefit of early repayment.",
    severity: "medium",
  },
];

export const mockRiskAssessmentResult = {
  lowRisk: {
    score: "Low",
    percentage: 25,
    color: "success",
    explanation:
      "Based on your financial profile, you have a strong capacity to repay this loan. Your income-to-debt ratio is healthy, and you have a comfortable buffer for unexpected expenses.",
    recommendations: [
      "Consider negotiating for a lower interest rate",
      "Set up automatic payments to avoid late fees",
      "Build an emergency fund of 3-6 months expenses",
    ],
  },
  mediumRisk: {
    score: "Medium",
    percentage: 55,
    color: "warning",
    explanation:
      "Your financial situation can support this loan, but with limited flexibility. Unexpected expenses could strain your budget. Consider reducing the loan amount or extending the term.",
    recommendations: [
      "Create a detailed monthly budget",
      "Look for ways to increase income or reduce expenses",
      "Consider a smaller loan amount",
      "Build an emergency fund before taking the loan",
    ],
  },
  highRisk: {
    score: "High",
    percentage: 85,
    color: "destructive",
    explanation:
      "Taking this loan could put significant financial strain on your budget. Your debt-to-income ratio would be concerning, leaving little room for emergencies or unexpected expenses.",
    recommendations: [
      "Strongly consider alternatives to this loan",
      "Work on improving your financial situation first",
      "If loan is necessary, seek a significantly smaller amount",
      "Consider credit counseling services",
    ],
  },
};
