// app/page.tsx
"use client";

import LoanAnalysisForm from "@/components/LoanAnalysisForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container py-12">
        <LoanAnalysisForm />
        
        {/* How it works section */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">How LoanLens Works</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl mb-2">1️⃣</div>
              <h3 className="font-medium">Upload</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Any language, PDF or image
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">2️⃣</div>
              <h3 className="font-medium">Analyze</h3>
              <p className="text-sm text-muted-foreground mt-1">
                AI scans for hidden terms
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">3️⃣</div>
              <h3 className="font-medium">Understand</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Get simple explanation in your language
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}