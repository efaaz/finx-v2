import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";
import {
  ArrowDownLeft,
  ArrowUpRight,
  MoreHorizontal,
  Wallet,
  ChevronRight,
} from "lucide-react";

const TodaySummary = () => {
  return (
    <>
      <section className="space-y-4">
        <div>
          <h2 className="font-sans text-lg font-semibold">Today</h2>

          <p className="text-sm text-muted-foreground">September 24, 2026</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Income */}
          <Card className="border-border/80 bg-card">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">Income</p>

                <p className="mt-1 font-sans text-2xl font-semibold tabular-nums">
                  {formatCurrency(125000, "BDT")}
                </p>
              </div>

              <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10">
                <ArrowDownLeft className="size-5 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          {/* Spending */}
          <Card className="border-border/80 bg-card">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">Spending</p>

                <p className="mt-1 font-sans text-2xl font-semibold tabular-nums">
                  {formatCurrency(2450, "BDT")}
                </p>
              </div>

              <div className="flex size-10 items-center justify-center rounded-full bg-red-500/10">
                <ArrowUpRight className="size-5 text-red-400" />
              </div>
            </CardContent>
          </Card>

          {/* Net */}
          <Card className="border-border/80 bg-card">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">Net</p>

                <p className="mt-1 font-sans text-2xl font-semibold tabular-nums">
                  {formatCurrency(6050, "BDT")}
                </p>
              </div>

              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <Wallet className="size-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <Card className="border-border/80 bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-sans text-lg">
              Today's transactions
            </CardTitle>

            <CardDescription>Your latest activity today.</CardDescription>
          </div>

          <Button variant="ghost" size="sm">
            View all
            <ChevronRight className="ml-1 size-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <div className="divide-y divide-border">
            {/* Transaction 1 */}
            <div className="flex items-center gap-4 py-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                <ArrowUpRight className="size-4 text-red-400" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">Lunch</p>

                <p className="text-sm text-muted-foreground">Food · 1:20 PM</p>
              </div>

              <p className="font-sans font-semibold tabular-nums text-red-400">
                {formatCurrency(500, "BDT")}
              </p>

              <Button variant="ghost" size="icon">
                <MoreHorizontal className="size-4" />
              </Button>
            </div>

            {/* Transaction 2 */}
            <div className="flex items-center gap-4 py-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                <ArrowUpRight className="size-4 text-red-400" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">Uber</p>

                <p className="text-sm text-muted-foreground">
                  Transport · 11:40 AM
                </p>
              </div>

              <p className="font-sans font-semibold tabular-nums text-red-400">
                {formatCurrency(300, "BDT")}
              </p>

              <Button variant="ghost" size="icon">
                <MoreHorizontal className="size-4" />
              </Button>
            </div>

            {/* Transaction 3 */}
            <div className="flex items-center gap-4 py-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                <ArrowDownLeft className="size-4 text-emerald-400" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">Monthly salary</p>

                <p className="text-sm text-muted-foreground">
                  Salary · 9:00 AM
                </p>
              </div>

              <p className="font-sans font-semibold tabular-nums text-emerald-400">
                {formatCurrency(8000, "BDT")}
              </p>

              <Button variant="ghost" size="icon">
                <MoreHorizontal className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default TodaySummary;
