import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { currencies } from "@/types/currency";
import { Plus } from "lucide-react";
const QuickTransection = () => {
  const user = {
    id: "string",
    name: "efaz",
    email: "string",
    avatar: "string",
    defaultCurrency: "BDT",
  };
  return (
    <Card className="border-border/80 bg-card">
      <CardHeader>
        <CardTitle className="font-sans text-lg">Add transaction</CardTitle>

        <CardDescription>
          Record a transaction without leaving this page.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 items-center md:grid-cols-2 lg:grid-cols-5">
          {/* Type */}
          <div className="space-y-2">
            <label className="text-sm pl-1 font-medium">Type</label>

            <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
              <option value="spending">Spending</option>

              <option value="income">Income</option>
            </select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm pl-1 font-medium">Amount</label>

            <div className="flex items-center rounded-md border border-input bg-background">
              <span className="px-3 text-sm text-muted-foreground">
                {
                  currencies.find((item) => item.code === user?.defaultCurrency)
                    ?.symbol
                }
              </span>

              <Input
                type="number"
                className="border-0 focus-visible:ring-0"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm pl-1 font-medium">Category</label>

            <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
              <option>Select category</option>
              <option>Food</option>
              <option>Transport</option>
              <option>Shopping</option>
              <option>Bills</option>
            </select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm pl-1 font-medium">Date</label>

            <Input type="date" />
          </div>

          {/* Button */}
          <div className="flex mt-4 items-end">
            <Button className="w-full gap-2">
              <Plus className="size-4" />
              Add
            </Button>
          </div>
        </div>

        {/* Optional note */}
        <div className="mt-4">
          <Input placeholder="Add a note (optional)" />
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickTransection;
