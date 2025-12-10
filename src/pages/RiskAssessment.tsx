import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CircularProgress from "@/components/CircularProgress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
} from "recharts";
import {
  User,
  DollarSign,
  Building,
  Scale,
  Download,
  FileCheck,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Users,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Create mock data if the import doesn't exist
const mockRiskAssessmentResult = {
  lowRisk: {
    score: "Low",
    color: "success",
    percentage: 85,
    explanation: "Applicant meets all risk criteria with strong financial profile.",
    recommendations: [
      "Approve with standard terms",
      "Consider offering premium interest rate",
      "No additional collateral required"
    ]
  },
  mediumRisk: {
    score: "Medium",
    color: "warning",
    percentage: 65,
    explanation: "Applicant meets most criteria but has some risk factors.",
    recommendations: [
      "Approve with conditions",
      "Require additional documentation",
      "Consider higher interest rate"
    ]
  },
  highRisk: {
    score: "High",
    color: "destructive",
    percentage: 35,
    explanation: "Significant risk factors identified. Requires careful review.",
    recommendations: [
      "Request additional collateral",
      "Require co-signer",
      "Consider declining or offering secured loan only"
    ]
  }
};

interface LenderFormData {
  borrowerName: string;
  monthlyIncome: string;
  monthlyExpenses: string;
  existingDebt: string;
  creditScore: string;
  employmentType: string;
  employmentDuration: string;
  loanAmount: string;
  loanTerm: string;
  collateralValue: string;
  collateralType: string;
  requestedInterestRate: string;
}

interface RiskMetrics {
  probabilityOfDefault: number;
  lossGivenDefault: number;
  expectedLoss: number;
  riskAdjustedReturn: number;
  debtServiceCoverageRatio: number;
  loanToValue: number;
  creditScoreBand: string;
  riskGrade: 'A' | 'B' | 'C' | 'D' | 'E';
  recommendedInterestRate: number;
  maximumLoanAmount: number;
}

interface RegulatoryCheck {
  requirement: string;
  compliant: boolean;
  threshold: number;
  actual: number;
  severity: 'critical' | 'warning' | 'pass';
}

const RiskAssessment = () => {
  const [formData, setFormData] = useState<LenderFormData>({
    borrowerName: "John Doe",
    monthlyIncome: "5000",
    monthlyExpenses: "3000",
    existingDebt: "500",
    creditScore: "720",
    employmentType: "employed",
    employmentDuration: "24",
    loanAmount: "25000",
    loanTerm: "36",
    collateralValue: "30000",
    collateralType: "vehicle",
    requestedInterestRate: "12",
  });

  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [regulatoryChecks, setRegulatoryChecks] = useState<RegulatoryCheck[]>([]);
  const [profitabilityAnalysis, setProfitabilityAnalysis] = useState<any>(null);
  const [comparisonData, setComparisonData] = useState<any[]>([]);

  // Initialize with sample data for testing
  useEffect(() => {
    // Auto-run calculation with initial data
    const timeoutId = setTimeout(() => {
      calculateLenderRiskMetrics();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  const calculateLenderRiskMetrics = () => {
    console.log("Calculating risk metrics...");
    
    const income = parseFloat(formData.monthlyIncome) || 0;
    const expenses = parseFloat(formData.monthlyExpenses) || 0;
    const existingDebt = parseFloat(formData.existingDebt) || 0;
    const creditScore = parseInt(formData.creditScore) || 300;
    const loanAmount = parseFloat(formData.loanAmount) || 0;
    const loanTerm = parseInt(formData.loanTerm) || 36;
    const collateralValue = parseFloat(formData.collateralValue) || 0;
    const requestedRate = parseFloat(formData.requestedInterestRate) || 12;

    console.log("Input values:", { income, expenses, existingDebt, creditScore, loanAmount, loanTerm, collateralValue, requestedRate });

    // Basic calculations
    const disposableIncome = Math.max(0, income - expenses);
    const monthlyInterestRate = requestedRate / 100 / 12;
    
    // Calculate monthly payment
    let monthlyPayment = 0;
    if (monthlyInterestRate > 0) {
      const numerator = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm);
      const denominator = Math.pow(1 + monthlyInterestRate, loanTerm) - 1;
      monthlyPayment = numerator / denominator;
    } else {
      monthlyPayment = loanAmount / loanTerm;
    }

    console.log("Monthly payment:", monthlyPayment);

    // Probability of Default (simplified)
    let pd = 0;
    if (creditScore >= 800) pd = 0.5;
    else if (creditScore >= 750) pd = 1.5;
    else if (creditScore >= 700) pd = 3.0;
    else if (creditScore >= 650) pd = 6.0;
    else if (creditScore >= 600) pd = 12.0;
    else pd = 25.0;

    // Adjust PD based on DTI
    const dti = income > 0 ? ((existingDebt + monthlyPayment) / income) * 100 : 100;
    if (dti > 50) pd *= 1.5;
    if (dti > 60) pd *= 2.0;
    
    if (formData.employmentType === "self-employed") pd *= 1.3;
    if (formData.employmentType === "unemployed") pd *= 3.0;

    // Loss Given Default
    const ltv = collateralValue > 0 ? (loanAmount / collateralValue) * 100 : 0;
    let lgd = 0;
    if (collateralValue > 0) {
      if (ltv <= 60) lgd = 25;
      else if (ltv <= 80) lgd = 40;
      else if (ltv <= 100) lgd = 60;
      else lgd = 85;
    } else {
      lgd = 75;
    }

    // Expected Loss
    const el = (pd / 100) * (lgd / 100) * loanAmount;

    // Debt Service Coverage Ratio
    const dscr = monthlyPayment > 0 ? disposableIncome / monthlyPayment : 0;

    // Risk-Adjusted Return
    const expectedRevenue = (monthlyPayment * loanTerm) - loanAmount;
    const capitalRequirement = loanAmount * 0.08;
    const raroc = capitalRequirement > 0 ? ((expectedRevenue - el) / capitalRequirement) * 100 : 0;

    // Determine Risk Grade
    let riskGrade: 'A' | 'B' | 'C' | 'D' | 'E' = 'C';
    if (pd <= 2 && dscr >= 2.0) riskGrade = 'A';
    else if (pd <= 5 && dscr >= 1.5) riskGrade = 'B';
    else if (pd <= 10 && dscr >= 1.25) riskGrade = 'C';
    else if (pd <= 20 && dscr >= 1.0) riskGrade = 'D';
    else riskGrade = 'E';

    // Recommended Interest Rate
    let recommendedRate = requestedRate;
    if (riskGrade === 'A') recommendedRate = Math.max(8, requestedRate * 0.9);
    else if (riskGrade === 'B') recommendedRate = requestedRate;
    else if (riskGrade === 'C') recommendedRate = requestedRate * 1.1;
    else if (riskGrade === 'D') recommendedRate = requestedRate * 1.25;
    else recommendedRate = requestedRate * 1.5;

    // Maximum Loan Amount
    const maxLoanAmount = monthlyInterestRate > 0 
      ? disposableIncome * 0.36 * loanTerm / monthlyInterestRate
      : disposableIncome * 0.36 * loanTerm * 100; // If rate is 0, use simple calculation

    const metrics: RiskMetrics = {
      probabilityOfDefault: pd,
      lossGivenDefault: lgd,
      expectedLoss: el,
      riskAdjustedReturn: raroc,
      debtServiceCoverageRatio: dscr,
      loanToValue: ltv,
      creditScoreBand: creditScore >= 750 ? "Excellent" : 
                      creditScore >= 700 ? "Good" : 
                      creditScore >= 650 ? "Fair" : "Poor",
      riskGrade,
      recommendedInterestRate: recommendedRate,
      maximumLoanAmount: maxLoanAmount,
    };

    console.log("Calculated metrics:", metrics);

    // Regulatory checks
    const regulatory: RegulatoryCheck[] = [
      {
        requirement: "DSCR ≥ 1.25",
        compliant: dscr >= 1.25,
        threshold: 1.25,
        actual: dscr,
        severity: dscr < 1.0 ? "critical" : dscr < 1.25 ? "warning" : "pass"
      },
      {
        requirement: "LTV ≤ 80%",
        compliant: ltv <= 80 || collateralValue === 0,
        threshold: 80,
        actual: ltv,
        severity: ltv > 100 ? "critical" : ltv > 80 ? "warning" : "pass"
      },
      {
        requirement: "PD ≤ 15%",
        compliant: pd <= 15,
        threshold: 15,
        actual: pd,
        severity: pd > 25 ? "critical" : pd > 15 ? "warning" : "pass"
      },
      {
        requirement: "DTI ≤ 43%",
        compliant: dti <= 43,
        threshold: 43,
        actual: dti,
        severity: dti > 50 ? "critical" : dti > 43 ? "warning" : "pass"
      },
    ];

    // Profitability analysis
    const profitability = {
      totalRevenue: monthlyPayment * loanTerm,
      totalCost: loanAmount + el,
      netProfit: (monthlyPayment * loanTerm) - loanAmount - el,
      returnOnEquity: capitalRequirement > 0 ? ((monthlyPayment * loanTerm) - loanAmount - el) / capitalRequirement * 100 : 0,
      breakEvenMonths: monthlyPayment > 0 ? Math.ceil(loanAmount / monthlyPayment) : 0,
    };

    // Comparison data
    const comparison = [
      { metric: "Risk Grade", applicant: riskGrade, industry: "B", status: riskGrade <= "B" ? "better" : "worse" },
      { metric: "DSCR", applicant: dscr.toFixed(2), industry: "1.50", status: dscr >= 1.5 ? "better" : "worse" },
      { metric: "PD", applicant: `${pd.toFixed(1)}%`, industry: "8.5%", status: pd <= 8.5 ? "better" : "worse" },
      { metric: "LTV", applicant: `${ltv.toFixed(1)}%`, industry: "75%", status: ltv <= 75 ? "better" : "worse" },
    ];

    setRiskMetrics(metrics);
    setRegulatoryChecks(regulatory);
    setProfitabilityAnalysis(profitability);
    setComparisonData(comparison);

    // Set overall result
    let riskLevel;
    if (riskGrade === 'A' || riskGrade === 'B') {
      riskLevel = { ...mockRiskAssessmentResult.lowRisk };
    } else if (riskGrade === 'C') {
      riskLevel = { ...mockRiskAssessmentResult.mediumRisk };
    } else {
      riskLevel = { ...mockRiskAssessmentResult.highRisk };
    }

    riskLevel.explanation = `Applicant risk grade: ${riskGrade}. PD: ${pd.toFixed(1)}%, Expected Loss: $${el.toFixed(0)}`;
    riskLevel.percentage = Math.max(0, Math.min(100, 100 - pd));
    
    console.log("Setting result:", riskLevel);
    setResult(riskLevel);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    setTimeout(() => {
      calculateLenderRiskMetrics();
      setIsCalculating(false);
    }, 500);
  };

  const handleInputChange = (field: keyof LenderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const downloadReport = () => {
    if (!riskMetrics || !result) {
      alert("Please run the analysis first");
      return;
    }

    const reportContent = `
LoanLens Risk Assessment Report
===============================
Generated: ${new Date().toLocaleDateString()}
Borrower: ${formData.borrowerName || "Not specified"}

Risk Summary
------------
Risk Grade: ${riskMetrics.riskGrade}
Risk Score: ${result.percentage}/100
Probability of Default: ${riskMetrics.probabilityOfDefault.toFixed(1)}%
Expected Loss: $${riskMetrics.expectedLoss.toFixed(2)}
DSCR: ${riskMetrics.debtServiceCoverageRatio.toFixed(2)}
LTV Ratio: ${riskMetrics.loanToValue.toFixed(1)}%
Recommended Interest: ${riskMetrics.recommendedInterestRate.toFixed(1)}%

Profitability Analysis
---------------------
Total Revenue: $${profitabilityAnalysis?.totalRevenue?.toFixed(2) || "0.00"}
Total Cost: $${profitabilityAnalysis?.totalCost?.toFixed(2) || "0.00"}
Net Profit: $${profitabilityAnalysis?.netProfit?.toFixed(2) || "0.00"}
Return on Equity: ${profitabilityAnalysis?.returnOnEquity?.toFixed(1) || "0.0"}%
Break-even Point: ${profitabilityAnalysis?.breakEvenMonths || "0"} months

Recommendations
---------------
1. ${riskMetrics.riskGrade <= 'B' ? 'APPROVE' : 'REVIEW'} this application
2. Offer interest rate: ${riskMetrics.recommendedInterestRate.toFixed(1)}%
3. Maximum recommended loan: $${riskMetrics.maximumLoanAmount.toFixed(0)}
4. ${riskMetrics.loanToValue > 80 ? 'Require additional collateral' : 'Collateral coverage sufficient'}
5. ${riskMetrics.debtServiceCoverageRatio < 1.25 ? 'Request income verification' : 'DSCR meets requirements'}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LoanLens-Risk-Assessment-${formData.borrowerName || 'Unknown'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isFormValid = () => {
    const income = parseFloat(formData.monthlyIncome);
    const expenses = parseFloat(formData.monthlyExpenses);
    const loanAmount = parseFloat(formData.loanAmount);
    
    return income > 0 && 
           expenses >= 0 && 
           income > expenses && 
           loanAmount > 0 &&
           formData.employmentType !== "";
  };

  // Chart data
  const riskDistributionData = [
    { name: 'A', value: 15, color: '#10B981' },
    { name: 'B', value: 25, color: '#3B82F6' },
    { name: 'C', value: 35, color: '#F59E0B' },
    { name: 'D', value: 15, color: '#EF4444' },
    { name: 'E', value: 10, color: '#7C3AED' },
  ];

  const profitabilityChartData = profitabilityAnalysis && parseInt(formData.loanTerm) > 0 ? [
    { month: 1, revenue: profitabilityAnalysis.totalRevenue / parseInt(formData.loanTerm), cost: profitabilityAnalysis.totalCost / parseInt(formData.loanTerm) },
    { month: 6, revenue: (profitabilityAnalysis.totalRevenue / parseInt(formData.loanTerm)) * 6, cost: (profitabilityAnalysis.totalCost / parseInt(formData.loanTerm)) * 6 },
    { month: 12, revenue: (profitabilityAnalysis.totalRevenue / parseInt(formData.loanTerm)) * 12, cost: (profitabilityAnalysis.totalCost / parseInt(formData.loanTerm)) * 12 },
    { month: 24, revenue: (profitabilityAnalysis.totalRevenue / parseInt(formData.loanTerm)) * 24, cost: (profitabilityAnalysis.totalCost / parseInt(formData.loanTerm)) * 24 },
  ] : [];

  // Custom ResultCard component if yours doesn't exist
  const ResultCard = ({ 
    title, 
    children, 
    icon: Icon = null,
    className = "",
    variant = "default"
  }: { 
    title: string; 
    children: React.ReactNode; 
    icon?: any;
    className?: string;
    variant?: "default" | "success" | "warning" | "destructive";
  }) => {
    const variantClasses = {
      default: "border-border",
      success: "border-success/30 bg-success/5",
      warning: "border-warning/30 bg-warning/5",
      destructive: "border-destructive/30 bg-destructive/5",
    };

    return (
      <Card className={`${className} ${variantClasses[variant]}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              {Icon && <Icon className="w-5 h-5" />}
              {title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Building className="w-10 h-10 text-primary" />
              <Scale className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Lender Risk Underwriting Dashboard
            </h1>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Professional risk assessment with Basel III compliance
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Form */}
            <div className="lg:col-span-1 space-y-6">
              {/* Borrower Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Borrower Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Borrower Name</Label>
                    <Input
                      placeholder="John Doe"
                      value={formData.borrowerName}
                      onChange={(e) => handleInputChange("borrowerName", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Monthly Income ($)</Label>
                    <Input
                      type="number"
                      placeholder="5000"
                      value={formData.monthlyIncome}
                      onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Monthly Expenses ($)</Label>
                    <Input
                      type="number"
                      placeholder="3000"
                      value={formData.monthlyExpenses}
                      onChange={(e) => handleInputChange("monthlyExpenses", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Existing Monthly Debt ($)</Label>
                    <Input
                      type="number"
                      placeholder="500"
                      value={formData.existingDebt}
                      onChange={(e) => handleInputChange("existingDebt", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Credit Score</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="range"
                        min="300"
                        max="850"
                        value={formData.creditScore}
                        onChange={(e) => handleInputChange("creditScore", e.target.value)}
                        className="flex-1"
                      />
                      <span className="font-bold min-w-[50px]">{formData.creditScore}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Employment Type</Label>
                    <Select
                      value={formData.employmentType}
                      onValueChange={(value) => handleInputChange("employmentType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employed">Employed</SelectItem>
                        <SelectItem value="self-employed">Self-Employed</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Loan Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Loan Application
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Loan Amount ($)</Label>
                    <Input
                      type="number"
                      placeholder="25000"
                      value={formData.loanAmount}
                      onChange={(e) => handleInputChange("loanAmount", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Requested Interest Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="12.5"
                      value={formData.requestedInterestRate}
                      onChange={(e) => handleInputChange("requestedInterestRate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Loan Term (months)</Label>
                    <Select
                      value={formData.loanTerm}
                      onValueChange={(value) => handleInputChange("loanTerm", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select term" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12 months</SelectItem>
                        <SelectItem value="24">24 months</SelectItem>
                        <SelectItem value="36">36 months</SelectItem>
                        <SelectItem value="48">48 months</SelectItem>
                        <SelectItem value="60">60 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Collateral Value ($)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.collateralValue}
                      onChange={(e) => handleInputChange("collateralValue", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Collateral Type</Label>
                    <Select
                      value={formData.collateralType}
                      onValueChange={(value) => handleInputChange("collateralType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select collateral" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None (Unsecured)</SelectItem>
                        <SelectItem value="vehicle">Vehicle</SelectItem>
                        <SelectItem value="property">Real Estate</SelectItem>
                        <SelectItem value="savings">Savings Account</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Button
                variant="default"
                className="w-full h-12 text-lg font-semibold"
                onClick={handleSubmit}
                disabled={!isFormValid() || isCalculating}
              >
                {isCalculating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Scale className="w-5 h-5 mr-3" />
                    Run Underwriting Analysis
                  </>
                )}
              </Button>
            </div>

            {/* Right Column - Results */}
            <div className="lg:col-span-2 space-y-6">
              {result ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">
                        Risk Assessment: {formData.borrowerName || "Applicant"}
                      </h2>
                      <p className="text-muted-foreground">
                        Generated {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={downloadReport} size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                      </Button>
                    </div>
                  </div>

                  {/* Overall Risk Score */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Overall Risk Assessment</span>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-sm font-bold",
                          result.color === "success" && "bg-green-100 text-green-800",
                          result.color === "warning" && "bg-yellow-100 text-yellow-800",
                          result.color === "destructive" && "bg-red-100 text-red-800"
                        )}>
                          {result.score} Risk
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <CircularProgress
                          value={result.percentage}
                          size={180}
                          strokeWidth={12}
                          variant={result.color as any}
                          label="Risk Score"
                        />
                        <p className="mt-4 text-center text-muted-foreground">{result.explanation}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="text-center">
                      <CardHeader>
                        <CardTitle className="text-sm">Risk Grade</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={cn(
                          "text-4xl font-bold mb-2",
                          riskMetrics?.riskGrade === 'A' && "text-green-600",
                          riskMetrics?.riskGrade === 'B' && "text-blue-600",
                          riskMetrics?.riskGrade === 'C' && "text-yellow-600",
                          (riskMetrics?.riskGrade === 'D' || riskMetrics?.riskGrade === 'E') && "text-red-600"
                        )}>
                          {riskMetrics?.riskGrade || "N/A"}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="text-center">
                      <CardHeader>
                        <CardTitle className="text-sm">Default Probability</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={cn(
                          "text-3xl font-bold mb-2",
                          (riskMetrics?.probabilityOfDefault || 0) <= 5 && "text-green-600",
                          (riskMetrics?.probabilityOfDefault || 0) <= 15 && "text-yellow-600",
                          "text-red-600"
                        )}>
                          {(riskMetrics?.probabilityOfDefault || 0).toFixed(1)}%
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="text-center">
                      <CardHeader>
                        <CardTitle className="text-sm">Expected Loss</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold mb-2 text-red-600">
                          ${(riskMetrics?.expectedLoss || 0).toFixed(0)}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="text-center">
                      <CardHeader>
                        <CardTitle className="text-sm">Risk-Adjusted Return</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={cn(
                          "text-3xl font-bold mb-2 flex items-center justify-center gap-2",
                          (riskMetrics?.riskAdjustedReturn || 0) >= 20 && "text-green-600",
                          (riskMetrics?.riskAdjustedReturn || 0) >= 10 && "text-yellow-600",
                          "text-red-600"
                        )}>
                          {(riskMetrics?.riskAdjustedReturn || 0) >= 0 ? (
                            <ArrowUpRight className="w-5 h-5" />
                          ) : (
                            <ArrowDownRight className="w-5 h-5" />
                          )}
                          {(riskMetrics?.riskAdjustedReturn || 0).toFixed(1)}%
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Risk Grade Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={riskDistributionData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <RechartsTooltip />
                              <Bar dataKey="value">
                                {riskDistributionData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Profitability Forecast</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={profitabilityChartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <RechartsTooltip />
                              <Area 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="#10B981" 
                                fill="#10B981" 
                                fillOpacity={0.3}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="cost" 
                                stroke="#EF4444" 
                                fill="#EF4444" 
                                fillOpacity={0.3}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileCheck className="w-5 h-5" />
                        Recommendations & Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className={cn(
                          "p-4 rounded-lg border-2",
                          riskMetrics?.riskGrade === 'A' || riskMetrics?.riskGrade === 'B' 
                            ? "border-green-200 bg-green-50" 
                            : riskMetrics?.riskGrade === 'C'
                            ? "border-yellow-200 bg-yellow-50"
                            : "border-red-200 bg-red-50"
                        )}>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold">
                              {riskMetrics?.riskGrade === 'A' || riskMetrics?.riskGrade === 'B' 
                                ? 'APPROVE' 
                                : riskMetrics?.riskGrade === 'C'
                                ? 'CONDITIONAL APPROVAL' 
                                : 'DECLINE'}
                            </h3>
                            <span className="text-sm font-bold px-3 py-1 rounded-full bg-white">
                              Confidence: {(100 - (riskMetrics?.probabilityOfDefault || 0)).toFixed(0)}%
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-bold mb-2">Recommended Terms</h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                Interest Rate: {riskMetrics?.recommendedInterestRate.toFixed(1)}%
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                Max Loan: ${riskMetrics?.maximumLoanAmount.toFixed(0)}
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-bold mb-2">Conditions</h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-yellow-600" />
                                Income verification required
                              </li>
                              <li className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-yellow-600" />
                                Quarterly financial review
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="p-12 text-center">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <Scale className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      Professional Underwriting Dashboard
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      Enter applicant details to generate a comprehensive risk assessment.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Sample data is pre-loaded. Click "Run Underwriting Analysis" to start.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;