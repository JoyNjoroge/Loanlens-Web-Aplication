// components/FinancialInputs.tsx
import { useState } from 'react';
import { DollarSign, CreditCard, Home, TrendingUp } from 'lucide-react';

interface FinancialInputsProps {
  data: {
    salary: number;
    existingDebt: number;
    monthlyExpenses: number;
    loanAmount: number;
  };
  onChange: (data: any) => void;
  disabled?: boolean;
}

const FinancialInputs = ({ data, onChange, disabled = false }: FinancialInputsProps) => {
  const [localData, setLocalData] = useState(data);

  const handleChange = (field: string, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    const newData = { ...localData, [field]: numValue };
    setLocalData(newData);
    onChange(newData);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const inputClasses = "w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Annual Salary
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="number"
            value={localData.salary || ''}
            onChange={(e) => handleChange('salary', e.target.value)}
            disabled={disabled}
            className={inputClasses}
            placeholder="50000"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          ≈ {formatCurrency((localData.salary || 0) / 12)}/month
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Existing Debt
        </label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="number"
            value={localData.existingDebt || ''}
            onChange={(e) => handleChange('existingDebt', e.target.value)}
            disabled={disabled}
            className={inputClasses}
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Monthly Expenses
        </label>
        <div className="relative">
          <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="number"
            value={localData.monthlyExpenses || ''}
            onChange={(e) => handleChange('monthlyExpenses', e.target.value)}
            disabled={disabled}
            className={inputClasses}
            placeholder="2000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Desired Loan Amount
        </label>
        <div className="relative">
          <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="number"
            value={localData.loanAmount || ''}
            onChange={(e) => handleChange('loanAmount', e.target.value)}
            disabled={disabled}
            className={inputClasses}
            placeholder="25000"
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialInputs;