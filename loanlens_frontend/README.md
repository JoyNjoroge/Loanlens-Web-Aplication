# LoanLens 🔍

**AI-Powered Loan Document Analysis Platform**

LoanLens helps borrowers understand their loan documents by using artificial intelligence to analyze terms, identify predatory practices, and compare multiple loan offers side-by-side.

![LoanLens](https://img.shields.io/badge/LoanLens-AI%20Loan%20Analysis-0ea5e9?style=for-the-badge)

---

## ✨ Features

- **📄 Document Upload** - Upload loan documents in PDF, DOC, DOCX, or image formats
- **🤖 AI-Powered Analysis** - Automated extraction and analysis of loan terms using Gemini AI
- **🔍 OCR Support** - Extract text from scanned documents and image-based PDFs
- **⚠️ Predatory Term Detection** - Identify potentially harmful loan conditions
- **📊 Fairness Scoring** - Get an objective score on how fair your loan terms are
- **🔄 Loan Comparison** - Compare multiple loan offers side-by-side
- **📥 PDF Reports** - Download detailed comparison reports

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library for building component-based interfaces |
| **TypeScript** | Type-safe JavaScript for better developer experience |
| **Vite** | Next-generation frontend build tool |
| **Tailwind CSS** | Utility-first CSS framework |
| **shadcn/ui** | High-quality, accessible UI components |
| **React Router** | Client-side routing |
| **TanStack Query** | Server state management and caching |
| **Recharts** | Charting library for data visualization |
| **Framer Motion** | Animation library (via Tailwind Animate) |

### Backend (Lovable Cloud)
| Technology | Purpose |
|------------|---------|
| **Supabase Edge Functions** | Serverless backend functions |
| **Lovable AI (Gemini 2.5 Flash)** | Document analysis and OCR |
| **Deno** | Runtime for edge functions |

### PDF Generation
| Technology | Purpose |
|------------|---------|
| **jsPDF** | PDF document generation |
| **jsPDF-AutoTable** | Table formatting in PDFs |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Lovable account (for backend features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

---

## 📁 Project Structure

```
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── FileUpload.tsx   # Document upload component
│   │   ├── ResultCard.tsx   # Analysis result display
│   │   └── ...
│   ├── hooks/               # Custom React hooks
│   │   ├── useLoanAnalysis.ts
│   │   └── useComparisonAnalysis.ts
│   ├── lib/                 # Utility functions
│   │   ├── loanAnalysisApi.ts
│   │   └── generateComparisonPDF.ts
│   ├── pages/               # Route pages
│   │   ├── Home.tsx
│   │   ├── Upload.tsx
│   │   ├── Results.tsx
│   │   ├── Compare.tsx
│   │   └── ...
│   └── integrations/        # External service integrations
│       └── supabase/
├── supabase/
│   └── functions/           # Edge functions
│       └── analyze-loan/    # AI document analysis
└── public/                  # Static assets
```

---

## 🔧 Configuration

### Environment Variables

The following environment variables are automatically configured by Lovable Cloud:

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Backend API URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public API key |
| `VITE_SUPABASE_PROJECT_ID` | Project identifier |

---

## 📖 How It Works

1. **Upload** - User uploads a loan document (PDF, image, or Word doc)
2. **Extract** - System extracts text using direct parsing or OCR for images
3. **Analyze** - AI analyzes the document for key terms and conditions
4. **Score** - System calculates fairness scores and identifies risks
5. **Report** - User receives detailed analysis with actionable insights

---

## 🎨 Design System

LoanLens uses a custom design system built on Tailwind CSS with:

- **Primary Color**: Blue (`hsl(200, 100%, 45%)`)
- **Semantic Tokens**: Consistent theming via CSS variables
- **Dark Mode Ready**: Full dark mode support
- **Responsive**: Mobile-first design approach

---

## 📄 License

This project is private and proprietary.

---

## 🤝 Contributing

This project is managed through [Lovable](https://lovable.dev). To contribute:

1. Make changes through the Lovable editor, or
2. Clone the repo, make changes, and push to trigger sync

---

## 📞 Support

For questions or issues, please contact the project maintainers.

---

Built with ❤️ using [Lovable](https://lovable.dev)
