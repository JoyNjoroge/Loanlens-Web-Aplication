import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface FairnessBreakdown {
  label: string;
  score: number;
}

interface RepaymentBreakdown {
  monthlyPayment: number;
  totalRepayment: number;
  totalInterest: number;
  numberOfInstallments: number;
  effectiveAPR: number;
}

interface LoanSummary {
  loanAmount: number;
  interestRate: number;
  termMonths: number;
  lender: string;
  loanType: string;
  summary: string;
}

interface FairnessScore {
  score: number;
  breakdown: FairnessBreakdown[];
}

interface PredatoryTerm {
  term: string;
  description: string;
  severity: string;
}

interface GenerateResultsPDFOptions {
  loanSummary: LoanSummary;
  fairnessScore: FairnessScore;
  repaymentBreakdown: RepaymentBreakdown;
  predatoryTerms: PredatoryTerm[];
}

export function generateResultsPDF({
  loanSummary,
  fairnessScore,
  repaymentBreakdown,
  predatoryTerms,
}: GenerateResultsPDFOptions) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Colors
  const primaryColor: [number, number, number] = [59, 130, 246];
  const successColor: [number, number, number] = [34, 197, 94];
  const warningColor: [number, number, number] = [234, 179, 8];
  const destructiveColor: [number, number, number] = [239, 68, 68];
  
  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("LoanLens", 20, 25);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Loan Analysis Report", pageWidth - 20, 25, { align: "right" });
  
  // Date
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(10);
  doc.text(new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }), pageWidth - 20, 35, { align: "right" });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Loan Summary Section
  let yPos = 55;
  
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Loan Summary", 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Lender: ${loanSummary.lender}`, 20, yPos);
  
  yPos += 5;
  doc.text(`Loan Type: ${loanSummary.loanType}`, 20, yPos);
  
  yPos += 10;
  doc.setFillColor(240, 248, 255);
  doc.roundedRect(20, yPos - 5, pageWidth - 40, 35, 3, 3, "F");
  
  doc.setFontSize(9);
  const leftCol = 30;
  const rightCol = pageWidth / 2 + 10;
  
  doc.text(`Loan Amount: $${loanSummary.loanAmount.toLocaleString()}`, leftCol, yPos + 5);
  doc.text(`Interest Rate: ${loanSummary.interestRate}%`, rightCol, yPos + 5);
  
  yPos += 5;
  doc.text(`Term Length: ${loanSummary.termMonths} months`, leftCol, yPos + 5);
  doc.text(`Effective APR: ${repaymentBreakdown.effectiveAPR}%`, rightCol, yPos + 5);
  
  yPos += 10;
  doc.setFont("helvetica", "normal");
  const summaryLines = doc.splitTextToSize(loanSummary.summary, pageWidth - 60);
  doc.text(summaryLines, leftCol, yPos + 10);
  
  // Fairness Score Section
  yPos += 45;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Fairness Analysis", 20, yPos);
  
  yPos += 10;
  
  // Fairness Score Box
  const fairnessColor = fairnessScore.score >= 80
    ? successColor
    : fairnessScore.score >= 60
    ? warningColor
    : destructiveColor;
  
  const fairnessLabel = fairnessScore.score >= 80
    ? "Fair"
    : fairnessScore.score >= 60
    ? "Borderline"
    : "Predatory";
  
  doc.setFillColor(...fairnessColor);
  doc.roundedRect(20, yPos, 50, 30, 3, 3, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text(fairnessScore.score.toString(), 30, yPos + 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.text("/100", 45, yPos + 20, { align: "center" });
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(fairnessLabel, 45, yPos + 28, { align: "center" });
  
  doc.setTextColor(0, 0, 0);
  
  // Fairness Breakdown Table
  if (fairnessScore.breakdown && fairnessScore.breakdown.length > 0) {
    const breakdownData = fairnessScore.breakdown.map(item => [
      item.label,
      item.score.toString(),
    ]);
    
    autoTable(doc, {
      startY: yPos + 5,
      head: [["Category", "Score"]],
      body: breakdownData,
      theme: "striped",
      headStyles: {
        fillColor: fairnessColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      styles: {
        fontSize: 9,
        cellPadding: 4,
      },
      margin: { left: 75 },
      columnStyles: {
        1: { halign: "center" },
      },
    });
    
    // @ts-ignore
    yPos = doc.lastAutoTable.finalY + 10;
  } else {
    yPos += 40;
  }
  
  // Repayment Breakdown Section
  if (yPos > 200) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Repayment Schedule", 20, yPos);
  
  yPos += 10;
  
  const repaymentData = [
    ["Monthly Payment", `$${repaymentBreakdown.monthlyPayment.toFixed(2)}`],
    ["Total Installments", repaymentBreakdown.numberOfInstallments.toString()],
    ["Total Repayment", `$${repaymentBreakdown.totalRepayment.toLocaleString()}`],
    ["Total Interest", `$${repaymentBreakdown.totalInterest.toLocaleString()}`],
  ];
  
  autoTable(doc, {
    startY: yPos,
    head: [["Description", "Amount"]],
    body: repaymentData,
    theme: "striped",
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    columnStyles: {
      1: { halign: "right" },
    },
  });
  
  // @ts-ignore
  yPos = doc.lastAutoTable.finalY + 15;
  
  // Predatory Terms Section
  if (predatoryTerms && predatoryTerms.length > 0) {
    if (yPos > 200) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Predatory Terms Detected", 20, yPos);
    
    yPos += 10;
    
    const predatoryData = predatoryTerms.map(term => [
      term.term,
      term.description,
      term.severity,
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [["Term", "Description", "Severity"]],
      body: predatoryData,
      theme: "striped",
      headStyles: {
        fillColor: destructiveColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      styles: {
        fontSize: 8,
        cellPadding: 4,
      },
      columnStyles: {
        2: { halign: "center" },
      },
    });
  } else {
    if (yPos > 200) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFillColor(...successColor);
    doc.roundedRect(20, yPos, pageWidth - 40, 15, 3, 3, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("✓ No Predatory Terms Detected", 20, yPos + 10, { align: "center" });
  }
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated by LoanLens • Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }
  
  // Save the PDF
  doc.save("LoanLens-Analysis-Report.pdf");
}