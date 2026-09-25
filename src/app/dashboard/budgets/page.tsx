"use client";

import { useMemo, useState } from "react";

import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Edit3,
  Gauge,
  Info,
  Loader2,
  Plus,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import FeatureComingSoon from "@/components/ui/FeatureComingSoon";

// ==================================================
// Types
// ==================================================

type BudgetCategory = {
  id: string;
  categoryName: string;
  budget: number;
  spent: number;
};

// ==================================================
// Hardcoded data
// ==================================================

const initialBudgets: BudgetCategory[] = [
  {
    id: "food",
    categoryName: "Food",
    budget: 15000,
    spent: 12000,
  },
  {
    id: "transport",
    categoryName: "Transport",
    budget: 7000,
    spent: 5000,
  },
  {
    id: "shopping",
    categoryName: "Shopping",
    budget: 8000,
    spent: 9000,
  },
  {
    id: "bills",
    categoryName: "Bills",
    budget: 12000,
    spent: 10000,
  },
  {
    id: "entertainment",
    categoryName: "Entertainment",
    budget: 5000,
    spent: 4000,
  },
  {
    id: "health",
    categoryName: "Health",
    budget: 3000,
    spent: 2000,
  },
];

const availableCategories = [
  {
    id: "food",
    name: "Food",
  },
  {
    id: "transport",
    name: "Transport",
  },
  {
    id: "shopping",
    name: "Shopping",
  },
  {
    id: "bills",
    name: "Bills",
  },
  {
    id: "entertainment",
    name: "Entertainment",
  },
  {
    id: "health",
    name: "Health",
  },
  {
    id: "education",
    name: "Education",
  },
  {
    id: "subscriptions",
    name: "Subscriptions",
  },
];

// ==================================================
// Helpers
// ==================================================

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
};

const getPercentage = (spent: number, budget: number) => {
  if (budget <= 0) return 0;

  return Math.min((spent / budget) * 100, 100);
};

const getRawPercentage = (spent: number, budget: number) => {
  if (budget <= 0) return 0;

  return (spent / budget) * 100;
};

// ==================================================
// Page
// ==================================================

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<BudgetCategory[]>(initialBudgets);

  const [selectedMonth, setSelectedMonth] = useState("2026-09");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("");

  const [budgetAmount, setBudgetAmount] = useState("");

  const [saving, setSaving] = useState(false);

  // -----------------------------------------------
  // Calculated values
  // -----------------------------------------------

  const totalBudget = useMemo(() => {
    return budgets.reduce((total, category) => total + category.budget, 0);
  }, [budgets]);

  const totalSpent = useMemo(() => {
    return budgets.reduce((total, category) => total + category.spent, 0);
  }, [budgets]);

  const remaining = totalBudget - totalSpent;

  const usagePercentage =
    totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Hardcoded for UI demonstration
  const daysRemaining = 6;

  const dailyAllowance =
    daysRemaining > 0 ? Math.max(remaining, 0) / daysRemaining : 0;

  const overBudgetCategories = budgets.filter(
    (category) => category.spent > category.budget,
  );

  const healthyCategories = budgets.filter(
    (category) => category.spent <= category.budget * 0.8,
  );

  // -----------------------------------------------
  // Save budget
  // -----------------------------------------------

  const handleSaveBudget = async () => {
    const amount = Number(budgetAmount);

    if (!selectedCategory || !Number.isFinite(amount) || amount <= 0) {
      return;
    }

    setSaving(true);

    // Simulating API request
    await new Promise((resolve) => setTimeout(resolve, 700));

    setBudgets((current) => {
      const existing = current.find((item) => item.id === selectedCategory);

      if (existing) {
        return current.map((item) =>
          item.id === selectedCategory
            ? {
                ...item,
                budget: amount,
              }
            : item,
        );
      }

      const category = availableCategories.find(
        (item) => item.id === selectedCategory,
      );

      if (!category) return current;

      return [
        ...current,
        {
          id: category.id,
          categoryName: category.name,
          budget: amount,
          spent: 0,
        },
      ];
    });

    setSaving(false);
    setDialogOpen(false);
    setSelectedCategory("");
    setBudgetAmount("");
  };

  // -----------------------------------------------
  // Open edit dialog
  // -----------------------------------------------

  const handleEditBudget = (category: BudgetCategory) => {
    setSelectedCategory(category.id);
    setBudgetAmount(category.budget.toString());
    setDialogOpen(true);
  };

  return (
    <main className="min-h-screen bg-black text-foreground">
      <FeatureComingSoon />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ==================================================
            Header
        ================================================== */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-3 py-1 text-xs font-medium text-violet-300">
              <Gauge className="h-3.5 w-3.5" />
              Spending plan
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Budget
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Plan your spending, stay within your limits, and understand where
              your money is going.
            </p>
          </div>

          {/* Add budget */}

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
              <Button className="bg-violet-600 hover:bg-violet-500">
                <Plus className="h-4 w-4" />
                Add budget
              </Button>
            </DialogTrigger>

            <DialogContent className="border-border bg-card">
              <DialogHeader>
                <DialogTitle>Set category budget</DialogTitle>

                <DialogDescription>
                  Choose a spending category and set your monthly spending
                  limit.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 py-2">
                <div className="space-y-2">
                  <Label>Category</Label>

                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => setSelectedCategory(value ?? "")}
                  >
                    <SelectTrigger className="bg-card">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>

                    <SelectContent>
                      {availableCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budgetAmount">Monthly budget</Label>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      ৳
                    </span>

                    <Input
                      id="budgetAmount"
                      type="number"
                      min="1"
                      placeholder="15000"
                      value={budgetAmount}
                      onChange={(event) => setBudgetAmount(event.target.value)}
                      className="bg-card pl-8"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-card"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  disabled={saving || !selectedCategory || !budgetAmount}
                  onClick={handleSaveBudget}
                  className="bg-violet-600 hover:bg-violet-500"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save budget"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* ==================================================
            Month selector
        ================================================== */}

        <div className="mb-6 flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
              <CalendarDays className="h-4 w-4 text-violet-400" />
            </div>

            <div>
              <p className="text-sm font-medium">Budget period</p>

              <p className="text-xs text-muted-foreground">
                Your monthly spending plan
              </p>
            </div>
          </div>

          <Select
            value={selectedMonth}
            onValueChange={(value) => {
              if (value !== null) setSelectedMonth(value);
            }}
          >
            <SelectTrigger className="w-40 bg-card">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="2026-07">July 2026</SelectItem>

              <SelectItem value="2026-08">August 2026</SelectItem>

              <SelectItem value="2026-09">September 2026</SelectItem>

              <SelectItem value="2026-10">October 2026</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ==================================================
            Overview
        ================================================== */}

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total budget"
            value={formatCurrency(totalBudget)}
            description="Planned spending"
            icon={<WalletCards className="h-5 w-5 text-violet-400" />}
          />

          <SummaryCard
            title="Spent"
            value={formatCurrency(totalSpent)}
            description={`${usagePercentage.toFixed(0)}% of budget used`}
            icon={<ArrowDownRight className="h-5 w-5 text-red-400" />}
          />

          <SummaryCard
            title="Remaining"
            value={formatCurrency(remaining)}
            description={remaining >= 0 ? "Still available" : "Budget exceeded"}
            icon={
              <CircleDollarSign
                className={`h-5 w-5 ${
                  remaining >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              />
            }
          />

          <SummaryCard
            title="Daily allowance"
            value={formatCurrency(dailyAllowance)}
            description={`${daysRemaining} days remaining`}
            icon={<TrendingUp className="h-5 w-5 text-cyan-400" />}
          />
        </section>

        {/* ==================================================
            Overall progress
        ================================================== */}

        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>September spending overview</CardTitle>

                <CardDescription>
                  How much of your monthly budget you have used.
                </CardDescription>
              </div>

              <Badge
                variant="outline"
                className={
                  usagePercentage > 100
                    ? "border-red-500/20 text-red-400"
                    : usagePercentage >= 80
                      ? "border-amber-500/20 text-amber-400"
                      : "border-emerald-500/20 text-emerald-400"
                }
              >
                {usagePercentage.toFixed(0)}% used
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="mb-3 flex items-end justify-between">
              <div>
                <p className="text-2xl font-semibold">
                  {formatCurrency(totalSpent)}
                </p>

                <p className="text-xs text-muted-foreground">
                  of {formatCurrency(totalBudget)}
                </p>
              </div>

              <p
                className={`text-sm font-medium ${
                  remaining >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {remaining >= 0
                  ? `${formatCurrency(remaining)} remaining`
                  : `${formatCurrency(Math.abs(remaining))} over budget`}
              </p>
            </div>

            <Progress value={Math.min(usagePercentage, 100)} className="h-3" />

            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>৳0</span>
              <span>{formatCurrency(totalBudget)}</span>
            </div>
          </CardContent>
        </Card>

        {/* ==================================================
            Budget categories
        ================================================== */}

        <section className="mb-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold">Category budgets</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Track how much you have spent in each category.
              </p>
            </div>

            <span className="text-xs text-muted-foreground">
              {budgets.length} categories
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {budgets.map((category) => (
              <BudgetCategoryCard
                key={category.id}
                category={category}
                onEdit={handleEditBudget}
              />
            ))}
          </div>
        </section>

        {/* ==================================================
            Insights
        ================================================== */}

        <section className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Budget health */}

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-violet-400" />
                Budget insights
              </CardTitle>

              <CardDescription>
                A quick overview of where your budget needs attention.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {overBudgetCategories.length > 0 && (
                <Insight
                  icon={<AlertTriangle className="h-4 w-4 text-red-400" />}
                  title="Over budget"
                  description={`${overBudgetCategories
                    .map((category) => category.categoryName)
                    .join(", ")} is currently above your planned limit.`}
                  variant="danger"
                />
              )}

              <Insight
                icon={<CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                title="Healthy categories"
                description={`${healthyCategories.length} categories are currently below 80% of their budget.`}
                variant="success"
              />

              <Insight
                icon={<Info className="h-4 w-4 text-cyan-400" />}
                title="Daily allowance"
                description={`You can spend around ${formatCurrency(
                  dailyAllowance,
                )} per remaining day to stay within your budget.`}
                variant="info"
              />
            </CardContent>
          </Card>

          {/* Budget tips */}

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CircleDollarSign className="h-5 w-5 text-cyan-400" />
                Budget tips
              </CardTitle>

              <CardDescription>
                Simple ways to make your budget more useful.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Tip
                number="01"
                title="Set realistic limits"
                description="Use your previous spending as a starting point instead of setting arbitrary limits."
              />

              <Tip
                number="02"
                title="Watch high-usage categories"
                description="Categories approaching 80% deserve attention before they exceed the limit."
              />

              <Tip
                number="03"
                title="Review at the end of each month"
                description="Adjust next month's limits based on your actual spending patterns."
              />
            </CardContent>
          </Card>
        </section>

        {/* ==================================================
            Empty / unbudgeted categories
        ================================================== */}

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Categories without a budget</CardTitle>

            <CardDescription>
              These categories exist in your account but do not currently have a
              monthly spending limit.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-wrap gap-2">
              {availableCategories
                .filter(
                  (category) =>
                    !budgets.some((budget) => budget.id === category.id),
                )
                .map((category) => (
                  <Badge
                    key={category.id}
                    variant="outline"
                    className="border-border px-3 py-1.5 text-muted-foreground"
                  >
                    {category.name}
                  </Badge>
                ))}

              {availableCategories.every((category) =>
                budgets.some((budget) => budget.id === category.id),
              ) && (
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  All available categories have a budget.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

// ==================================================
// Summary card
// ==================================================

type SummaryCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
};

function SummaryCard({ title, value, description, icon }: SummaryCardProps) {
  return (
    <Card className="border-border bg-card transition hover:border-violet-500/20">
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{title}</p>

          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background">
            {icon}
          </div>
        </div>

        <p className="text-2xl font-semibold tracking-tight">{value}</p>

        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

// ==================================================
// Budget category card
// ==================================================

type BudgetCategoryCardProps = {
  category: BudgetCategory;
  onEdit: (category: BudgetCategory) => void;
};

function BudgetCategoryCard({ category, onEdit }: BudgetCategoryCardProps) {
  const percentage = getRawPercentage(category.spent, category.budget);

  const progress = getPercentage(category.spent, category.budget);

  const remaining = category.budget - category.spent;

  const isOverBudget = remaining < 0;

  const isWarning = !isOverBudget && percentage >= 80;

  return (
    <Card className="border-border bg-card transition hover:border-violet-500/20">
      <CardContent className="p-5">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{category.categoryName}</h3>

              {isOverBudget && (
                <Badge className="border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/10">
                  Over budget
                </Badge>
              )}

              {!isOverBudget && isWarning && (
                <Badge className="border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500/10">
                  Near limit
                </Badge>
              )}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              {formatCurrency(category.spent)} spent of{" "}
              {formatCurrency(category.budget)}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(category)}
            className="text-muted-foreground hover:bg-violet-500/10 hover:text-violet-400"
          >
            <Edit3 className="h-4 w-4" />
            <span className="sr-only">Edit {category.categoryName} budget</span>
          </Button>
        </div>

        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Usage</span>

          <span
            className={
              isOverBudget
                ? "font-medium text-red-400"
                : isWarning
                  ? "font-medium text-amber-400"
                  : "font-medium text-foreground"
            }
          >
            {percentage.toFixed(0)}%
          </span>
        </div>

        <Progress value={progress} className="h-2" />

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {isOverBudget ? "Exceeded by" : "Remaining"}
          </span>

          <span
            className={`text-sm font-medium ${
              isOverBudget ? "text-red-400" : "text-emerald-400"
            }`}
          >
            {formatCurrency(Math.abs(remaining))}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ==================================================
// Insight
// ==================================================

type InsightProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant: "danger" | "success" | "info";
};

function Insight({ icon, title, description, variant }: InsightProps) {
  const background =
    variant === "danger"
      ? "border-red-500/10 bg-red-500/5"
      : variant === "success"
        ? "border-emerald-500/10 bg-emerald-500/5"
        : "border-cyan-500/10 bg-cyan-500/5";

  return (
    <div className={`rounded-xl border p-4 ${background}`}>
      <div className="flex gap-3">
        <div className="mt-0.5">{icon}</div>

        <div>
          <p className="text-sm font-medium">{title}</p>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

// ==================================================
// Tip
// ==================================================

type TipProps = {
  number: string;
  title: string;
  description: string;
};

function Tip({ number, title, description }: TipProps) {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-medium text-violet-400">
        {number}
      </div>

      <div>
        <p className="text-sm font-medium">{title}</p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
