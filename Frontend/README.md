## **LoanLens**

LoanLens is a comprehensive web application designed to help users analyze and understand their loan documents. It provides tools for document analysis, fairness scoring, repayment calculations, and detection of potentially predatory lending practices, all in plain English.

## **Features**

_Document Analysis_: Upload loan documents and receive instant, clear explanations of complex terms
_Fairness Scoring_: Evaluate loan terms against industry standards to detect unfair practices
_Repayment Calculator_: Understand exact payments over the loan's life with detailed breakdowns
_Predatory Detection_: Identify hidden fees, unusual clauses, and potentially predatory practices
_Risk Assessment_: Comprehensive risk evaluation tools
_Loan Comparison_: Compare multiple loan options side by side
_PDF Generation_: Generate comparison reports in PDF format

## **Tech Stack**

_Frontend_: React 18 with TypeScript
_Build Tool_: Vite
_Styling_: Tailwind CSS with ShadCN UI components
_State Management_: React Query for server state
_Forms_: React Hook Form with Zod validation
_Backend_: Supabase (database and serverless functions)
_Charts_: Recharts for data visualization
_PDF Generation_: jsPDF with autoTable

## **Prerequisites**

Node.js (version 18 or higher)
npm, yarn, or bun package manager
Supabase account (for backend services)

## **Installation**

Clone the repository:

Install dependencies:

Set up environment variables:
Create a .env.local file in the root directory and add your Supabase configuration:

Start the development server:

Open http://localhost:5173 in your browser.

## **Available Scripts**

npm run dev - Start the development server
npm run build - Build the project for production
npm run build:dev - Build the project in development mode
npm run lint - Run ESLint for code linting
npm run preview - Preview the production build locally

## **Project Structure**

src/
├── app/                    # Main app layout
├── components/             # Reusable UI components
│   ├── ui/                # ShadCN UI components
│   └── ...                # Feature-specific components
├── contexts/              # React contexts (e.g., Language)
├── data/                  # Mock data and constants
├── hooks/                 # Custom React hooks
├── integrations/          # External service integrations
│   └── supabase/          # Supabase client and types
├── lib/                   # Utility libraries and API functions
├── pages/                 # Page components
└── utils/                 # Helper utilities

## **Contributing**

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

## **License**

This project is private and proprietary.

## **Support**

For support or questions, please contact the development team or create an issue in the repository.
