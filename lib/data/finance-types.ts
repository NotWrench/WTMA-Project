export interface TransactionRowDTO {
  amountPaise: number;
  category: string;
  dateDisplay: string;
  description: string;
  id: string;
  merchant: string;
  status: "completed" | "pending" | "scheduled";
}

export interface ExpenseRowDTO {
  amountPaise: number;
  category: string;
  id: string;
  merchant: string;
  notes: string;
  occurredAtIso: string;
  paymentMethod: string | null;
  status: "completed" | "pending" | "scheduled";
}

export interface CategoryBreakdownItem {
  amountPaise: number;
  colorClassName: string;
  label: string;
}

export interface TrendPoint {
  label: string;
  spendingPaise: number;
}

export interface DashboardSnapshot {
  budgetProgressPercent: number;
  categoryBreakdown: CategoryBreakdownItem[];
  monthlyTrend: TrendPoint[];
  previousMonthSpendingPaise: number;
  recentTransactions: TransactionRowDTO[];
  remainingBudgetPaise: number;
  topCategory: { name: string; sharePercent: number } | null;
  totalSpendingPaiseCurrentMonth: number;
  weeklyTrend: TrendPoint[];
}

export interface BudgetCategoryRowDTO {
  allocatedPaise: number;
  id: string;
  label: string;
  spentPaise: number;
  toneClassName: string;
}

export interface BudgetPageData {
  categories: BudgetCategoryRowDTO[];
  monthlyPulse: { month: string; utilization: number }[];
  totalAllocatedPaise: number;
  totalSpentPaise: number;
}

export interface ReportsPageData {
  categoryShare: { label: string; percent: number; amountPaise: number }[];
  netSavingsDeltaPercent: number | null;
  netSavingsPaise: number;
  rangeLabel: string;
  spendingVsBudget: { month: string; spending: number; budget: number }[];
  topSpendingCategories: {
    title: string;
    subtitle: string;
    amountPaise: number;
    delta: string;
    deltaVariant:
      | "warning-light"
      | "success-light"
      | "primary-light"
      | "destructive-light";
  }[];
  totalExpensesPaise: number;
  totalIncomeDisplay: "not_tracked";
}

export interface SettingsExportRow {
  amountRupees: number;
  category: string;
  date: string;
  merchant: string;
  status: string;
}

export interface ExpensesPageData {
  expenses: ExpenseRowDTO[];
  insightTopCategory: string | null;
  monthlySavingsPaise: number;
  pendingCount: number;
  totalSpentMonthPaise: number;
  upcomingBill: {
    amountPaise: number;
    dueLabel: string;
    merchant: string;
  } | null;
}
