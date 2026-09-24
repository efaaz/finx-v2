"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search } from "lucide-react";
import { useThisMonthTransactions } from "@/hooks/useTransections";
import { formatCurrency } from "@/lib/currency";
import { formatTransactionDate } from "@/lib/formateHelper";

const TransactionHistory = () => {
  const { data, isLoading, isError, error } = useThisMonthTransactions();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const transactions = data?.data.transactions ?? [];

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const searchTerm = search.toLowerCase().trim();

      const matchesSearch =
        !searchTerm ||
        transaction.note.toLowerCase().includes(searchTerm) ||
        transaction.categoryId.categoryName.toLowerCase().includes(searchTerm);

      const matchesType =
        typeFilter === "all" || transaction.type === typeFilter;

      const matchesCategory =
        categoryFilter === "all" ||
        transaction.categoryId._id === categoryFilter;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, search, typeFilter, categoryFilter]);

  const categories = useMemo(() => {
    const uniqueCategories = new Map<
      string,
      { _id: string; categoryName: string }
    >();

    transactions.forEach((transaction) => {
      uniqueCategories.set(transaction.categoryId._id, {
        _id: transaction.categoryId._id,
        categoryName: transaction.categoryId.categoryName,
      });
    });

    return Array.from(uniqueCategories.values());
  }, [transactions]);

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div>
          <h2 className="font-sans text-lg font-semibold">
            Transaction history
          </h2>
          <p className="text-sm text-muted-foreground">
            Search and manage your previous transactions.
          </p>
        </div>

        <Card className="border-border/80 bg-card">
          <CardContent className="p-6 text-sm text-muted-foreground">
            Loading transactions...
          </CardContent>
        </Card>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="space-y-4">
        <div>
          <h2 className="font-sans text-lg font-semibold">
            Transaction history
          </h2>
          <p className="text-sm text-muted-foreground">
            Search and manage your previous transactions.
          </p>
        </div>

        <Card className="border-border/80 bg-card">
          <CardContent className="p-6 text-sm text-red-400">
            {error.message}
          </CardContent>
        </Card>
      </section>
    );
  }

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

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="pl-9"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="spending">Spending</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All categories</option>

          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.categoryName}
            </option>
          ))}
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
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => {
                    const isIncome = transaction.type === "income";

                    return (
                      <tr key={transaction._id}>
                        <td className="px-5 md:text-lg text-xs py-4 text-muted-foreground">
                          {formatTransactionDate(transaction.date)}
                        </td>

                        <td className="px-5 py-4 font-medium">
                          {transaction.note ||
                            transaction.categoryId.categoryName}
                        </td>

                        <td className="px-5 py-4">
                          <Badge variant="outline">
                            {transaction.categoryId.categoryName}
                          </Badge>
                        </td>

                        <td
                          className={`px-5 py-4 text-right font-semibold tabular-nums ${
                            isIncome ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {isIncome ? "+" : "-"}
                          {formatCurrency(
                            transaction.amount,
                            transaction.currency,
                          )}
                        </td>

                        <td className="px-2">
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-muted-foreground"
                    >
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination info */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredTransactions.length} of{" "}
        {data?.data.pagination.total ?? 0} transactions
      </div>
    </section>
  );
};

export default TransactionHistory;
