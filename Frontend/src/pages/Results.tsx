import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ResultCard from "@/components/ResultCard";
import CircularProgress from "@/components/CircularProgress";
import {
  FileText,
  Shield,
  Calculator,
  AlertTriangle,
  DollarSign,
  Calendar,
  Percent,
  TrendingUp,
  ArrowLeft,
  Download,
} from "lucide-react";
import {
  mockLoanSummary,
  mockFairnessScore,
  mockRepaymentBreakdown,
  mockPredatoryTerms,
} from "@/data/mockData";
import { LoanAnalysisResult } from "@/lib/loanAnalysisApi";
import { cn } from "@/lib/utils";

const Results = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<LoanAnalysisResult | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Try to get real analysis results from sessionStorage
    const storedResult = sessionStorage.getItem('loanAnalysisResult');
    if (storedResult) {
      try {
        setAnalysisResult(JSON.parse(storedResult));
      } catch (e) {
        console.error('Failed to parse stored analysis result:', e);
      }
    }
    setIsVisible(true);
  }, []);

  // Use real data if available, otherwise fall back to mock data
  const loanSummary = analysisResult?.loanSummary || mockLoanSummary;
  const fairnessScore = analysisResult?.fairnessScore || mockFairnessScore;
  const repaymentBreakdown = analysisResult?.repaymentBreakdown || mockRepaymentBreakdown;
  const predatoryTerms = analysisResult?.predatoryTerms || mockPredatoryTerms;

  const getFairnessVariant = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "destructive";
  };

  const getFairnessLabel = (score: number) => {
    if (score >= 80) return "Fair";
    if (score >= 60) return "Borderline";
    return "Predatory";
  };

  const repaymentStats = [
    {
      icon: DollarSign,
      label: "Monthly Payment",
      value: `$${repaymentBreakdown.monthlyPayment.toLocaleString()}`,
    },
    {
      icon: Calendar,
      label: "Total Installments",
      value: repaymentBreakdown.numberOfInstallments,
    },
    {
      icon: TrendingUp,
      label: "Total Repayment",
      value: `$${repaymentBreakdown.totalRepayment.toLocaleString()}`,
    },
    {
      icon: Percent,
      label: "Total Interest",
      value: `$${repaymentBreakdown.totalInterest.toLocaleString()}`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div
          className={cn(
            "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <div>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Upload
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Loan Analysis Results</h1>
            <p className="text-muted-foreground mt-1">
              Analysis of your loan document from {loanSummary.lender}
            </p>
            {analysisResult && (
              <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                <Shield className="w-3 h-3" />
                AI-Powered Analysis
              </span>
            )}
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plain-English Summary */}
            <ResultCard
              title="Plain-English Summary"
              icon={FileText}
              className={cn(
                "transition-all duration-500 delay-100",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Loan Amount</p>
                  <p className="font-semibold text-foreground">
                    ${loanSummary.loanAmount.toLocaleString()}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Interest Rate</p>
                  <p className="font-semibold text-foreground">{loanSummary.interestRate}%</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Term Length</p>
                  <p className="font-semibold text-foreground">{loanSummary.termMonths} months</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Loan Type</p>
                  <p className="font-semibold text-foreground">{loanSummary.loanType}</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">{loanSummary.summary}</p>
            </ResultCard>

            {/* Repayment Breakdown */}
            <ResultCard
              title="Repayment Breakdown"
              icon={Calculator}
              className={cn(
                "transition-all duration-500 delay-200",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {repaymentStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-muted/50 rounded-xl p-4 text-center hover:bg-muted transition-colors"
                  >
                    <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Effective APR: </span>
                  {repaymentBreakdown.effectiveAPR}% — This accounts for compound interest and fees.
                </p>
              </div>
            </ResultCard>

            {/* Predatory Terms */}
            <ResultCard
              title="Detected Predatory Terms"
              icon={AlertTriangle}
              variant={predatoryTerms.length > 0 ? "destructive" : "success"}
              className={cn(
                "transition-all duration-500 delay-300",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              {predatoryTerms.length > 0 ? (
                <div className="space-y-3">
                  {predatoryTerms.map((term) => (
                    <div
                      key={term.id}
                      className={cn(
                        "p-4 rounded-xl border",
                        term.severity === "high"
                          ? "bg-destructive/10 border-destructive/30"
                          : term.severity === "medium"
                          ? "bg-warning/10 border-warning/30"
                          : "bg-muted/50 border-border"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle
                          className={cn(
                            "w-5 h-5 flex-shrink-0 mt-0.5",
                            term.severity === "high" 
                              ? "text-destructive" 
                              : term.severity === "medium"
                              ? "text-warning"
                              : "text-muted-foreground"
                          )}
                        />
                        <div>
                          <h4 className="font-semibold text-foreground">{term.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{term.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Shield className="w-12 h-12 text-success mx-auto mb-3" />
                  <p className="font-medium text-foreground">No Predatory Terms Detected</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This loan appears to have fair and transparent terms.
                  </p>
                </div>
              )}
            </ResultCard>
          </div>

          {/* Right Column - Fairness Score */}
          <div className="space-y-6">
            <ResultCard
              title="Fairness Score"
              icon={Shield}
              variant={getFairnessVariant(fairnessScore.score)}
              className={cn(
                "transition-all duration-500 delay-150",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <div className="flex flex-col items-center py-4">
                <CircularProgress
                  value={fairnessScore.score}
                  size={140}
                  strokeWidth={12}
                  variant={getFairnessVariant(fairnessScore.score)}
                  label="out of 100"
                />
                <div
                  className={cn(
                    "mt-4 px-4 py-2 rounded-full text-sm font-medium",
                    getFairnessVariant(fairnessScore.score) === "success" &&
                      "bg-success/10 text-success",
                    getFairnessVariant(fairnessScore.score) === "warning" &&
                      "bg-warning/10 text-warning",
                    getFairnessVariant(fairnessScore.score) === "destructive" &&
                      "bg-destructive/10 text-destructive"
                  )}
                >
                  {getFairnessLabel(fairnessScore.score)}
                </div>
              </div>

              {/* Breakdown */}
              <div className="mt-6 space-y-3">
                {fairnessScore.breakdown.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium text-foreground">{item.score}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          item.score >= 75
                            ? "bg-success"
                            : item.score >= 60
                            ? "bg-warning"
                            : "bg-destructive"
                        )}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ResultCard>

            {/* Quick Actions */}
            <div
              className={cn(
                "bg-card rounded-2xl border border-border p-6 transition-all duration-500 delay-400",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <h3 className="font-semibold text-foreground mb-4">Next Steps</h3>
              <div className="space-y-3">
                <Button variant="hero" className="w-full" asChild>
                  <Link to="/risk-assessment">Assess Your Risk</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/upload">Analyze Another Document</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
