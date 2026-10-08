"use client";

import { useState, type ReactNode } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Database,
  FileSpreadsheet,
  FileText,
  Info,
  Upload,
  FileUp,
  X,
  CheckSquare,
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
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import FeatureComingSoon from "@/components/ui/FeatureComingSoon";

// ==================================================
// Types
// ==================================================

type ImportFormat = "csv" | "excel";

type MappingKey = "date" | "type" | "category" | "amount" | "currency" | "note";

type ImportMode = "skip" | "replace";

type ColumnMapping = {
  key: MappingKey;
  label: string;
  description: string;
  source: string;
  required: boolean;
};

type PreviewTransaction = {
  date: string;
  type: string;
  category: string;
  amount: string;
  currency: string;
  note: string;
};

// ==================================================
// Hardcoded demo data
// ==================================================

const demoFile = {
  name: "finx-transactions-2026.csv",
  size: "48.2 KB",
  format: "CSV" as ImportFormat,
  rows: 128,
};

const sourceColumns = [
  "Date",
  "Transaction Type",
  "Category",
  "Amount",
  "Currency",
  "Description",
];

const initialMappings: ColumnMapping[] = [
  {
    key: "date",
    label: "Date",
    description: "Transaction date",
    source: "Date",
    required: true,
  },
  {
    key: "type",
    label: "Type",
    description: "Income or spending",
    source: "Transaction Type",
    required: true,
  },
  {
    key: "category",
    label: "Category",
    description: "Transaction category",
    source: "Category",
    required: true,
  },
  {
    key: "amount",
    label: "Amount",
    description: "Transaction amount",
    source: "Amount",
    required: true,
  },
  {
    key: "currency",
    label: "Currency",
    description: "Three-letter currency code",
    source: "Currency",
    required: true,
  },
  {
    key: "note",
    label: "Note",
    description: "Optional transaction note",
    source: "Description",
    required: false,
  },
];

const previewTransactions: PreviewTransaction[] = [
  {
    date: "2026-10-01",
    type: "spending",
    category: "Food",
    amount: "450",
    currency: "BDT",
    note: "Lunch",
  },
  {
    date: "2026-10-02",
    type: "income",
    category: "Salary",
    amount: "65000",
    currency: "BDT",
    note: "Monthly salary",
  },
  {
    date: "2026-10-03",
    type: "spending",
    category: "Transport",
    amount: "180",
    currency: "BDT",
    note: "Ride",
  },
  {
    date: "2026-10-04",
    type: "spending",
    category: "Shopping",
    amount: "2200",
    currency: "BDT",
    note: "Clothing",
  },
];

const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Salary",
  "Freelance",
];

const currencies = ["BDT", "USD", "EUR", "GBP"];

// ==================================================
// Page
// ==================================================

export default function ImportTransactionsPage() {
  const [fileSelected, setFileSelected] = useState(true);

  const [format, setFormat] = useState<ImportFormat>("csv");

  const [mappings, setMappings] = useState(initialMappings);

  const [importMode, setImportMode] = useState<ImportMode>("skip");

  const [createMissingCategories, setCreateMissingCategories] = useState(true);

  const [isImporting, setIsImporting] = useState(false);

  const mappedRequiredFields = mappings.filter(
    (mapping) => mapping.required && mapping.source !== "ignore",
  ).length;

  const requiredFieldCount = mappings.filter(
    (mapping) => mapping.required,
  ).length;

  const mappingComplete = mappedRequiredFields === requiredFieldCount;

  const validRows = 126;
  const warningRows = 2;
  const totalRows = 128;

  // ==================================================
  // File demo
  // ==================================================

  const handleChooseFile = () => {
    // Demo only
    setFileSelected(true);
  };

  const removeFile = () => {
    setFileSelected(false);
  };

  // ==================================================
  // Mapping
  // ==================================================

  const updateMapping = (key: MappingKey, source: string) => {
    setMappings((current) =>
      current.map((mapping) =>
        mapping.key === key
          ? {
              ...mapping,
              source,
            }
          : mapping,
      ),
    );
  };

  // ==================================================
  // Import
  // ==================================================

  const handleImport = async () => {
    setIsImporting(true);

    // Demo only
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsImporting(false);
  };

  // ==================================================
  // Render
  // ==================================================

  return (
    <main className="min-h-screen bg-black text-foreground">
      <FeatureComingSoon />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ======================================== */}
        {/* Header */}
        {/* ======================================== */}

        <section className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-3 py-1 text-xs font-medium text-violet-300">
            <Database className="size-3.5" />
            Data management
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Import Transactions
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Bring your existing transaction history into FinX from a CSV or
                Excel file. Review and map your data before importing.
              </p>
            </div>
          </div>
        </section>

        {/* ======================================== */}
        {/* Import builder */}
        {/* ======================================== */}

        <div className="space-y-6">
          {/* ====================================== */}
          {/* 1. Upload file */}
          {/* ====================================== */}

          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-start gap-3">
                <SectionIcon>
                  <FileUp className="size-4" />
                </SectionIcon>

                <div>
                  <CardTitle className="text-base">
                    1. Upload your file
                  </CardTitle>

                  <CardDescription className="mt-1">
                    Upload a CSV or Excel file containing your transaction
                    history.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {!fileSelected ? (
                <button
                  type="button"
                  onClick={handleChooseFile}
                  className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-black px-6 py-12 text-center transition hover:border-violet-500/40 hover:bg-violet-500/5"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <Upload className="size-5" />
                  </div>

                  <p className="text-sm font-medium">
                    Choose your transaction file
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    CSV or XLSX up to 10 MB
                  </p>

                  <span className="mt-4 rounded-lg border border-border bg-card px-4 py-2 text-xs font-medium">
                    Choose file
                  </span>
                </button>
              ) : (
                <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                        <FileSpreadsheet className="size-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {demoFile.name}
                        </p>

                        <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span>{demoFile.format}</span>

                          <span>•</span>

                          <span>{demoFile.size}</span>

                          <span>•</span>

                          <span>{demoFile.rows} rows</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="w-fit text-muted-foreground hover:text-red-400"
                    >
                      <X className="mr-2 size-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="mt-0.5 size-3.5 shrink-0" />

                <p>
                  FinX supports CSV and Excel transaction files. Your original
                  file is not modified.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ====================================== */}
          {/* 2. Column mapping */}
          {/* ====================================== */}

          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-start gap-3">
                <SectionIcon>
                  <CheckSquare className="size-4" />
                </SectionIcon>

                <div>
                  <CardTitle className="text-base">
                    2. Map your columns
                  </CardTitle>

                  <CardDescription className="mt-1">
                    Tell FinX which columns contain each transaction field.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-xl border border-border bg-black p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium">Detected columns</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      FinX found {sourceColumns.length} columns in your file.
                    </p>
                  </div>

                  <Badge variant="outline" className="w-fit border-border">
                    {mappedRequiredFields} of {requiredFieldCount} required
                    mapped
                  </Badge>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {sourceColumns.map((column) => (
                    <Badge
                      key={column}
                      variant="secondary"
                      className="bg-card text-xs"
                    >
                      {column}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                {mappings.map((mapping) => (
                  <div
                    key={mapping.key}
                    className="grid gap-4 rounded-xl border border-border bg-black p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{mapping.label}</p>

                        {mapping.required ? (
                          <Badge
                            variant="outline"
                            className="border-violet-500/20 text-[10px] text-violet-300"
                          >
                            Required
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-border text-[10px] text-muted-foreground"
                          >
                            Optional
                          </Badge>
                        )}
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {mapping.description}
                      </p>
                    </div>

                    <Select
                      value={mapping.source}
                      onValueChange={(value) => {
                        if (value) {
                          updateMapping(mapping.key, value);
                        }
                      }}
                    >
                      <SelectTrigger className="bg-card">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        {sourceColumns.map((column) => (
                          <SelectItem key={column} value={column}>
                            {column}
                          </SelectItem>
                        ))}

                        <SelectItem value="ignore">Do not import</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex justify-end">
                      {mapping.source !== "ignore" ? (
                        <CheckCircle2 className="size-4 text-emerald-400" />
                      ) : (
                        <AlertCircle className="size-4 text-yellow-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {!mappingComplete && (
                <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />

                  <p>
                    Map all required fields before importing your transactions.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ====================================== */}
          {/* 3. Preview */}
          {/* ====================================== */}

          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-start gap-3">
                <SectionIcon>
                  <FileText className="size-4" />
                </SectionIcon>

                <div>
                  <CardTitle className="text-base">
                    3. Review imported data
                  </CardTitle>

                  <CardDescription className="mt-1">
                    Preview how your transactions will appear in FinX.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <ValidationItem
                  label="Rows detected"
                  value={totalRows.toString()}
                  icon={<Database className="size-4" />}
                />

                <ValidationItem
                  label="Valid rows"
                  value={validRows.toString()}
                  icon={<CheckCircle2 className="size-4" />}
                  success
                />

                <ValidationItem
                  label="Warnings"
                  value={warningRows.toString()}
                  icon={<AlertCircle className="size-4" />}
                  warning
                />
              </div>

              <Separator />

              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-190 text-sm">
                  <thead>
                    <tr className="border-b border-border bg-black">
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                        Date
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                        Type
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                        Category
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                        Amount
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                        Currency
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                        Note
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {previewTransactions.map((transaction, index) => (
                      <tr
                        key={index}
                        className="border-b border-border last:border-0"
                      >
                        <td className="px-4 py-3">{transaction.date}</td>

                        <td className="px-4 py-3">
                          <Badge
                            variant="secondary"
                            className={
                              transaction.type === "income"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-red-500/10 text-red-400"
                            }
                          >
                            {transaction.type}
                          </Badge>
                        </td>

                        <td className="px-4 py-3">{transaction.category}</td>

                        <td className="px-4 py-3 font-medium">
                          {transaction.amount}
                        </td>

                        <td className="px-4 py-3">{transaction.currency}</td>

                        <td className="px-4 py-3 text-muted-foreground">
                          {transaction.note || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-muted-foreground">
                Showing 4 of {totalRows} imported rows.
              </p>

              <div className="flex items-start gap-2 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-yellow-400" />

                <div>
                  <p className="text-sm font-medium">2 rows need attention</p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    These rows contain values that may need review before they
                    are added to FinX.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ====================================== */}
          {/* 4. Import options */}
          {/* ====================================== */}

          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-start gap-3">
                <SectionIcon>
                  <Database className="size-4" />
                </SectionIcon>

                <div>
                  <CardTitle className="text-base">4. Import options</CardTitle>

                  <CardDescription className="mt-1">
                    Decide how FinX should handle your imported transactions.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Duplicate handling */}

              <div>
                <Label>Existing transactions</Label>

                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <OptionCard
                    active={importMode === "skip"}
                    title="Skip duplicates"
                    description="Keep existing transactions and only add new records."
                    onClick={() => setImportMode("skip")}
                  />

                  <OptionCard
                    active={importMode === "replace"}
                    title="Replace duplicates"
                    description="Replace matching transactions with imported data."
                    onClick={() => setImportMode("replace")}
                  />
                </div>
              </div>

              <Separator />

              {/* Categories */}

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-black p-4">
                <Checkbox
                  checked={createMissingCategories}
                  onCheckedChange={(checked) =>
                    setCreateMissingCategories(checked === true)
                  }
                  className="mt-0.5"
                />

                <div>
                  <p className="text-sm font-medium">
                    Create missing categories
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Automatically create categories that don't already exist in
                    your FinX account.
                  </p>
                </div>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <SummaryItem
                  label="Import format"
                  value={format === "csv" ? "CSV" : "Excel"}
                />

                <SummaryItem
                  label="Supported currencies"
                  value={currencies.join(", ")}
                />
              </div>
            </CardContent>
          </Card>

          {/* ====================================== */}
          {/* Ready to import */}
          {/* ====================================== */}

          <Card className="overflow-hidden border-violet-500/20 bg-card">
            <div className="h-1 bg-violet-500/70" />

            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Ready to import</CardTitle>

                  <CardDescription className="mt-1">
                    Review your import settings before adding transactions to
                    FinX.
                  </CardDescription>
                </div>

                <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 sm:flex">
                  <Upload className="size-5" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Summary */}

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <SummaryItem label="File" value={demoFile.name} />

                <SummaryItem
                  label="Transactions"
                  value={`${validRows} ready`}
                />

                <SummaryItem label="Warnings" value={`${warningRows} rows`} />

                <SummaryItem
                  label="Duplicate handling"
                  value={
                    importMode === "skip"
                      ? "Skip duplicates"
                      : "Replace duplicates"
                  }
                />
              </div>

              {/* Import information */}

              <div className="rounded-xl border border-border bg-black p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium">Import summary</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {validRows} transactions will be imported into your
                      account.
                    </p>
                  </div>

                  <Badge
                    variant="outline"
                    className="w-fit border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                  >
                    <CheckCircle2 className="mr-1.5 size-3.5" />
                    Ready
                  </Badge>
                </div>
              </div>

              {/* Warning */}

              <div className="flex items-start gap-3 rounded-xl border border-border bg-violet-500/5 p-4">
                <CircleHelp className="mt-0.5 size-4 shrink-0 text-violet-400" />

                <div>
                  <p className="text-sm font-medium">Review before importing</p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Imported transactions will become part of your FinX
                    financial history. Make sure the mapping and preview look
                    correct before continuing.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Actions */}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={removeFile}
                  disabled={isImporting}
                  className="border-border bg-black"
                >
                  Start over
                </Button>

                <Button
                  type="button"
                  disabled={!fileSelected || !mappingComplete || isImporting}
                  onClick={handleImport}
                  className="bg-violet-600 hover:bg-violet-500"
                >
                  <Upload className="size-4" />

                  {isImporting
                    ? "Importing..."
                    : `Import ${validRows} Transactions`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ======================================== */}
        {/* Footer help */}
        {/* ======================================== */}

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-card p-4">
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

          <div>
            <p className="text-sm font-medium">
              Importing from another finance app?
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Make sure your file contains a date, type, category, and amount
              column. You can map the columns before importing.
            </p>
          </div>

          <ChevronDown className="ml-auto mt-0.5 hidden size-4 text-muted-foreground sm:block" />
        </div>
      </div>
    </main>
  );
}

// ==================================================
// Section icon
// ==================================================

function SectionIcon({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-black text-violet-400">
      {children}
    </div>
  );
}

// ==================================================
// Validation item
// ==================================================

function ValidationItem({
  label,
  value,
  icon,
  success,
  warning,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  success?: boolean;
  warning?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-black p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}

        <span className="text-xs">{label}</span>
      </div>

      <p
        className={`mt-2 text-xl font-semibold ${
          success
            ? "text-emerald-400"
            : warning
              ? "text-yellow-400"
              : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

// ==================================================
// Option card
// ==================================================

function OptionCard({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition ${
        active
          ? "border-violet-500/30 bg-violet-500/5"
          : "border-border bg-black hover:border-border/80"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">{title}</p>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>

        {active && (
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-400">
            <Check className="size-3" />
          </div>
        )}
      </div>
    </button>
  );
}

// ==================================================
// Summary item
// ==================================================

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-black p-4">
      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="mt-2 truncate text-sm font-medium">{value}</p>
    </div>
  );
}
