export type ImportFormat = "csv" | "excel";

export type MappingKey = "date" | "type" | "category" | "amount" | "currency" | "note";

export type ImportMode = "skip" | "replace";

export type ColumnMapping = {
  key: MappingKey;
  label: string;
  description: string;
  source: string;
  required: boolean;
};

export type PreviewTransaction = {
  date: string;
  type: string;
  category: string;
  amount: string;
  currency: string;
  note: string;
};
