"use client";
import { useState, type ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
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
import {
  type TrendRange,
  type SpendingCategory,
  type MonthlyData,
} from "@/types/ReportAnalytics";
import FeatureComingSoon from "@/components/ui/FeatureComingSoon";

// ==================================================
// Hardcoded demo data
// Replace these values with your API response later.
// ==================================================

const allTime = {
  income: 4_248_500,
  spending: 2_842_360,
  netCashFlow: 1_406_140,
  trackedMonths: 36,
};

const spendingCategories: SpendingCategory[] = [
  {
    id: "housing",
    name: "Housing",
    amount: 796_000,
    transactions: 480,
    color: "bg-violet-400",
    description:
      "Housing is your largest spending category. Rent and essential home costs may be relatively fixed, so review what is actually flexible before making changes.",
  },
  {
    id: "food",
    name: "Food",
    amount: 452_000,
    transactions: 640,
    color: "bg-sky-400",
    description:
      "Food covers a mix of essential groceries and meals outside the home. Planning meals or reviewing eating-out patterns may help if you want to adjust this category.",
  },
  {
    id: "transport",
    name: "Transport",
    amount: 290_120,
    transactions: 310,
    color: "bg-emerald-400",
    description:
      "Transport spending can reflect commuting and everyday mobility. Look for patterns that fit your routine before considering any changes.",
  },
  {
    id: "shopping",
    name: "Shopping",
    amount: 266_000,
    transactions: 155,
    color: "bg-amber-400",
    description:
      "Shopping is worth reviewing against your priorities. Separating planned purchases from impulse purchases can make this category easier to understand.",
  },
  {
    id: "bills",
    name: "Bills",
    amount: 221_000,
    transactions: 125,
    color: "bg-rose-400",
    description:
      "Bills are often recurring commitments. Reviewing subscriptions, tariffs, or billing changes occasionally can help you stay informed.",
  },
  {
    id: "health",
    name: "Health",
    amount: 184_000,
    transactions: 65,
    color: "bg-teal-400",
    description:
      "Health spending can be essential. A larger amount here is not automatically a problem; context and personal needs matter.",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    amount: 149_000,
    transactions: 115,
    color: "bg-orange-400",
    description:
      "Entertainment is part of enjoying life. The useful question is whether this spending matches what matters to you.",
  },
  {
    id: "subscriptions",
    name: "Subscriptions",
    amount: 70_400,
    transactions: 88,
    color: "bg-indigo-400",
    description:
      "Recurring charges can be easy to overlook. An occasional review can help identify services you no longer use.",
  },
  {
    id: "other",
    name: "Other",
    amount: 413_840,
    transactions: 140,
    color: "bg-zinc-400",
    description:
      "A broad category can hide useful patterns. Categorizing a few of the largest transactions may make future reports more informative.",
  },
];

const monthlyData: MonthlyData[] = [
  { month: "Oct '25", income: 124_000, spending: 84_000 },
  { month: "Nov '25", income: 129_000, spending: 91_000 },
  { month: "Dec '25", income: 138_000, spending: 107_000 },
  { month: "Jan '26", income: 126_000, spending: 86_000 },
  { month: "Feb '26", income: 131_000, spending: 89_000 },
  { month: "Mar '26", income: 136_000, spending: 97_000 },
  { month: "Apr '26", income: 133_000, spending: 91_000 },
  { month: "May '26", income: 143_000, spending: 100_000 },
  { month: "Jun '26", income: 139_000, spending: 95_000 },
  { month: "Jul '26", income: 147_000, spending: 104_000 },
  { month: "Aug '26", income: 145_000, spending: 96_000 },
  { month: "Sep '26", income: 152_000, spending: 108_000 },
];

// ==================================================
// Formatting
// ==================================================

function money(value: number) {
  return `৳${new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(value)}`;
}

function compactMoney(value: number) {
  return `৳${new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)}`;
}

function percentage(value: number) {
  return `${value.toFixed(1)}%`;
}
// Page

export default function ReportsPage() {
  const [trendRange, setTrendRange] = useState<TrendRange>("12months");

  const [selectedCategoryId, setSelectedCategoryId] = useState("all");

  const totalIncome = allTime.income;
  const totalSpending = allTime.spending;

  const netCashFlow = totalIncome - totalSpending;

  // This is the share of recorded income remaining after
  // recorded spending, not a bank balance or investment return.
  const remainingRate = totalIncome > 0 ? (netCashFlow / totalIncome) * 100 : 0;

  const topCategory = spendingCategories.reduce((highest, category) =>
    category.amount > highest.amount ? category : highest,
  );

  const secondCategory = spendingCategories.find(
    (category) => category.id === "food",
  )!;

  const activeCategory = spendingCategories.find(
    (category) => category.id === selectedCategoryId,
  );

  const totalTransactions = spendingCategories.reduce(
    (total, category) => total + category.transactions,
    0,
  );

  const activeTrend =
    trendRange === "6months" ? monthlyData.slice(-6) : monthlyData;

  const trendIncome = activeTrend.reduce((sum, month) => sum + month.income, 0);

  const trendSpending = activeTrend.reduce(
    (sum, month) => sum + month.spending,
    0,
  );

  const spendingShare = (amount: number) =>
    totalSpending > 0 ? (amount / totalSpending) * 100 : 0;

  const focusAmount = activeCategory?.amount ?? totalSpending;

  const focusTransactions = activeCategory?.transactions ?? totalTransactions;

  const focusShare = activeCategory
    ? spendingShare(activeCategory.amount)
    : 100;

  const averageTransaction =
    focusTransactions > 0 ? focusAmount / focusTransactions : 0;

  const combinedTopTwoShare =
    spendingShare(topCategory.amount) + spendingShare(secondCategory.amount);

  // ==================================================
  // Render
  // ==================================================

  return (
    <main className="min-h-screen bg-black text-foreground">
      <FeatureComingSoon />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* ======================================== */}
        {/* Header */}
        {/* ======================================== */}

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

        {/* ======================================== */}
        {/* Positive cash-flow message */}
        {/* ======================================== */}

        <Card className="overflow-hidden border-violet-500/20 bg-card">
          <div className="h-1 bg-violet-500/70" />

          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <Sparkles className="size-5" />
              </div>

              <div>
                <p className="text-sm font-medium">
                  A positive pattern in your recorded finances
                </p>

                <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                  Your recorded income exceeds your recorded spending by{" "}
                  <span className="font-semibold text-emerald-400">
                    {money(netCashFlow)}
                  </span>
                  . That gives you a useful starting point for planning savings
                  and future goals.
                </p>
              </div>
            </div>

            <Badge className="w-fit shrink-0 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/10">
              <CheckCircle2 className="mr-1.5 size-3.5" />
              Positive net cash flow
            </Badge>
          </CardContent>
        </Card>

        {/* ======================================== */}
        {/* All-time metrics */}
        {/* ======================================== */}

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
              All-time totals
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Total income"
              value={money(totalIncome)}
              description="Money recorded as income"
              icon={<ArrowDownRight className="size-5" />}
              iconClass="bg-emerald-500/10 text-emerald-400"
              indicator="Income"
              indicatorClass="text-emerald-400"
            />

            <MetricCard
              title="Total spending"
              value={money(totalSpending)}
              description={`${totalTransactions.toLocaleString()} categorized spending transactions`}
              icon={<ArrowUpRight className="size-5" />}
              iconClass="bg-violet-500/10 text-violet-400"
              indicator="Spending"
              indicatorClass="text-violet-300"
            />

            <MetricCard
              title="Net cash flow"
              value={money(netCashFlow)}
              description="Income minus recorded spending"
              icon={<Wallet className="size-5" />}
              iconClass="bg-sky-500/10 text-sky-400"
              indicator="Positive"
              indicatorClass="text-emerald-400"
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
            untracked transactions.
          </p>
        </section>

        {/* ======================================== */}
        {/* Trend + category spotlight */}
        {/* ======================================== */}

        <section className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
          {/* Cash flow chart */}

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
                    if (value) {
                      setTrendRange(value as TrendRange);
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
                    {compactMoney(trendIncome)}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-black p-3">
                  <p className="text-xs text-muted-foreground">
                    Spending in this view
                  </p>

                  <p className="mt-1 text-lg font-semibold text-violet-300">
                    {compactMoney(trendSpending)}
                  </p>
                </div>
              </div>

              <CashFlowChart data={activeTrend} />

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
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="size-4" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Your recorded income stayed above spending
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    In this sample period, income exceeded spending each month.
                    The difference can support your savings goals or provide
                    flexibility for future expenses.
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
                    if (value) {
                      setSelectedCategoryId(value);
                    }
                  }}
                >
                  <SelectTrigger id="category-focus" className="bg-black">
                    <SelectValue placeholder="Choose category" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">All spending</SelectItem>

                    {spendingCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
                <p className="text-xs text-muted-foreground">
                  All-time spending
                </p>

                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  {money(focusAmount)}
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
                      width: `${Math.min(focusShare, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-black p-3">
                  <p className="text-xs text-muted-foreground">
                    Average transaction
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    {money(averageTransaction)}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-black p-3">
                  <p className="text-xs text-muted-foreground">Category rank</p>

                  <p className="mt-2 text-sm font-semibold">
                    {activeCategory
                      ? `#${
                          [...spendingCategories]
                            .sort((a, b) => b.amount - a.amount)
                            .findIndex(
                              (item) => item.id === activeCategory.id,
                            ) + 1
                        }`
                      : "All categories"}
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

        {/* ======================================== */}
        {/* Spending by category */}
        {/* ======================================== */}

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
                  {spendingCategories.length} categories
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
                {/* Ranked category bars */}

                <div className="space-y-2">
                  {[...spendingCategories]
                    .sort((a, b) => b.amount - a.amount)
                    .map((category, index) => {
                      const share = spendingShare(category.amount);

                      const selected = selectedCategoryId === category.id;

                      const maxCategoryAmount = topCategory.amount;

                      const barWidth =
                        (category.amount / maxCategoryAmount) * 100;

                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setSelectedCategoryId(category.id)}
                          aria-pressed={selected}
                          className={`w-full rounded-xl border p-3 text-left transition ${
                            selected
                              ? "border-violet-500/30 bg-violet-500/5"
                              : "border-transparent hover:border-border hover:bg-black/70"
                          }`}
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
                                {money(category.amount)}
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
                      {activeCategory?.name ?? topCategory.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {activeCategory?.description ?? topCategory.description}
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
                          {money(averageTransaction)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
                    <div className="flex items-center gap-2">
                      <Target className="size-4 text-violet-300" />

                      <p className="text-sm font-medium">A useful next step</p>
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
                          selectedCategoryId === "all" ? topCategory.id : "all",
                        )
                      }
                    >
                      {selectedCategoryId === "all"
                        ? `Explore ${topCategory.name}`
                        : "Show all spending"}

                      <ArrowRight className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ======================================== */}
        {/* Financial insights */}
        {/* ======================================== */}

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Insights worth noticing</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Patterns can help you make informed choices. They are not a score
              of how well you manage money.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {/* Insight 1 */}

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
                    Positive signal
                  </Badge>
                </div>

                <h3 className="mt-4 text-base font-semibold">
                  There is room to plan ahead
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Your recorded income remaining after spending is{" "}
                  <span className="font-medium text-foreground">
                    {percentage(remainingRate)}
                  </span>
                  . You could decide how much to direct toward an emergency
                  fund, a future purchase, or other goals that matter to you.
                </p>
              </CardContent>
            </Card>

            {/* Insight 2 */}

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
                  Your spending has a clear concentration
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {topCategory.name} and {secondCategory.name} together account
                  for{" "}
                  <span className="font-medium text-foreground">
                    {percentage(combinedTopTwoShare)}
                  </span>{" "}
                  of recorded spending. If you want to change your spending,
                  understanding these larger categories may be a useful starting
                  point.
                </p>

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
              </CardContent>
            </Card>

            {/* Insight 3 */}

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
                  Start by reviewing a few recent transactions in one category.
                  A small, informed adjustment that fits your priorities is more
                  sustainable than trying to cut everything at once.
                </p>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-3 gap-2 px-0 text-violet-300 hover:text-violet-200"
                  onClick={() => setSelectedCategoryId("subscriptions")}
                >
                  Review subscriptions
                  <ArrowRight className="size-3.5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ======================================== */}
        {/* Closing note */}
        {/* ======================================== */}

        <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 sm:p-5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
            <Info className="size-4" />
          </div>

          <div>
            <p className="text-sm font-medium">Your money, your priorities.</p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Higher spending is not automatically bad, and lower spending is
              not automatically better. The purpose of these reports is to help
              you understand your patterns and decide what works for you. All
              figures on this demo page are illustrative.
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
// No chart library required.
// ==================================================

function CashFlowChart({ data }: { data: MonthlyData[] }) {
  const width = 760;
  const height = 270;

  const left = 54;
  const right = 744;
  const top = 24;
  const bottom = 210;

  const maxValue =
    Math.ceil(
      Math.max(...data.map((item) => Math.max(item.income, item.spending))) /
        25_000,
    ) * 25_000;

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

  return (
    <div className="w-full min-w-0">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full overflow-visible"
        role="img"
        aria-label={`Income and spending chart across ${data.length} months`}
      >
        <title>Monthly income and spending comparison</title>

        {/* Horizontal guides */}

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

        {/* Spending area */}

        <polygon
          points={`${left},${bottom} ${spendingPoints} ${right},${bottom}`}
          fill="#a78bfa"
          fillOpacity="0.08"
        />

        {/* Income line */}

        <polyline
          points={incomePoints}
          fill="none"
          stroke="#34d399"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Spending line */}

        <polyline
          points={spendingPoints}
          fill="none"
          stroke="#a78bfa"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Income points */}

        {data.map((item, index) => (
          <circle
            key={`income-${item.month}`}
            cx={xAt(index)}
            cy={yAt(item.income)}
            r="3.5"
            fill="#34d399"
            stroke="#09090b"
            strokeWidth="1.5"
          >
            <title>{`${item.month} income: ${money(item.income)}`}</title>
          </circle>
        ))}

        {/* Spending points */}

        {data.map((item, index) => (
          <circle
            key={`spending-${item.month}`}
            cx={xAt(index)}
            cy={yAt(item.spending)}
            r="3.5"
            fill="#a78bfa"
            stroke="#09090b"
            strokeWidth="1.5"
          >
            <title>{`${item.month} spending: ${money(item.spending)}`}</title>
          </circle>
        ))}

        {/* Month labels */}

        {data.map((item, index) => {
          const showLabel =
            data.length <= 6 || index % 2 === 0 || index === data.length - 1;

          if (!showLabel) {
            return null;
          }

          return (
            <text
              key={`month-${item.month}`}
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
        Amounts shown in BDT. Hover over a data point for its value.
      </p>
    </div>
  );
}
