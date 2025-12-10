import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lightbulb, Target, Rocket, Shield, Users, Eye, ArrowRight } from "lucide-react";

const About = () => {
  const sections = [
    {
      icon: Lightbulb,
      title: "Inspiration",
      content:
        "LoanLens was born from a simple observation: too many borrowers sign loan agreements they don't fully understand. Complex legal language, hidden fees, and predatory terms can trap people in unfavorable financial situations. We believed there had to be a better way to empower borrowers with knowledge.",
    },
    {
      icon: Target,
      title: "What We Do",
      content:
        "LoanLens uses advanced document analysis to break down loan agreements into plain English. We score loans on fairness, identify potentially predatory terms, and help you understand exactly what you're signing up for. Our risk assessment tool helps you evaluate whether a loan fits your financial situation.",
    },
    {
      icon: Rocket,
      title: "Future Plans",
      content:
        "We're constantly improving LoanLens to better serve borrowers. Upcoming features include comparison tools to evaluate multiple loan offers, integration with financial advisors, expanded support for various loan types (mortgages, auto loans, student loans), and personalized improvement recommendations based on your credit profile.",
    },
  ];

  const values = [
    {
      icon: Shield,
      title: "Transparency",
      description: "We believe financial terms should be clear and accessible to everyone.",
    },
    {
      icon: Users,
      title: "Empowerment",
      description: "Knowledge is power. We give borrowers the insights they need to make informed decisions.",
    },
    {
      icon: Eye,
      title: "Vigilance",
      description: "We actively identify and flag predatory lending practices to protect borrowers.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              About LoanLens
            </h1>
            <p className="text-lg text-muted-foreground">
              Making loan agreements transparent, understandable, and fair for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Main Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {sections.map((section, index) => (
              <div
                key={section.title}
                className="flex flex-col md:flex-row gap-6 items-start animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">{section.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className="bg-card rounded-2xl border border-border p-6 text-center hover:border-primary/30 hover:shadow-lg transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8">
              Upload your loan document today and gain the insights you need to make confident financial decisions.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/upload">
                Analyze Your Loan
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
