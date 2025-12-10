import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "@/components/FileUpload";
import { Shield, FileText, BarChart3 } from "lucide-react";

const Upload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileSelect = (file: File) => {
    setIsLoading(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      navigate("/results");
    }, 2500);
  };

  const steps = [
    {
      icon: FileText,
      title: "Upload Document",
      description: "Drop your loan document (PDF or image)",
    },
    {
      icon: Shield,
      title: "AI Analysis",
      description: "Our system scans for key terms and red flags",
    },
    {
      icon: BarChart3,
      title: "Get Results",
      description: "View detailed breakdown and recommendations",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Upload Your Loan Document
            </h1>
            <p className="text-muted-foreground">
              Upload your loan agreement and we'll analyze it for fairness, hidden fees, and potential risks.
            </p>
          </div>

          {/* Upload Component */}
          <div className="mb-16 animate-fade-up" style={{ animationDelay: "100ms" }}>
            <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
          </div>

          {/* How It Works */}
          <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
            <h2 className="text-xl font-semibold text-foreground text-center mb-8">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="relative flex flex-col items-center text-center p-6"
                >
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-border" />
                  )}
                  
                  {/* Step number */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <step.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full gradient-hero flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {index + 1}
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Supported Formats */}
          <div className="mt-12 text-center animate-fade-up" style={{ animationDelay: "300ms" }}>
            <p className="text-sm text-muted-foreground">
              Supported formats: PDF, JPG, PNG • Maximum file size: 10MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
