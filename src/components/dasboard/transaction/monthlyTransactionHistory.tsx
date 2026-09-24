import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const MonthlyTransactionHistory = () => {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <Card className="border-border/80 bg-card">
        <CardHeader>
          <CardTitle className="font-sans text-lg">
            Spending this month
          </CardTitle>

          <CardDescription>Where your money has been going.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-sm">Food</span>

              <span className="font-semibold tabular-nums">৳8,500</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Shopping</span>

              <span className="font-semibold tabular-nums">৳6,200</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Transport</span>

              <span className="font-semibold tabular-nums">৳4,850</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Bills</span>

              <span className="font-semibold tabular-nums">৳7,500</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/80 bg-card">
        <CardHeader>
          <CardTitle className="font-sans text-lg">Monthly activity</CardTitle>

          <CardDescription>
            A quick look at your income and spending.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Income</span>

                <span className="font-semibold">৳75,000</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[75%] rounded-full bg-emerald-400" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Spending</span>

                <span className="font-semibold">৳42,350</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[42%] rounded-full bg-primary" />
              </div>
            </div>

            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm text-muted-foreground">Net this month</p>

              <p className="mt-1 font-sans text-2xl font-semibold tabular-nums">
                +৳32,650
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default MonthlyTransactionHistory;
