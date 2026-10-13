"use client";
import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Info,
  Lightbulb,
  PiggyBank,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api/client";
import {
  type TrendRange,
  ApiCategory,
  SpendingCategory,
  MonthlyData,
  FinancialReport,
} from "@/types/ReportAnalytics";
import {
  money,
  compactMoney,
  percentage,
  getApiErrorMessage,
} from "@/lib/currency";
// ==================================================
// Category presentation
// Colors and guidance are UI presentation, not analytics data.
// ==================================================

const categoryColors: Record<string, string> = {
  housing: "bg-violet-400",
  rent: "bg-violet-400",
  food: "bg-sky-400",
  groceries: "bg-sky-400",
  transport: "bg-emerald-400",
  transportation: "bg-emerald-400",
  shopping: "bg-amber-400",
  bills: "bg-rose-400",
  health: "bg-teal-400",
  healthcare: "bg-teal-400",
  entertainment: "bg-orange-400",
  subscriptions: "bg-indigo-400",
  salary: "bg-emerald-400",
  freelance: "bg-cyan-400",
  other: "bg-zinc-400",
  uncategorized: "bg-zinc-400",
};

const categoryDescriptions: Record<string, string> = {
  housing:
    "Housing is often one of the larger ongoing costs. Review which parts are fixed and which, if any, are flexible before deciding to change anything.",
  food: "Food can include essentials as well as meals outside the home. Reviewing the transactions can help you understand the mix without assuming that spending more is automatically bad.",
  transport:
    "Transport spending can reflect commuting and everyday mobility. Look for patterns that fit your routine before considering changes.",
  shopping:
    "Compare shopping purchases with your priorities. Separating planned purchases from spontaneous ones can make this category easier to understand.",
  bills:
    "Bills are often recurring commitments. Reviewing subscriptions, tariffs, or unusual changes occasionally can help you stay informed.",
  health:
    "Health spending can be essential. A larger amount here is not automatically a problem; personal needs and circumstances matter.",
  entertainment:
    "Entertainment is part of enjoying life. The useful question is whether this spending matches what matters to you.",
  subscriptions:
    "Recurring charges can be easy to overlook. A periodic review can help identify services you no longer use.",
  other:
    "A broad category can hide useful patterns. Categorizing a few of the largest transactions may make future reports more informative.",
  uncategorized:
    "Some transactions do not have a matching category. Assigning categories where possible can make future reports more useful.",
};

function categoryPresentation(category: ApiCategory): SpendingCategory {
  const id = category.id ?? "uncategorized";
  const key = category.name.trim().toLowerCase();

  return {
    ...category,
    id,
    color: categoryColors[key] ?? "bg-zinc-400",
    description:
      categoryDescriptions[key] ??
      "Review the transactions in this category to understand what makes up the total. A higher amount is not automatically a problem; context and your priorities matter.",
  };
}
export default function ReportsPage() {
  const [trendRange, setTrendRange] = useState<TrendRange>("12months");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");

  const {
    data: report,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<FinancialReport>({
    queryKey: ["financial-reports", trendRange],
    queryFn: async () => {
      const response = await api.get("/analytics/fullReport", {
        params: { range: trendRange },
      });
      // ApiResponse shape: { statusCode, data: report, message }
      const payload = response.data?.data;
      console.log("API response payload:", payload);
      if (!payload?.overview || !payload?.trend) {
        throw new Error("The reports API returned an unexpected response.");
      }

      return payload as FinancialReport;
    },
    staleTime: 60_000,
    retry: 1,
  });

  const categories = (report?.categories ?? []).map(categoryPresentation);
  const overview = report?.overview ?? {
    totalIncome: 0,
    totalSpending: 0,
    netCashFlow: 0,
    incomeRemainingRate: 0,
    totalIncomeTransactions: 0,
    totalSpendingTransactions: 0,
    totalTransactions: 0,
  };
  const trend = report?.trend ?? {
    range: trendRange,
    months: [],
    totalIncome: 0,
    totalSpending: 0,
    netCashFlow: 0,
  };
  const currency = report?.currency ?? "BDT";
  const monthlyData = trend?.months ?? [];

  const totalIncome = overview?.totalIncome ?? 0;
  const totalSpending = overview?.totalSpending ?? 0;
  const netCashFlow = overview?.netCashFlow ?? 0;
  const remainingRate = overview?.incomeRemainingRate ?? 0;
  const totalTransactions = overview?.totalSpendingTransactions ?? 0;

  const sortedCategories = [...categories].sort((a, b) => b.amount - a.amount);
  const topCategory = sortedCategories[0] ?? null;
  const secondCategory = sortedCategories[1] ?? null;
  const activeCategory = categories.find(
    (category) => category.id === selectedCategoryId,
  );

  const trendIncome = trend?.totalIncome ?? 0;
  const trendSpending = trend?.totalSpending ?? 0;

  const spendingShare = (amount: number) =>
    totalSpending > 0 ? (amount / totalSpending) * 100 : 0;

  const focusAmount = activeCategory?.amount ?? totalSpending;
  const focusTransactions = activeCategory?.transactions ?? totalTransactions;
  const focusShare = activeCategory
    ? activeCategory.sharePercentage
    : totalSpending > 0
      ? 100
      : 0;
  const averageTransaction =
    focusTransactions > 0 ? focusAmount / focusTransactions : 0;

  const combinedTopTwoShare =
    topCategory && secondCategory
      ? spendingShare(topCategory.amount) + spendingShare(secondCategory.amount)
      : topCategory
        ? spendingShare(topCategory.amount)
        : 0;

  const everyTrendMonthPositive =
    monthlyData.length > 0 &&
    monthlyData.every((month) => month.netCashFlow >= 0);

  // Keep the same dark FinX design while requests are in progress.
  if (isLoading) {
    return (
      <main className="min-h-screen bg-black text-foreground">
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-3 py-1 text-xs font-medium text-violet-300">
              <BarChart3 className="size-3.5" />
              Financial intelligence
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Your money, in perspective.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Loading your financial patterns and spending insights...
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[0, 1, 2, 3].map((item) => (
              <Card key={item} className="border-border bg-card">
                <CardContent className="space-y-4 p-5">
                  <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                  <div className="h-8 w-36 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-full animate-pulse rounded bg-muted" />
                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="border-border bg-card">
            <CardContent className="flex min-h-56 items-center justify-center p-6">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="size-4 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
                Loading reports from FinX...
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (isError || !report) {
    return (
      <main className="min-h-screen bg-black text-foreground">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-3 py-1 text-xs font-medium text-violet-300">
            <BarChart3 className="size-3.5" />
            Financial intelligence
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Your money, in perspective.
          </h1>
          <Card className="mt-6 border-border bg-card">
            <CardContent className="flex flex-col items-start gap-4 p-6 sm:p-8">
              <div className="flex size-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <Info className="size-5" />
              </div>
              <div>
                <h2 className="font-semibold">Reports couldn't be loaded</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {getApiErrorMessage(error)}
                </p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Make sure you are signed in and the backend route GET
                  /api/v1/reports/overview is mounted.
                </p>
              </div>
              <Button
                type="button"
                onClick={() => void refetch()}
                disabled={isFetching}
                className="bg-violet-600 hover:bg-violet-500"
              >
                {isFetching ? "Retrying..." : "Try again"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-foreground">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <section>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-3 py-1 text-xs font-medium text-violet-300">
            <BarChart3 className="size-3.5" />
            Financial intelligence
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Your money, in perspective.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Understand your financial patterns, see where your money goes,
                and make decisions that support the life you want to build.
              </p>
            </div>

            <Badge
              variant="outline"
              className="w-fit gap-2 border-border bg-card px-3 py-2 text-xs"
            >
              <CalendarDays className="size-3.5 text-violet-400" />
              All-time overview
            </Badge>
          </div>
        </section>

        {/* Positive or neutral cash-flow message */}
        <Card className="overflow-hidden border-violet-500/20 bg-card">
          <div className="h-1 bg-violet-500/70" />
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-4">
              <div
                className={`flex size-11 shrink-0 items-center justify-center rounded-xl border ${netCashFlow >= 0 ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border-amber-500/20 bg-amber-500/10 text-amber-400"}`}
              >
                {netCashFlow >= 0 ? (
                  <Sparkles className="size-5" />
                ) : (
                  <TrendingDown className="size-5" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {!overview.totalTransactions
                    ? "Your financial picture starts here"
                    : netCashFlow >= 0
                      ? "A positive pattern in your recorded finances"
                      : "A useful moment to review your cash flow"}
                </p>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                  {!overview.totalTransactions ? (
                    "No transactions are recorded in this currency yet. Add income and spending to start building your financial picture."
                  ) : netCashFlow >= 0 ? (
                    <>
                      Your recorded income exceeds your recorded spending by{" "}
                      <span className="font-semibold text-emerald-400">
                        {money(netCashFlow, currency)}
                      </span>
                      . That gives you a useful starting point for planning
                      savings and future goals.
                    </>
                  ) : (
                    <>
                      Your recorded spending exceeds income by{" "}
                      <span className="font-semibold text-amber-400">
                        {money(Math.abs(netCashFlow), currency)}
                      </span>
                      . Reviewing timing, one-off costs, and your recent
                      transactions can help put this number in context.
                    </>
                  )}
                </p>
              </div>
            </div>
            <Badge
              className={`w-fit shrink-0 border ${netCashFlow >= 0 ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/10" : "border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500/10"}`}
            >
              {netCashFlow >= 0 ? (
                <CheckCircle2 className="mr-1.5 size-3.5" />
              ) : (
                <Info className="mr-1.5 size-3.5" />
              )}
              {netCashFlow >= 0 ? "Positive net cash flow" : "Cash-flow review"}
            </Badge>
          </CardContent>
        </Card>

        {/* All-time metrics */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Your financial overview</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Across all recorded transactions, not just the current month.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Info className="size-3.5" />
              All-time totals · {currency}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Total income"
              value={money(totalIncome, currency)}
              description={`${overview.totalIncomeTransactions.toLocaleString()} recorded income transactions`}
              icon={<ArrowDownRight className="size-5" />}
              iconClass="bg-emerald-500/10 text-emerald-400"
              indicator="Income"
              indicatorClass="text-emerald-400"
            />
            <MetricCard
              title="Total spending"
              value={money(totalSpending, currency)}
              description={`${overview.totalSpendingTransactions.toLocaleString()} recorded spending transactions`}
              icon={<ArrowUpRight className="size-5" />}
              iconClass="bg-violet-500/10 text-violet-400"
              indicator="Spending"
              indicatorClass="text-violet-300"
            />
            <MetricCard
              title="Net cash flow"
              value={money(netCashFlow, currency)}
              description="Income minus recorded spending"
              icon={<Wallet className="size-5" />}
              iconClass="bg-sky-500/10 text-sky-400"
              indicator={netCashFlow >= 0 ? "Positive" : "Negative"}
              indicatorClass={
                netCashFlow >= 0 ? "text-emerald-400" : "text-amber-400"
              }
            />
            <MetricCard
              title="Income remaining"
              value={percentage(remainingRate)}
              description="Share of income left after recorded spending"
              icon={<PiggyBank className="size-5" />}
              iconClass="bg-amber-500/10 text-amber-400"
              indicator="All time"
              indicatorClass="text-amber-300"
            />
          </div>

          <p className="text-xs leading-5 text-muted-foreground">
            Net cash flow is based only on recorded income and spending. It is
            not the same as your bank balance or total savings if you have
            untracked transactions. Reports are calculated in {currency};
            transactions in other currencies are not converted automatically.
          </p>
        </section>

        {/* Trend + category spotlight */}
        <section className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-black text-violet-400">
                      <TrendingUp className="size-4" />
                    </div>
                    <CardTitle className="text-base">
                      Income vs. spending
                    </CardTitle>
                  </div>
                  <CardDescription className="mt-2">
                    Follow your money in and out over time.
                  </CardDescription>
                </div>
                <Select
                  value={trendRange}
                  onValueChange={(value) => {
                    if (value === "6months" || value === "12months") {
                      setTrendRange(value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full bg-black sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6months">Last 6 months</SelectItem>
                    <SelectItem value="12months">Last 12 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-black p-3">
                  <p className="text-xs text-muted-foreground">
                    Income in this view
                  </p>
                  <p className="mt-1 text-lg font-semibold text-emerald-400">
                    {compactMoney(trendIncome, currency)}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-black p-3">
                  <p className="text-xs text-muted-foreground">
                    Spending in this view
                  </p>
                  <p className="mt-1 text-lg font-semibold text-violet-300">
                    {compactMoney(trendSpending, currency)}
                  </p>
                </div>
              </div>

              <CashFlowChart data={monthlyData} currency={currency} />

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-emerald-400" />
                  Income
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-violet-400" />
                  Spending
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${everyTrendMonthPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-violet-500/10 text-violet-300"}`}
                >
                  {everyTrendMonthPositive ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <Info className="size-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {monthlyData.length === 0
                      ? "No monthly activity to display"
                      : everyTrendMonthPositive
                        ? "Income stayed above spending in this view"
                        : "Your monthly cash flow varies"}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {monthlyData.length === 0
                      ? "Transactions will appear here once they are recorded."
                      : everyTrendMonthPositive
                        ? `Across these ${monthlyData.length} months, recorded income was at least as high as spending each month. The difference can support goals you choose.`
                        : "Look at the months where spending was higher than income and consider whether one-off expenses, timing, or missing transactions explain the difference."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category spotlight */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-black text-violet-400">
                  <Target className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-base">
                    Category spotlight
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Explore one part of your spending history.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="category-focus"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Focus category
                </label>
                <Select
                  value={selectedCategoryId}
                  onValueChange={(value) => {
                    if (value) setSelectedCategoryId(value);
                  }}
                >
                  <SelectTrigger id="category-focus" className="bg-black">
                    <SelectValue placeholder="Choose category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All spending</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
                <p className="text-xs text-muted-foreground">
                  {activeCategory
                    ? `${activeCategory.name} · all time`
                    : "All-time spending"}
                </p>
                <p className="mt-2 wrap-break-word text-3xl font-semibold tracking-tight">
                  {money(focusAmount, currency)}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <Badge
                    variant="outline"
                    className="border-violet-500/20 text-violet-300"
                  >
                    {percentage(focusShare)} of spending
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {focusTransactions.toLocaleString()} transactions
                  </span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-black">
                  <div
                    className="h-full rounded-full bg-violet-400 transition-all duration-300"
                    style={{
                      width: `${Math.min(Math.max(focusShare, 0), 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-black p-3">
                  <p className="text-xs text-muted-foreground">
                    Average transaction
                  </p>
                  <p className="mt-2 wrap-break-word text-sm font-semibold">
                    {money(averageTransaction, currency)}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-black p-3">
                  <p className="text-xs text-muted-foreground">Category rank</p>
                  <p className="mt-2 text-sm font-semibold">
                    {activeCategory
                      ? `#${sortedCategories.findIndex((item) => item.id === activeCategory.id) + 1}`
                      : categories.length > 0
                        ? "All categories"
                        : "No data"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                <Info className="mt-0.5 size-3.5 shrink-0" />
                <p>
                  The focus filter changes this category summary. The headline
                  financial totals remain all-time totals for your whole
                  account.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Spending by category */}
        <section>
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-black text-violet-400">
                    <BarChart3 className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      Where your money goes
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Your all-time spending, ranked by category. Select any
                      category for a closer look.
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="w-fit border-border">
                  {categories.length} categories
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              {sortedCategories.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-black p-8 text-center">
                  <BarChart3 className="mx-auto size-8 text-muted-foreground" />
                  <p className="mt-3 text-sm font-medium">
                    No spending categories yet
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Once you record spending transactions, your category
                    breakdown will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
                  {/* Ranked category bars */}
                  <div className="space-y-2">
                    {sortedCategories.map((category, index) => {
                      const share = spendingShare(category.amount);
                      const selected = selectedCategoryId === category.id;
                      const maxCategoryAmount = topCategory?.amount ?? 0;
                      const barWidth =
                        maxCategoryAmount > 0
                          ? (category.amount / maxCategoryAmount) * 100
                          : 0;

                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setSelectedCategoryId(category.id)}
                          aria-pressed={selected}
                          className={`w-full rounded-xl border p-3 text-left transition ${selected ? "border-violet-500/30 bg-violet-500/5" : "border-transparent hover:border-border hover:bg-black/70"}`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <span className="w-5 shrink-0 text-xs tabular-nums text-muted-foreground">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <span
                                className={`size-2.5 shrink-0 rounded-full ${category.color}`}
                              />
                              <span className="truncate text-sm font-medium">
                                {category.name}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium tabular-nums">
                                {money(category.amount, currency)}
                              </p>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {percentage(share)}
                              </p>
                            </div>
                          </div>
                          <div className="ml-8 mt-3 h-1.5 overflow-hidden rounded-full bg-black">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${category.color}`}
                              style={{
                                width: `${barWidth}%`,
                                opacity: selected ? 1 : 0.75,
                              }}
                            />
                          </div>
                          <div className="ml-8 mt-2 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {category.transactions.toLocaleString()}{" "}
                              transactions
                            </span>
                            {selected && (
                              <span className="flex items-center gap-1 text-xs text-violet-300">
                                Selected
                                <CheckCircle2 className="size-3.5" />
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Category insight */}
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-border bg-black p-5">
                      <div className="flex items-center gap-2 text-violet-300">
                        <Lightbulb className="size-4" />
                        <span className="text-xs font-medium">
                          Understanding this category
                        </span>
                      </div>
                      <h3 className="mt-4 text-xl font-semibold">
                        {activeCategory?.name ??
                          topCategory?.name ??
                          "Spending"}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {activeCategory?.description ??
                          topCategory?.description ??
                          "Record spending transactions to see category insights here."}
                      </p>
                      <Separator className="my-4" />
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Share of spending
                          </p>
                          <p className="mt-1 text-lg font-semibold">
                            {percentage(focusShare)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Average transaction
                          </p>
                          <p className="mt-1 text-lg font-semibold">
                            {money(averageTransaction, currency)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
                      <div className="flex items-center gap-2">
                        <Target className="size-4 text-violet-300" />
                        <p className="text-sm font-medium">
                          A useful next step
                        </p>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {activeCategory
                          ? `Review a few of your largest ${activeCategory.name.toLowerCase()} transactions. Understanding what they were for can be more useful than simply trying to spend less.`
                          : "Choose a category to understand its contribution to your overall spending."}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-4 gap-2 border-border bg-black"
                        onClick={() =>
                          setSelectedCategoryId(
                            selectedCategoryId === "all"
                              ? (topCategory?.id ?? "all")
                              : "all",
                          )
                        }
                      >
                        {selectedCategoryId === "all"
                          ? `Explore ${topCategory?.name ?? "top category"}`
                          : "Show all spending"}
                        <ArrowRight className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Financial insights */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Insights worth noticing</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Patterns can help you make informed choices. They are not a score
              of how well you manage money.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="border-border bg-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <PiggyBank className="size-5" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/20 text-emerald-400"
                  >
                    {netCashFlow >= 0 ? "Positive signal" : "Cash-flow signal"}
                  </Badge>
                </div>
                <h3 className="mt-4 text-base font-semibold">
                  {netCashFlow >= 0
                    ? "There is room to plan ahead"
                    : "Start with understanding the gap"}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {overview.totalIncome > 0 ? (
                    <>
                      Your recorded income remaining after spending is{" "}
                      <span className="font-medium text-foreground">
                        {percentage(remainingRate)}
                      </span>
                      .{" "}
                      {netCashFlow >= 0
                        ? "You could decide how much to direct toward an emergency fund, a future purchase, or another goal."
                        : "Review the period and any one-off costs before deciding what, if anything, to change."}
                    </>
                  ) : (
                    "Once you have recorded income, FinX can show how much remains after your recorded spending."
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <BarChart3 className="size-5" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-border text-muted-foreground"
                  >
                    Spending pattern
                  </Badge>
                </div>
                <h3 className="mt-4 text-base font-semibold">
                  {topCategory
                    ? "Your spending has a clear concentration"
                    : "Your category pattern will appear here"}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {topCategory ? (
                    <>
                      {topCategory.name}
                      {secondCategory ? ` and ${secondCategory.name}` : ""}{" "}
                      together account for{" "}
                      <span className="font-medium text-foreground">
                        {percentage(combinedTopTwoShare)}
                      </span>{" "}
                      of recorded spending. Understanding larger categories may
                      be a useful starting point if you want to make changes.
                    </>
                  ) : (
                    "Record spending with categories to see which areas account for the largest share of your expenses."
                  )}
                </p>
                {topCategory && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-3 gap-2 px-0 text-violet-300 hover:text-violet-200"
                    onClick={() => setSelectedCategoryId(topCategory.id)}
                  >
                    Explore top category
                    <ArrowRight className="size-3.5" />
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                    <Target className="size-5" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-border text-muted-foreground"
                  >
                    Your next step
                  </Badge>
                </div>
                <h3 className="mt-4 text-base font-semibold">
                  Build clarity before changing habits
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Start by reviewing a few transactions in one category. A
                  small, informed adjustment that fits your priorities is more
                  useful than trying to cut everything at once.
                </p>
                {categories.some(
                  (category) => category.name.toLowerCase() === "subscriptions",
                ) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-3 gap-2 px-0 text-violet-300 hover:text-violet-200"
                    onClick={() => {
                      const subscriptions = categories.find(
                        (category) =>
                          category.name.toLowerCase() === "subscriptions",
                      );
                      if (subscriptions)
                        setSelectedCategoryId(subscriptions.id);
                    }}
                  >
                    Review subscriptions
                    <ArrowRight className="size-3.5" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Closing note */}
        <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 sm:p-5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
            <Info className="size-4" />
          </div>
          <div>
            <p className="text-sm font-medium">Your money, your priorities.</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Higher spending is not automatically bad, and lower spending is
              not automatically better. The purpose of these reports is to help
              you understand your patterns and decide what works for you.
              Figures are based on transactions recorded in FinX.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

// ==================================================
// Metric card
// ==================================================

function MetricCard({
  title,
  value,
  description,
  icon,
  iconClass,
  indicator,
  indicatorClass,
}: {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  iconClass: string;
  indicator: string;
  indicatorClass: string;
}) {
  return (
    <Card className="border-border bg-card transition-colors hover:border-border/80">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-3 wrap-break-word text-2xl font-semibold tracking-tight sm:text-3xl">
              {value}
            </p>
          </div>
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
          >
            {icon}
          </div>
        </div>
        <p className="mt-2 min-h-10 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
        <Separator className="my-3" />
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-medium ${indicatorClass}`}>
            {indicator}
          </span>
          <span className="text-xs text-muted-foreground">· All-time data</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ==================================================
// SVG cash-flow chart
// ==================================================

function CashFlowChart({
  data,
  currency,
}: {
  data: MonthlyData[];
  currency: string;
}) {
  const width = 760;
  const height = 270;
  const left = 54;
  const right = 744;
  const top = 24;
  const bottom = 210;

  const maxDataValue = data.length
    ? Math.max(...data.map((item) => Math.max(item.income, item.spending)))
    : 0;
  const step = maxDataValue > 1_000_000 ? 250_000 : 25_000;
  const maxValue =
    maxDataValue > 0 ? Math.ceil(maxDataValue / step) * step : step;
  const safeMax = Math.max(maxValue, 1);

  const xAt = (index: number) =>
    left + (index * (right - left)) / Math.max(data.length - 1, 1);

  const yAt = (value: number) => bottom - (value / safeMax) * (bottom - top);

  const incomePoints = data
    .map((item, index) => `${xAt(index)},${yAt(item.income)}`)
    .join(" ");

  const spendingPoints = data
    .map((item, index) => `${xAt(index)},${yAt(item.spending)}`)
    .join(" ");

  const gridValues = [safeMax, safeMax / 2, 0];

  if (data.length === 0) {
    return (
      <div className="flex min-h-52 items-center justify-center rounded-xl border border-dashed border-border bg-black p-6 text-center text-sm text-muted-foreground">
        No monthly trend data is available yet.
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full overflow-visible"
        role="img"
        aria-label={`Income and spending chart across ${data.length} months`}
      >
        <title>Monthly income and spending comparison</title>

        {gridValues.map((value, index) => {
          const y = yAt(value);
          return (
            <g key={index}>
              <line
                x1={left}
                x2={right}
                y1={y}
                y2={y}
                stroke="#3f3f46"
                strokeDasharray="4 5"
                strokeWidth="1"
              />
              <text
                x={left - 9}
                y={y + 4}
                fill="#a1a1aa"
                fontSize="10"
                textAnchor="end"
              >
                {new Intl.NumberFormat("en", {
                  notation: "compact",
                  maximumFractionDigits: 0,
                }).format(value)}
              </text>
            </g>
          );
        })}

        <polygon
          points={`${left},${bottom} ${spendingPoints} ${right},${bottom}`}
          fill="#a78bfa"
          fillOpacity="0.08"
        />

        <polyline
          points={incomePoints}
          fill="none"
          stroke="#34d399"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <polyline
          points={spendingPoints}
          fill="none"
          stroke="#a78bfa"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {data.map((item, index) => (
          <circle
            key={`income-${item.monthKey}`}
            cx={xAt(index)}
            cy={yAt(item.income)}
            r="3.5"
            fill="#34d399"
            stroke="#09090b"
            strokeWidth="1.5"
          >
            <title>{`${item.month} income: ${money(item.income, currency)}`}</title>
          </circle>
        ))}

        {data.map((item, index) => (
          <circle
            key={`spending-${item.monthKey}`}
            cx={xAt(index)}
            cy={yAt(item.spending)}
            r="3.5"
            fill="#a78bfa"
            stroke="#09090b"
            strokeWidth="1.5"
          >
            <title>{`${item.month} spending: ${money(item.spending, currency)}`}</title>
          </circle>
        ))}

        {data.map((item, index) => {
          const showLabel =
            data.length <= 6 || index % 2 === 0 || index === data.length - 1;
          if (!showLabel) return null;

          return (
            <text
              key={`month-${item.monthKey}`}
              x={xAt(index)}
              y={bottom + 24}
              fill="#a1a1aa"
              fontSize="10"
              textAnchor="middle"
            >
              {item.month}
            </text>
          );
        })}
      </svg>
      <p className="mt-1 text-center text-xs text-muted-foreground">
        Amounts shown in {currency}. Hover over a data point for its value.
      </p>
    </div>
  );
}
