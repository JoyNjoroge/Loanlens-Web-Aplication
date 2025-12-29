import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ResultCard from "@/components/ResultCard";
import CircularProgress from "@/components/CircularProgress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, DollarSign, Briefcase, AlertCircle, CheckCircle, Info } from "lucide-react";
import { mockRiskAssessmentResult } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface FormData {
  monthlyIncome: string;
  monthlyExpenses: string;
  employmentType: string;
  loanAmount: string;
}

const RiskAssessment = () => {
  const [formData, setFormData] = useState<FormData>({
    monthlyIncome: "",
    monthlyExpenses: "",
    employmentType: "",
    loanAmount: "",
  });
  const [result, setResult] = useState<typeof mockRiskAssessmentResult.lowRisk | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    // Simulate calculation
    setTimeout(() => {
      const income = parseFloat(formData.monthlyIncome);
      const expenses = parseFloat(formData.monthlyExpenses);
      const loanAmount = parseFloat(formData.loanAmount);

      // Simple risk calculation logic
      const disposableIncome = income - expenses;
      const monthlyPayment = (loanAmount * 0.015); // Rough estimate
      const ratio = monthlyPayment / disposableIncome;

      if (ratio < 0.3) {
        setResult(mockRiskAssessmentResult.lowRisk);
      } else if (ratio < 0.5) {
        setResult(mockRiskAssessmentResult.mediumRisk);
      } else {
        setResult(mockRiskAssessmentResult.highRisk);
      }
      setIsCalculating(false);
    }, 1500);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setResult(null);
  };

  const isFormValid =
    formData.monthlyIncome &&
    formData.monthlyExpenses &&
    formData.employmentType &&
    formData.loanAmount;

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Borrower Risk Assessment
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enter your financial details to understand how a loan might impact your budget and receive personalized recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
              <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-6">Financial Information</h2>
                
                <div className="space-y-5">
                  {/* Monthly Income */}
                  <div className="space-y-2">
                    <Label htmlFor="income" className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      Monthly Income
                    </Label>
                    <Input
                      id="income"
                      type="number"
                      placeholder="Enter your monthly income"
                      value={formData.monthlyIncome}
                      onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
                      className="h-12"
                    />
                  </div>

                  {/* Monthly Expenses */}
                  <div className="space-y-2">
                    <Label htmlFor="expenses" className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      Monthly Expenses
                    </Label>
                    <Input
                      id="expenses"
                      type="number"
                      placeholder="Enter your monthly expenses"
                      value={formData.monthlyExpenses}
                      onChange={(e) => handleInputChange("monthlyExpenses", e.target.value)}
                      className="h-12"
                    />
                  </div>

                  {/* Employment Type */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary" />
                      Employment Type
                    </Label>
                    <Select
                      value={formData.employmentType}
                      onValueChange={(value) => handleInputChange("employmentType", value)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time Employee</SelectItem>
                        <SelectItem value="part-time">Part-time Employee</SelectItem>
                        <SelectItem value="self-employed">Self-employed</SelectItem>
                        <SelectItem value="contractor">Contractor/Freelancer</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Loan Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="loanAmount" className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      Loan Amount Requested
                    </Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      placeholder="Enter loan amount"
                      value={formData.loanAmount}
                      onChange={(e) => handleInputChange("loanAmount", e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  className="w-full mt-6"
                  disabled={!isFormValid || isCalculating}
                >
                  {isCalculating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    "Calculate Risk"
                  )}
                </Button>
              </form>
            </div>

            {/* Results */}
            <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
              {result ? (
                <div className="space-y-6">
                  <ResultCard
                    title="Risk Assessment"
                    icon={result.color === "success" ? CheckCircle : AlertCircle}
                    variant={result.color as "success" | "warning" | "destructive"}
                  >
                    <div className="flex flex-col items-center py-4">
                      <CircularProgress
                        value={result.percentage}
                        size={140}
                        strokeWidth={12}
                        variant={result.color as "success" | "warning" | "destructive"}
                        label="Risk Level"
                      />
                      <div
                        className={cn(
                          "mt-4 px-4 py-2 rounded-full text-sm font-bold",
                          result.color === "success" && "bg-success/10 text-success",
                          result.color === "warning" && "bg-warning/10 text-warning",
                          result.color === "destructive" && "bg-destructive/10 text-destructive"
                        )}
                      >
                        {result.score} Risk
                      </div>
                    </div>
                    <p className="text-muted-foreground text-center mt-4">{result.explanation}</p>
                  </ResultCard>

                  <ResultCard title="Recommendations" icon={Info}>
                    <ul className="space-y-3">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </ResultCard>
                </div>
              ) : (
                <div className="bg-muted/30 rounded-2xl border border-dashed border-border p-12 text-center h-full flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Enter Your Details
                  </h3>
                  <p className="text-muted-foreground max-w-xs">
                    Fill out the form to receive a personalized risk assessment and recommendations.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;
