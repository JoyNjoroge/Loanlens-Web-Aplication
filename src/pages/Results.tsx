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
  Loader,
} from "lucide-react";
import {
  mockLoanSummary,
  mockFairnessScore,
  mockRepaymentBreakdown,
  mockPredatoryTerms,
} from "@/data/mockData";
import { LoanAnalysisResult } from "@/lib/loanAnalysisApi";
import { cn } from "@/lib/utils";
import { generateResultsPDF } from "@/lib/generateResultsPDF";
import { toast } from "sonner";

const Results = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<LoanAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Try to get real analysis results from sessionStorage
    const storedResult = sessionStorage.getItem('loanAnalysisResult');
    console.log('Stored result:', storedResult);
    
    if (storedResult) {
      try {
        const parsed = JSON.parse(storedResult);
        console.log('Parsed result:', parsed);
        setAnalysisResult(parsed);
      } catch (e) {
        console.error('Failed to parse stored analysis result:', e);
      }
    } else {
      console.warn('No stored analysis result found in sessionStorage');
    }
    
    setIsLoading(false);
    setIsVisible(true);
  }, []);

  // Safe data extraction with fallbacks
  const loanSummary = analysisResult?.loanSummary || mockLoanSummary || {
    loanAmount: 0,
    interestRate: 0,
    termMonths: 0,
    lender: "Unknown Lender",
    loanType: "Unknown",
    summary: "No summary available",
  };

  const fairnessScore = analysisResult?.fairnessScore || mockFairnessScore || {
    score: 0,
    breakdown: [],
  };

  const repaymentBreakdown = analysisResult?.repaymentBreakdown || mockRepaymentBreakdown || {
    monthlyPayment: 0,
    totalRepayment: 0,
    totalInterest: 0,
    numberOfInstallments: 0,
    effectiveAPR: 0,
  };

  const predatoryTerms = analysisResult?.predatoryTerms || mockPredatoryTerms || [];

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
      value: `$${(repaymentBreakdown.monthlyPayment || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
    },
    {
      icon: Calendar,
      label: "Total Installments",
      value: repaymentBreakdown.numberOfInstallments || 0,
    },
    {
      icon: TrendingUp,
      label: "Total Repayment",
      value: `$${(repaymentBreakdown.totalRepayment || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
    },
    {
      icon: Percent,
      label: "Total Interest",
      value: `$${(repaymentBreakdown.totalInterest || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
    },
  ];

  const handleExport = () => {
    generateResultsPDF({
      loanSummary,
      fairnessScore,
      repaymentBreakdown,
      predatoryTerms,
    });
    toast.success("PDF report downloaded successfully!");
  };

  // Show loading state if data is still loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading analysis results...</p>
        </div>
      </div>
    );
  }

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
              Analysis of your loan document from {loanSummary?.lender || "Unknown Lender"}
            </p>
            {analysisResult && (
              <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                <Shield className="w-3 h-3" />
                AI-Powered Analysis
              </span>
            )}
            {!analysisResult && (
              <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
                <AlertTriangle className="w-3 h-3" />
                Demo Data (Upload a document for real analysis)
              </span>
            )}
          </div>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleExport}
          >
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
                    ${(loanSummary?.loanAmount || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Interest Rate</p>
                  <p className="font-semibold text-foreground">{loanSummary?.interestRate || 0}%</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Term Length</p>
                  <p className="font-semibold text-foreground">{loanSummary?.termMonths || 0} months</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Loan Type</p>
                  <p className="font-semibold text-foreground">{loanSummary?.loanType || "Unknown"}</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">{loanSummary?.summary || "No summary available"}</p>
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
                  {repaymentBreakdown?.effectiveAPR || 0}% — This accounts for compound interest and fees.
                </p>
              </div>
            </ResultCard>

            {/* Predatory Terms */}
            <ResultCard
              title="Detected Predatory Terms"
              icon={AlertTriangle}
              variant={predatoryTerms && predatoryTerms.length > 0 ? "destructive" : "success"}
              className={cn(
                "transition-all duration-500 delay-300",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              {predatoryTerms && predatoryTerms.length > 0 ? (
                <div className="space-y-3">
                  {predatoryTerms.map((term) => (
                    <div
                      key={term.id}
                      className="p-3 rounded-lg border border-destructive/20 bg-destructive/5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-foreground">{term.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">{term.description}</p>
                        </div>
                        <span className={cn(
                          "text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap",
                          term.severity === "high" && "bg-destructive/20 text-destructive",
                          term.severity === "medium" && "bg-warning/20 text-warning",
                          term.severity === "low" && "bg-info/20 text-info"
                        )}>
                          {term.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Shield className="w-8 h-8 text-success mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No predatory terms detected!</p>
                </div>
              )}
            </ResultCard>
          </div>

          {/* Right Column - Fairness Score */}
          <div className="space-y-6">
            <ResultCard
              title="Fairness Score"
              icon={Calculator}
              className={cn(
                "transition-all duration-500 delay-200",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <div className="text-center mb-6">
                <CircularProgress
                  score={fairnessScore?.score || 0}
                  variant={getFairnessVariant(fairnessScore?.score || 0)}
                />
                <p className="mt-4 text-sm font-medium text-muted-foreground">
                  {getFairnessLabel(fairnessScore?.score || 0)}
                </p>
              </div>

              <div className="space-y-3">
                {(fairnessScore?.breakdown || []).map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                      <span className="text-xs font-bold text-foreground">{item.score}/100</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ResultCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
