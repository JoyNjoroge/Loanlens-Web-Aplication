import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, FileSearch, Calculator, AlertTriangle, ArrowRight, CheckCircle } from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: FileSearch,
      title: "Document Analysis",
      description: "Upload your loan documents and get instant, clear explanations of complex terms.",
    },
    {
      icon: Shield,
      title: "Fairness Scoring",
      description: "Our algorithm evaluates loan terms against industry standards to detect unfair practices.",
    },
    {
      icon: Calculator,
      title: "Repayment Calculator",
      description: "Understand exactly what you'll pay over the life of your loan with detailed breakdowns.",
    },
    {
      icon: AlertTriangle,
      title: "Predatory Detection",
      description: "Identify hidden fees, unusual clauses, and potentially predatory lending practices.",
    },
  ];

  const benefits = [
    "No hidden fees or subscriptions",
    "Bank-level data security",
    "Instant analysis results",
    "Plain-English explanations",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Making Loans Transparent
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Understand Your Loan,{" "}
              <span className="text-primary">Protect Your Future</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Upload your loan document, analyze fairness, understand repayment, and evaluate risk — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/upload">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Make Informed Decisions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              LoanLens provides comprehensive tools to analyze and understand your loan agreements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 animate-fade-up group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Choose LoanLens?
              </h2>
              <p className="text-muted-foreground mb-8">
                We believe everyone deserves to understand their financial commitments. Our platform makes complex loan documents accessible and transparent.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-8 shadow-xl">
                <div className="bg-card rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full gradient-hero" />
                    <div>
                      <div className="h-3 w-24 bg-muted rounded" />
                      <div className="h-2 w-16 bg-muted rounded mt-2" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-muted rounded w-full" />
                    <div className="h-2 bg-muted rounded w-4/5" />
                    <div className="h-2 bg-muted rounded w-3/5" />
                  </div>
                  <div className="mt-6 flex gap-2">
                    <div className="h-8 w-20 bg-success/20 rounded-lg" />
                    <div className="h-8 w-20 bg-warning/20 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Analyze Your Loan?
            </h2>
            <p className="text-muted-foreground mb-8">
              Upload your document now and get instant insights into your loan terms.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/upload">
                Upload Document
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
