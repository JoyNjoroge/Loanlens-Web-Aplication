import { useState } from "react";
import { Scale, FileCheck, Sparkles, Download, Shield } from "lucide-react";
import ComparisonUpload from "@/components/ComparisonUpload";
import LoanComparisonCard from "@/components/LoanComparisonCard";
import { Button } from "@/components/ui/button";
import { generateComparisonPDF } from "@/lib/generateComparisonPDF";
import { toast } from "sonner";
import { useComparisonAnalysis, ComparisonLoan } from "@/hooks/useComparisonAnalysis";

interface UploadedFile {
  id: string;
  file: File;
  name: string;
}

export default function Compare() {
  const { isLoading, progress, loans, analyzeDocuments, reset } = useComparisonAnalysis();
  const [showResults, setShowResults] = useState(false);

  const handleFilesReady = async (files: UploadedFile[]) => {
    const result = await analyzeDocuments(files);
    if (result && result.length >= 2) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setShowResults(false);
    reset();
  };

  // Helper to get fairness rating from score
  const getFairnessRating = (score: number) => {
    if (score >= 80) return "Fair";
    if (score >= 60) return "Borderline";
    return "Predatory";
  };

  // Convert ComparisonLoan to the format expected by existing components
  const formattedLoans = loans.map(loan => ({
    id: loan.id,
    fileName: loan.fileName,
    lender: loan.lender,
    loanAmount: loan.loanAmount,
    interestRate: loan.interestRate,
    termMonths: loan.termMonths,
    monthlyPayment: loan.monthlyPayment,
    totalRepayment: loan.totalRepayment,
    totalInterest: loan.totalInterest,
    effectiveAPR: loan.analysisResult.repaymentBreakdown.effectiveAPR,
    fairnessScore: loan.fairnessScore,
    fairnessRating: getFairnessRating(loan.fairnessScore),
    predatoryTermsCount: loan.predatoryTermsCount,
    fees: {
      origination: 0,
      lateFee: 0,
      prepaymentPenalty: false,
    },
  }));

  // Calculate comparison metrics
  const comparisonData = loans.length > 0 ? {
    lowestRate: Math.min(...loans.map((l) => l.interestRate)),
    lowestPayment: Math.min(...loans.map((l) => l.monthlyPayment)),
    highestFairness: Math.max(...loans.map((l) => l.fairnessScore)),
  } : { lowestRate: 0, lowestPayment: 0, highestFairness: 0 };

  // Find best loan (highest fairness + lowest total cost weighted)
  const bestLoan = loans.length > 0 ? loans.reduce((best, current) =>
    current.fairnessScore > best.fairnessScore ||
    (current.fairnessScore === best.fairnessScore &&
      current.totalRepayment < best.totalRepayment)
      ? current
      : best
  ) : null;

  const bestLoanId = bestLoan?.id || "";

  // Calculate savings
  const worstLoan = loans.length > 0 ? loans.reduce((worst, current) =>
    current.totalRepayment > worst.totalRepayment ? current : worst
  ) : null;

  const potentialSavings = worstLoan && bestLoan 
    ? worstLoan.totalRepayment - bestLoan.totalRepayment 
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <Scale className="absolute inset-0 m-auto h-8 w-8 text-primary" />
        </div>
        <p className="mt-6 text-lg font-medium text-foreground">
          Analyzing loan documents...
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Document {progress.current} of {progress.total}
        </p>
        <div className="mt-4 w-48 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(progress.current / progress.total) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  if (showResults && loans.length >= 2) {
    return (
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Loan Comparison Results
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We analyzed {loans.length} loan offers using AI. Here's how they compare.
          </p>
          <span className="inline-flex items-center gap-1 mt-4 px-3 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium">
            <Shield className="w-4 h-4" />
            AI-Powered Analysis
          </span>
        </div>

        {/* Savings Banner */}
        {potentialSavings > 0 && (
          <div className="mb-10 p-6 rounded-xl gradient-primary text-primary-foreground animate-fade-up">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-white/20">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium opacity-90">Potential Savings</p>
                  <p className="text-2xl font-bold">
                    ${potentialSavings.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <p className="text-sm opacity-80 text-center md:text-right max-w-xs">
                By choosing the best option over the worst, you could save this amount over the loan term.
              </p>
            </div>
          </div>
        )}

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {formattedLoans.map((loan, index) => (
            <div
              key={loan.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <LoanComparisonCard
                loan={loan}
                isBest={loan.id === bestLoanId}
                comparisonData={comparisonData}
              />
            </div>
          ))}
        </div>

        {/* Summary Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-up">
          <div className="p-6 border-b border-border bg-muted/30">
            <h2 className="font-display font-bold text-xl">Quick Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Lender
                  </th>
                  <th className="text-right p-4 font-medium text-muted-foreground">
                    Rate
                  </th>
                  <th className="text-right p-4 font-medium text-muted-foreground">
                    Monthly
                  </th>
                  <th className="text-right p-4 font-medium text-muted-foreground">
                    Total Cost
                  </th>
                  <th className="text-right p-4 font-medium text-muted-foreground">
                    Fairness
                  </th>
                  <th className="text-right p-4 font-medium text-muted-foreground">
                    Warnings
                  </th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr
                    key={loan.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4 font-medium">
                      <div>
                        {loan.lender}
                        {loan.id === bestLoanId && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">
                            Best
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {loan.fileName}
                      </div>
                    </td>
                    <td className="p-4 text-right">{loan.interestRate}%</td>
                    <td className="p-4 text-right">
                      ${loan.monthlyPayment.toFixed(2)}
                    </td>
                    <td className="p-4 text-right font-semibold">
                      ${loan.totalRepayment.toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          loan.fairnessScore >= 80
                            ? "bg-success/10 text-success"
                            : loan.fairnessScore >= 60
                            ? "bg-warning/10 text-warning"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {loan.fairnessScore}/100
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {loan.predatoryTermsCount > 0 ? (
                        <span className="text-destructive font-medium">
                          {loan.predatoryTermsCount}
                        </span>
                      ) : (
                        <span className="text-success">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="outline" onClick={handleReset}>
            Compare Different Loans
          </Button>
          <Button
            onClick={() => {
              generateComparisonPDF({
                loans: formattedLoans,
                bestLoanId,
                potentialSavings,
              });
              toast.success("PDF report downloaded successfully!");
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF Report
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
          <Scale className="h-4 w-4" />
          <span className="text-sm font-medium">Compare & Save</span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
          Compare Multiple
          <span className="gradient-text"> Loan Offers</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload up to 5 loan documents and see them side-by-side. Our AI analyzes rates,
          terms, fees, and fairness scores to find the best deal.
        </p>
      </div>

      {/* Upload Section */}
      <div className="max-w-xl mx-auto mb-16 animate-fade-up">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <ComparisonUpload onFilesReady={handleFilesReady} maxFiles={5} />
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          {
            icon: Scale,
            title: "Side-by-Side Comparison",
            description:
              "View all loan terms, rates, and fees in an easy-to-compare format.",
          },
          {
            icon: FileCheck,
            title: "AI Fairness Analysis",
            description:
              "Each loan is scored by AI for fairness, helping you avoid predatory offers.",
          },
          {
            icon: Sparkles,
            title: "Smart Recommendations",
            description:
              "We highlight the best option based on total cost and fairness.",
          },
        ].map((feature, index) => (
          <div
            key={feature.title}
            className="text-center p-6 rounded-xl border border-border bg-card/50 animate-fade-up card-hover"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
              <feature.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
