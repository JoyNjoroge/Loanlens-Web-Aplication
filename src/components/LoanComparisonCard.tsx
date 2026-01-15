import { Check, X, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import CircularProgress from "./CircularProgress";

interface LoanData {
  id: string;
  fileName: string;
  lender: string;
  loanAmount: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  totalRepayment: number;
  totalInterest: number;
  effectiveAPR: number;
  fairnessScore: number;
  fairnessRating: string;
  predatoryTermsCount: number;
  fees: {
    origination: number;
    lateFee: number;
    prepaymentPenalty: boolean;
  };
}

interface LoanComparisonCardProps {
  loan: LoanData;
  isBest?: boolean;
  comparisonData?: {
    lowestRate: number;
    lowestPayment: number;
    highestFairness: number;
  };
}

export default function LoanComparisonCard({
  loan,
  isBest = false,
  comparisonData,
}: LoanComparisonCardProps) {
  const getFairnessVariant = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "destructive";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const isLowest = (value: number, comparison: number | undefined) =>
    comparison !== undefined && value === comparison;

  const isHighest = (value: number, comparison: number | undefined) =>
    comparison !== undefined && value === comparison;

  return (
    <div
      className={cn(
        "relative rounded-xl border bg-card p-6 transition-all",
        isBest
          ? "border-success shadow-lg ring-2 ring-success/20"
          : "border-border hover:shadow-md"
      )}
    >
      {isBest && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-success text-success-foreground text-xs font-medium">
          Best Option
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="font-display font-bold text-lg">{loan.lender}</h3>
        <p className="text-sm text-muted-foreground truncate">{loan.fileName}</p>
      </div>

      {/* Fairness Score */}
      <div className="flex justify-center mb-6">
        <CircularProgress
          value={loan.fairnessScore}
          variant={getFairnessVariant(loan.fairnessScore)}
          label="Fairness"
        />
      </div>

      <div
        className={cn(
          "text-center text-sm font-medium mb-6 py-2 rounded-lg",
          loan.fairnessRating === "Fair" && "bg-success/10 text-success",
          loan.fairnessRating === "Borderline" && "bg-warning/10 text-warning",
          loan.fairnessRating === "Predatory" && "bg-destructive/10 text-destructive"
        )}
      >
        {loan.fairnessRating}
      </div>

      {/* Key Metrics */}
      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">Loan Amount</span>
          <span className="font-semibold">{formatCurrency(loan.loanAmount)}</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">Interest Rate</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{loan.interestRate}%</span>
            {isLowest(loan.interestRate, comparisonData?.lowestRate) && (
              <TrendingDown className="h-4 w-4 text-success" />
            )}
          </div>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">Term</span>
          <span className="font-semibold">{loan.termMonths} months</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">Monthly Payment</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{formatCurrency(loan.monthlyPayment)}</span>
            {isLowest(loan.monthlyPayment, comparisonData?.lowestPayment) && (
              <TrendingDown className="h-4 w-4 text-success" />
            )}
          </div>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">Total Interest</span>
          <span className="font-semibold">{formatCurrency(loan.totalInterest)}</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">Effective APR</span>
          <span className="font-semibold">{loan.effectiveAPR}%</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">Total Repayment</span>
          <span className="font-bold text-primary">{formatCurrency(loan.totalRepayment)}</span>
        </div>
      </div>

      {/* Fees Section */}
      <div className="mt-6 p-4 rounded-lg bg-muted/50">
        <h4 className="text-sm font-medium mb-3">Fees & Penalties</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Origination Fee</span>
            <span>{loan.fees.origination > 0 ? formatCurrency(loan.fees.origination) : "None"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Late Fee</span>
            <span>{formatCurrency(loan.fees.lateFee)}</span>
          </div>
          <div className="flex justify-between text-sm items-center">
            <span className="text-muted-foreground">Prepayment Penalty</span>
            {loan.fees.prepaymentPenalty ? (
              <span className="flex items-center gap-1 text-destructive">
                <X className="h-4 w-4" /> Yes
              </span>
            ) : (
              <span className="flex items-center gap-1 text-success">
                <Check className="h-4 w-4" /> No
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Warning Flags */}
      {loan.predatoryTermsCount > 0 && (
        <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm font-medium">
            {loan.predatoryTermsCount} predatory term{loan.predatoryTermsCount !== 1 ? "s" : ""} detected
          </span>
        </div>
      )}
    </div>
  );
}
