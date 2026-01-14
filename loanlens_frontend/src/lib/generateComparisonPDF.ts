import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface LoanData {
  id: string;
  fileName: string;
  lender: string;
  loanAmount: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  totalRepayment: number;
  totalInterest: number;
  effectiveAPR: number;
  fairnessScore: number;
  fairnessRating: string;
  predatoryTermsCount: number;
  fees: {
    origination: number;
    lateFee: number;
    prepaymentPenalty: boolean;
  };
}

interface GeneratePDFOptions {
  loans: LoanData[];
  bestLoanId: string;
  potentialSavings: number;
}

export function generateComparisonPDF({
  loans,
  bestLoanId,
  potentialSavings,
}: GeneratePDFOptions) {
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
  doc.text("Loan Comparison Report", pageWidth - 20, 25, { align: "right" });
  
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
  
  // Summary Section
  let yPos = 55;
  
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Executive Summary", 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`We analyzed ${loans.length} loan offers to help you make an informed decision.`, 20, yPos);
  
  // Potential Savings Box
  yPos += 15;
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(20, yPos - 5, pageWidth - 40, 25, 3, 3, "F");
  
  doc.setTextColor(...successColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Potential Savings", 30, yPos + 5);
  
  doc.setFontSize(16);
  doc.text(
    `$${potentialSavings.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    30,
    yPos + 15
  );
  
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    "by choosing the best option over the worst",
    pageWidth - 30,
    yPos + 10,
    { align: "right" }
  );
  
  // Comparison Table
  yPos += 40;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Loan Comparison", 20, yPos);
  
  yPos += 5;
  
  const tableData = loans.map((loan) => {
    const isBest = loan.id === bestLoanId;
    return [
      isBest ? `★ ${loan.lender}` : loan.lender,
      `${loan.interestRate}%`,
      `$${loan.monthlyPayment.toFixed(2)}`,
      `$${loan.totalInterest.toLocaleString()}`,
      `$${loan.totalRepayment.toLocaleString()}`,
      `${loan.fairnessScore}/100 (${loan.fairnessRating})`,
    ];
  });
  
  autoTable(doc, {
    startY: yPos,
    head: [["Lender", "Rate", "Monthly", "Interest", "Total Cost", "Fairness"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    columnStyles: {
      0: { fontStyle: "bold" },
      5: { halign: "center" },
    },
    didParseCell: (data) => {
      // Highlight best option row
      if (data.section === "body") {
        const loan = loans[data.row.index];
        if (loan.id === bestLoanId) {
          data.cell.styles.fillColor = [240, 253, 244];
        }
      }
    },
  });
  
  // Detailed Analysis per loan
  // @ts-ignore - autoTable adds finalY to doc
  yPos = doc.lastAutoTable.finalY + 15;
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Detailed Analysis", 20, yPos);
  
  yPos += 10;
  
  loans.forEach((loan, index) => {
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    const isBest = loan.id === bestLoanId;
    
    // Loan header
    if (isBest) {
      doc.setFillColor(...successColor);
    } else {
      doc.setFillColor(100, 100, 100);
    }
    doc.roundedRect(20, yPos, pageWidth - 40, 8, 2, 2, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(
      isBest ? `${loan.lender} ★ BEST OPTION` : loan.lender,
      25,
      yPos + 5.5
    );
    
    yPos += 12;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    
    // Two column layout for details
    const leftCol = 25;
    const rightCol = pageWidth / 2 + 10;
    
    doc.text(`Loan Amount: $${loan.loanAmount.toLocaleString()}`, leftCol, yPos);
    doc.text(`Interest Rate: ${loan.interestRate}%`, rightCol, yPos);
    
    yPos += 5;
    doc.text(`Term: ${loan.termMonths} months`, leftCol, yPos);
    doc.text(`Effective APR: ${loan.effectiveAPR}%`, rightCol, yPos);
    
    yPos += 5;
    doc.text(`Monthly Payment: $${loan.monthlyPayment.toFixed(2)}`, leftCol, yPos);
    doc.text(`Total Interest: $${loan.totalInterest.toLocaleString()}`, rightCol, yPos);
    
    yPos += 5;
    doc.text(`Origination Fee: $${loan.fees.origination}`, leftCol, yPos);
    doc.text(`Late Fee: $${loan.fees.lateFee}`, rightCol, yPos);
    
    yPos += 5;
    doc.text(
      `Prepayment Penalty: ${loan.fees.prepaymentPenalty ? "Yes" : "No"}`,
      leftCol,
      yPos
    );
    
    // Fairness score with color
    const fairnessColor = loan.fairnessScore >= 80
      ? successColor
      : loan.fairnessScore >= 60
      ? warningColor
      : destructiveColor;
    
    doc.setTextColor(...fairnessColor);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Fairness Score: ${loan.fairnessScore}/100 (${loan.fairnessRating})`,
      rightCol,
      yPos
    );
    
    // Predatory terms warning
    if (loan.predatoryTermsCount > 0) {
      yPos += 5;
      doc.setTextColor(...destructiveColor);
      doc.text(
        `⚠ ${loan.predatoryTermsCount} predatory term(s) detected`,
        leftCol,
        yPos
      );
    }
    
    doc.setTextColor(0, 0, 0);
    yPos += 15;
  });
  
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
  doc.save("LoanLens-Comparison-Report.pdf");
}
