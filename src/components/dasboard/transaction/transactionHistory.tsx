import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search } from "lucide-react";

const TransactionHistory = () => {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-sans text-lg font-semibold">Transaction history</h2>

        <p className="text-sm text-muted-foreground">
          Search and manage your previous transactions.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input placeholder="Search transactions..." className="pl-9" />
        </div>

        <select className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option>All types</option>
          <option>Income</option>
          <option>Spending</option>
        </select>

        <select className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option>All categories</option>
          <option>Food</option>
          <option>Transport</option>
          <option>Shopping</option>
        </select>
      </div>

      {/* History table */}
      <Card className="border-border/80 bg-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr className="text-left text-muted-foreground">
                  <th className="px-5 py-4 font-medium">Date</th>

                  <th className="px-5 py-4 font-medium">Description</th>

                  <th className="px-5 py-4 font-medium">Category</th>

                  <th className="px-5 py-4 text-right font-medium">Amount</th>

                  <th className="w-10" />
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-5 py-4 text-muted-foreground">Sep 24</td>

                  <td className="px-5 py-4 font-medium">Lunch</td>

                  <td className="px-5 py-4">
                    <Badge variant="outline">Food</Badge>
                  </td>

                  <td className="px-5 py-4 text-right font-semibold tabular-nums text-red-400">
                    -৳500
                  </td>

                  <td className="px-2">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </td>
                </tr>

                <tr>
                  <td className="px-5 py-4 text-muted-foreground">Sep 23</td>

                  <td className="px-5 py-4 font-medium">Salary</td>

                  <td className="px-5 py-4">
                    <Badge variant="outline">Income</Badge>
                  </td>

                  <td className="px-5 py-4 text-right font-semibold tabular-nums text-emerald-400">
                    +৳8,000
                  </td>

                  <td className="px-2">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default TransactionHistory;
