export type ExportFormat = "csv" | "excel";

export type DateRange = "all" | "month" | "3months" | "year" | "custom";

export type TransactionType = "all" | "income" | "spending";

export type ExportColumn = {
  id:
    | "date"
    | "type"
    | "category"
    | "amount"
    | "currency"
    | "note"
    | "transactionId"
    | "createdAt";

  label: string;
  description: string;
  defaultSelected: boolean;
};
