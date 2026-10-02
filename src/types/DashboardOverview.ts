export type recentTransaction = {
  _id: string;
  amount: number;
  note: string;
  date: string;
  currency?: string;

  categoryId: {
    _id: string;
    categoryName: string;
    type: "income" | "spending";
  };
};

export type DashboardCategory = {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
};

export type DashboardTrendItem = {
  date: string;
  income: number;
  spending: number;
  transactionCount: number;
};

export type lifetimeSummary = {
  totalIncome: number;
  totalSpending: number;
  netIncome: number;
  transactionCount: number;
};

export type weeklyAndMonthlySummary = {
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalSpending: number;
  netIncome: number;
  savingsRate: number;
  transactionCount: number;
};



export type DashboardOverview = {
  lifetime: lifetimeSummary;

  weekly: weeklyAndMonthlySummary;

  monthly: weeklyAndMonthlySummary;

  topSpendingCategory: DashboardCategory | null;

  spendingByCategory: DashboardCategory[];

  trend: DashboardTrendItem[];

  recentTransactions: recentTransaction[];
};


export interface DashboardOverviewResponse {
    statusCode: number;
    data: DashboardOverview;
    message: string;
    success: boolean;
}

export interface DashboardOverviewType {
  data: {
    lifeTime: {
      totalIncome: number;
      totalSpending: number;
      netIncome: number;
      transactionCount: number;
    };

    weekly: {
      startDate: string;
      endDate: string;
      totalIncome: number;
      totalSpending: number;
      netIncome: number;
      savingsRate: number;
      transactionCount: number;
    };
    monthly: {
      startDate: string;
      endDate: string;
      totalIncome: number;
      totalSpending: number;
      netIncome: number;
      savingsRate: number;
      transactionCount: number;
    };
    topSpendingCategory: {
      categoryId: string;
      categoryName: string;
      amount: number;
      percentage: number;
    };
    spendingByCategory: {
      categoryId: string;
      categoryName: string;
      amount: number;
      percentage: number;
    }[];
    trend: {
      date: string;
      income: number;
      spending: number;
      transactionCount: number;
    };
    recentTransactions: {
      _id: string;
      userId: string;
      categoryId: {
        _id: string;
        categoryName: string;
        type: "income" | "spending";
      };
      type: "income" | "spending";
      amount: number;
      currency: string;
      date: string;
      note: string;
      createdAt: string;
      updatedAt: string;
    }[];
  };
}