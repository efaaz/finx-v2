"use client";
import { useState, type ReactNode } from "react";
import {
  CalendarDays,
  Check,
  CheckSquare,
  ChevronDown,
  CircleHelp,
  Database,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  Info,
  RotateCcw,
  X,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAvailableCategories } from "@/hooks/useAvailableCategories";
import { api } from "@/lib/api/client";
import { toast } from "@/components/ui/toast";
import {
  type ExportFormat,
  DateRange,
  TransactionType,
  ExportColumn,
} from "@/types/exportTransaction";
import { useCurrentUser } from "@/hooks/useCurrentUser";

// Constants

const exportColumns: ExportColumn[] = [
  {
    id: "date",
    label: "Date",
    description: "Transaction date",
    defaultSelected: true,
  },
  {
    id: "type",
    label: "Type",
    description: "Income or spending",
    defaultSelected: true,
  },
  {
    id: "category",
    label: "Category",
    description: "Transaction category",
    defaultSelected: true,
  },
  {
    id: "amount",
    label: "Amount",
    description: "Transaction amount",
    defaultSelected: true,
  },
  {
    id: "currency",
    label: "Currency",
    description: "Currency code",
    defaultSelected: true,
  },
  {
    id: "note",
    label: "Note",
    description: "Transaction note",
    defaultSelected: true,
  },
  {
    id: "transactionId",
    label: "Transaction ID",
    description: "Unique FinX transaction ID",
    defaultSelected: false,
  },
  {
    id: "createdAt",
    label: "Created At",
    description: "When the transaction was added",
    defaultSelected: false,
  },
];

export default function ExportTransactionsPage() {
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useAvailableCategories();
  const { data: currentUser } = useCurrentUser();

  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [transactionType, setTransactionType] =
    useState<TransactionType>("all");
  const [categoryId, setCategoryId] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [selectedColumns, setSelectedColumns] = useState<ExportColumn["id"][]>(
    exportColumns
      .filter((column) => column.defaultSelected)
      .map((column) => column.id),
  );

  const [isExporting, setIsExporting] = useState(false);
  const selectedColumnCount = selectedColumns.length;
  const allColumnsSelected = selectedColumnCount === exportColumns.length;
  const noColumnsSelected = selectedColumnCount === 0;
  const selectedCategory = categories.find(
    (category) => category._id === categoryId,
  );

  // Column selection
  const toggleColumn = (columnId: ExportColumn["id"]) => {
    setSelectedColumns((current) => {
      if (current.includes(columnId)) {
        return current.filter((id) => id !== columnId);
      }

      return [...current, columnId];
    });
  };

  const selectAllColumns = () => {
    setSelectedColumns(exportColumns.map((column) => column.id));
  };

  const clearColumns = () => {
    setSelectedColumns([]);
  };

  // Reset
  const resetFilters = () => {
    setDateRange("all");
    setTransactionType("all");
    setCategoryId("all");
    setStartDate("");
    setEndDate("");
    setFormat("csv");

    setSelectedColumns(
      exportColumns
        .filter((column) => column.defaultSelected)
        .map((column) => column.id),
    );
  };

  // Export
  const handleExport = async () => {
    if (categoryId !== "all" && transactionType !== selectedCategory?.type) {
      toast.add({
        type: "error",
        title: "Transection type and category type mismatch",
        description:
          "Please select a different transaction type for the selected category.",
      });
      return;
    }

    if (dateRange === "custom" && (!startDate || !endDate)) {
      return;
    }

    try {
      setIsExporting(true);

      const params = new URLSearchParams();

      params.set("format", format);
      params.set("dateRange", dateRange);
      params.set("type", transactionType);
      params.set("columns", selectedColumns.join(","));

      if (dateRange === "custom") {
        params.set("startDate", startDate);
        params.set("endDate", endDate);
      }

      if (categoryId !== "all") {
        params.set("categoryId", categoryId);
      }

      const response = await api.get("/transactions/export", {
        params,
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type:
          format === "excel"
            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : "text/csv;charset=utf-8;",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download =
        format === "excel"
          ? `finx-transactions-of-${currentUser?.name}.xlsx`
          : `finx-transactions-of-${currentUser?.name}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Transaction export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-3 py-1 text-xs font-medium text-violet-300">
            <Database className="size-3.5" />
            Data management
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Export Transactions
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Download your FinX transaction history as a CSV or Excel file.
                Choose the period, filters, and columns you want to include.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={resetFilters}
              className="w-fit gap-2 border-border bg-card"
            >
              <RotateCcw className="size-4" />
              Reset
            </Button>
          </div>
        </section>

        {/* Export builder */}
        <div className="space-y-6">
          {/* 1. Date range */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-start gap-3">
                <SectionIcon>
                  <CalendarDays className="size-4" />
                </SectionIcon>

                <div>
                  <CardTitle className="text-base">
                    1. Choose date range
                  </CardTitle>

                  <CardDescription className="mt-1">
                    Select which transactions should be included.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                <DateRangeButton
                  active={dateRange === "all"}
                  onClick={() => setDateRange("all")}
                >
                  All time
                </DateRangeButton>

                <DateRangeButton
                  active={dateRange === "month"}
                  onClick={() => setDateRange("month")}
                >
                  This month
                </DateRangeButton>

                <DateRangeButton
                  active={dateRange === "3months"}
                  onClick={() => setDateRange("3months")}
                >
                  Last 3 months
                </DateRangeButton>

                <DateRangeButton
                  active={dateRange === "year"}
                  onClick={() => setDateRange("year")}
                >
                  This year
                </DateRangeButton>

                <DateRangeButton
                  active={dateRange === "custom"}
                  onClick={() => setDateRange("custom")}
                >
                  Custom
                </DateRangeButton>
              </div>

              {dateRange === "custom" && (
                <div className="grid gap-4 rounded-xl border border-border bg-black p-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start date</Label>

                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(event) => setStartDate(event.target.value)}
                      className="bg-card"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End date</Label>

                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(event) => setEndDate(event.target.value)}
                      className="bg-card"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="mt-0.5 size-3.5 shrink-0" />

                <p>All dates are based on your FinX transaction dates.</p>
              </div>
            </CardContent>
          </Card>

          {/* 2. Filters */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-start gap-3">
                <SectionIcon>
                  <Filter className="size-4" />
                </SectionIcon>

                <div>
                  <CardTitle className="text-base">
                    2. Filter transactions
                  </CardTitle>

                  <CardDescription className="mt-1">
                    Narrow down the transactions included in your export.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Transaction type */}

                <div className="space-y-2">
                  <Label>Transaction type</Label>

                  <Select
                    value={transactionType}
                    onValueChange={(value) => {
                      if (value) {
                        setTransactionType(value as TransactionType);
                      }
                    }}
                  >
                    <SelectTrigger className="bg-black">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="all">All transactions</SelectItem>

                      <SelectItem value="income">Income only</SelectItem>

                      <SelectItem value="spending">Spending only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}

                <div className="space-y-2">
                  <Label>Category</Label>

                  <Select
                    value={categoryId || "all"}
                    onValueChange={(value) => {
                      setCategoryId(value ?? "all");
                    }}
                  >
                    <SelectTrigger className="bg-black">
                      <SelectValue
                        placeholder={
                          isCategoriesLoading
                            ? "Loading categories..."
                            : "All categories"
                        }
                      >
                        {categoryId
                          ? selectedCategory?.categoryName
                          : "All categories"}
                      </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>

                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.categoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Columns Selection */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <SectionIcon>
                    <CheckSquare className="size-4" />
                  </SectionIcon>

                  <div>
                    <CardTitle className="text-base">
                      3. Choose columns
                    </CardTitle>

                    <CardDescription className="mt-1">
                      Select which fields should appear in the downloaded file.
                    </CardDescription>
                  </div>
                </div>

                <Badge variant="outline" className="w-fit border-border">
                  {selectedColumnCount} of {exportColumns.length} selected
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Select / clear */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={selectAllColumns}
                  disabled={allColumnsSelected}
                  className="gap-2 border-border bg-black"
                >
                  <Check className="size-3.5" />
                  Select all
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearColumns}
                  disabled={noColumnsSelected}
                  className="gap-2 text-muted-foreground"
                >
                  <X className="size-3.5" />
                  Clear
                </Button>
              </div>

              <Separator />

              {/* Columns */}

              <div className="grid gap-2 sm:grid-cols-2">
                {exportColumns.map((column) => {
                  const checked = selectedColumns.includes(column.id);

                  return (
                    <label
                      key={column.id}
                      htmlFor={`column-${column.id}`}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                        checked
                          ? "border-violet-500/30 bg-violet-500/5"
                          : "border-border bg-black hover:border-border/80"
                      }`}
                    >
                      <Checkbox
                        id={`column-${column.id}`}
                        checked={checked}
                        onCheckedChange={() => toggleColumn(column.id)}
                        className="mt-0.5"
                      />

                      <div className="min-w-0">
                        <p className="text-sm font-medium">{column.label}</p>

                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {column.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>

              {noColumnsSelected && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
                  Select at least one column to create an export.
                </div>
              )}
            </CardContent>
          </Card>
          {/* 4. Format */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-start gap-3">
                <SectionIcon>
                  <Download className="size-4" />
                </SectionIcon>

                <div>
                  <CardTitle className="text-base">4. Choose format</CardTitle>

                  <CardDescription className="mt-1">
                    Select the file format that works best for you.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <FormatCard
                  active={format === "csv"}
                  icon={<FileText className="size-5" />}
                  title="CSV"
                  description="Simple and compatible with most spreadsheet and finance applications."
                  onClick={() => setFormat("csv")}
                />

                <FormatCard
                  active={format === "excel"}
                  icon={<FileSpreadsheet className="size-5" />}
                  title="Excel"
                  description="Best for viewing, filtering, and working with your data in Microsoft Excel."
                  onClick={() => setFormat("excel")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Export summary */}
          <Card className="overflow-hidden border-violet-500/20 bg-card">
            <div className="h-1 bg-violet-500/70" />

            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Ready to export</CardTitle>

                  <CardDescription className="mt-1">
                    Review your export settings before downloading.
                  </CardDescription>
                </div>

                <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 sm:flex">
                  <Download className="size-5" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Summary */}

              <div className="grid gap-3 sm:grid-cols-3">
                <SummaryItem
                  label="Date range"
                  value={getDateRangeLabel(dateRange)}
                />

                <SummaryItem
                  label="Transaction filter"
                  value={getTransactionTypeLabel(transactionType)}
                />

                <SummaryItem
                  label="Format"
                  value={format === "csv" ? "CSV" : "Excel"}
                />
              </div>

              {/* Category summary */}

              <div className="grid gap-3 sm:grid-cols-2">
                <SummaryItem
                  label="Category"
                  value={selectedCategory?.categoryName ?? "All categories"}
                />

                <SummaryItem
                  label="Columns"
                  value={`${selectedColumnCount} selected`}
                />
              </div>

              {/* Columns */}

              <div className="rounded-xl border border-border bg-black p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium">Included columns</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {selectedColumnCount} columns selected
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {exportColumns
                      .filter((column) => selectedColumns.includes(column.id))
                      .map((column) => (
                        <Badge
                          key={column.id}
                          variant="secondary"
                          className="bg-card text-xs"
                        >
                          {column.label}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>

              {/* Privacy note */}

              <div className="flex items-start gap-3 rounded-xl border border-border bg-violet-500/5 p-4">
                <CircleHelp className="mt-0.5 size-4 shrink-0 text-violet-400" />

                <div>
                  <p className="text-sm font-medium">Your data stays yours</p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    FinX only exports transactions belonging to your account.
                    Sensitive authentication information is never included.
                  </p>
                </div>
              </div>

              {/* Actions */}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetFilters}
                  className="border-border bg-black"
                  disabled={isExporting}
                >
                  Reset
                </Button>

                <Button
                  type="button"
                  disabled={
                    noColumnsSelected ||
                    isExporting ||
                    (dateRange === "custom" && (!startDate || !endDate))
                  }
                  onClick={handleExport}
                  className="bg-violet-600 hover:bg-violet-500"
                >
                  <Download className="size-4" />

                  {isExporting
                    ? "Exporting..."
                    : `Download ${format === "csv" ? "CSV" : "Excel"}`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer help */}

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-card p-4">
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

          <div>
            <p className="text-sm font-medium">Need to bring data into FinX?</p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Use the Import Transactions page to upload your existing CSV or
              Excel transaction history.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

// Section icon
function SectionIcon({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-black text-violet-400">
      {children}
    </div>
  );
}

// Date range button
function DateRangeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition ${
        active
          ? "border-violet-500/30 bg-violet-500/10 text-violet-300"
          : "border-border bg-black text-muted-foreground hover:border-border/80 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

// Format card
function FormatCard({
  active,
  icon,
  title,
  description,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-start gap-4 rounded-2xl border p-5 text-left transition ${
        active
          ? "border-violet-500/30 bg-violet-500/5"
          : "border-border bg-black hover:border-border/80"
      }`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          active
            ? "bg-violet-500/10 text-violet-400"
            : "bg-card text-muted-foreground"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">{title}</p>

          {active && (
            <Badge className="border-violet-500/20 bg-violet-500/10 text-[10px] text-violet-300 hover:bg-violet-500/10">
              Selected
            </Badge>
          )}
        </div>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </button>
  );
}

// Summary item

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-black p-4">
      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="mt-2 truncate text-sm font-medium">{value}</p>
    </div>
  );
}

// Helpers
function getDateRangeLabel(dateRange: DateRange) {
  switch (dateRange) {
    case "month":
      return "This month";

    case "3months":
      return "Last 3 months";

    case "year":
      return "This year";

    case "custom":
      return "Custom range";

    default:
      return "All time";
  }
}

function getTransactionTypeLabel(type: TransactionType) {
  switch (type) {
    case "income":
      return "Income only";

    case "spending":
      return "Spending only";

    default:
      return "All transactions";
  }
}
