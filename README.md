# LoanLens - Loan Analysis & Comparison Platform

LoanLens is an AI-powered web application that analyzes loan documents and provides fairness assessments, helping users make informed borrowing decisions. The platform uses Google's Gemini AI to extract key loan terms and evaluate them against predatory lending practices.

## 🎯 Features

- **AI-Powered Loan Analysis**: Automatically extract and analyze loan documents using Google Gemini
- **Fairness Scoring**: Get a 0-100 fairness score with detailed breakdowns of loan components
- **Predatory Term Detection**: Identify potentially unfair loan terms and conditions
- **Loan Comparison**: Upload multiple loan documents and compare them side-by-side
- **PDF Export**: Generate professional PDF reports of your analysis
- **Plain-English Summaries**: Get easy-to-understand explanations of complex loan terms
- **Repayment Breakdowns**: Detailed calculations of monthly payments, total interest, and effective APR

## 🏗️ Project Structure
loanlens_frontend/ # React + TypeScript frontend
├── src/
│ ├── components/ # Reusable UI components
│ │ ├── CircularProgress.tsx # Fairness score visualization
│ │ ├── ComparisonUpload.tsx # Multi-file upload for comparison
│ │ ├── FileUpload.tsx # Single file upload
│ │ ├── LoanComparisonCard.tsx # Individual loan card
│ │ ├── ResultCard.tsx # Result display card
│ │ └── ui/ # shadcn/ui components
│ ├── pages/ # Page components
│ │ ├── Home.tsx # Landing page
│ │ ├── Upload.tsx # Single loan analysis page
│ │ ├── Compare.tsx # Loan comparison page
│ │ ├── Results.tsx # Analysis results page
│ │ └── RiskAssessment.tsx # Risk assessment page
│ ├── hooks/ # Custom React hooks
│ │ ├── useLoanAnalysis.ts # Single loan analysis hook
│ │ └── useComparisonAnalysis.ts # Multi-loan comparison hook
│ ├── lib/ # Utility functions and APIs
│ │ ├── loanAnalysisApi.ts # Backend API calls
│ │ ├── generateComparisonPDF.ts # PDF generation for comparison
│ │ └── generateResultsPDF.ts # PDF generation for results
│ └── data/ # Mock data for development
│
loanlens-backend/ # Flask backend
├── app.py # Main Flask application
├── requirements.txt # Python dependencies
└── supabase/
└── functions/
└── analyze-loan/ # Supabase edge function for analysis

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Python 3.10+
- Google Gemini API key
- Bun (optional, but recommended for frontend)

### Frontend Setup

```bash
cd loanlens_frontend

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun run dev

# Build for production
npm run build
```

### Backend Setup
cd loanlens-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your Gemini API key
echo GOOGLE_API_KEY=your_api_key_here > .env

# Run the development server
python [app.py](http://_vscodecontentref_/3)
# Server runs on http://localhost:3001

📋 API Endpoints
POST /analyze
Analyze a single loan document.

Request:
{
  "file": "PDF file content"
}
Response:
{
  "loanSummary": {
    "loanAmount": 10000000,
    "interestRate": 7.22,
    "termMonths": 60,
    "lender": "Hua Xia Bank Co., Ltd.",
    "loanType": "Working Capital",
    "summary": "Working capital loan details..."
  },
  "fairnessScore": {
    "score": 50,
    "breakdown": [
      {"label": "Interest Rate", "score": 50},
      {"label": "Fee Structure", "score": 50}
    ]
  },
  "repaymentBreakdown": {
    "monthlyPayment": 200000,
    "totalRepayment": 12000000,
    "totalInterest": 2000000,
    "numberOfInstallments": 60,
    "effectiveAPR": 7.5
  },
  "predatoryTerms": [
    {
      "term": "Term Name",
      "description": "Description",
      "severity": "high|medium|low"
    }
  ]
}

🔧 Key Technologies
Frontend
React 19 - UI library
TypeScript - Type safety
Tailwind CSS - Styling
shadcn/ui - Component library
React Router - Navigation
jsPDF + html2canvas - PDF generation
Lucide React - Icons
Sonner - Toast notifications
Vite - Build tool
Backend
Flask - Web framework
Google Gemini AI - Document analysis
PyMuPDF (fitz) - PDF text extraction
Pytesseract - OCR for scanned documents
Flask-CORS - Cross-origin requests
python-dotenv - Environment configuration
📊 How It Works
Document Upload: User uploads a PDF loan document
Text Extraction: Backend extracts text using PyMuPDF with OCR fallback
AI Analysis: Google Gemini API analyzes the document and extracts:
Loan summary (amount, rate, term, lender)
Fairness score with breakdown
Repayment calculations
Predatory terms detection
Results Display: Frontend displays analysis with visualizations
PDF Export: Users can download professional PDF reports
Comparison: Users can upload multiple documents and compare side-by-side
🎨 UI Components
CircularProgress: Circular progress visualization for fairness scores
ResultCard: Reusable card component for displaying analysis results
LoanComparisonCard: Specialized card for comparing loans
FileUpload: Single file upload component with drag-and-drop
ComparisonUpload: Multi-file upload component (up to 5 files)
📱 Pages
Home: Landing page with feature overview
Upload: Single loan analysis interface
Compare: Multi-loan comparison interface
Results: Detailed analysis results with visualizations
RiskAssessment: Risk assessment analysis page
⚙️ Configuration
Environment Variables
Backend (.env):
  GOOGLE_API_KEY=your_gemini_api_key
  FLASK_ENV=development
Frontend (.env):
  VITE_SUPABASE_URL=your_supabase_url
  VITE_SUPABASE_ANON_KEY=your_supabase_key

🐛 Known Issues
CircularProgress NaN Error: Fairness score may not display if calculation results in NaN. Ensure data validation in backend.
PDF Export: Results page export feature may need updates to match comparison page implementation.
Python Version: Python 3.10 is approaching end-of-life. Consider upgrading to Python 3.11+.
🔄 Development Workflow
Start the backend: python app.py
Start the frontend: npm run dev
Access the app at http://localhost:5173
📝 Contributing
When contributing, please:

Follow the existing code style
Add TypeScript types for new components
Test API endpoints thoroughly
Update this README if adding new features
📄 License
This project is part of the LoanLens initiative by JoyNjoroge.

📞 Support
For issues or questions, please refer to the project repository or contact the development team.

Version: 0.0.0
Last Updated: January 15, 2026

