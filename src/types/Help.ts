export type ReportStatus = "open" | "in-progress" | "resolved";

export type ReportPriority = "low" | "medium" | "high";

export type ReportCategory =
  | "bug"
  | "transaction"
  | "account"
  | "technical"
  | "other";

export type Report = {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  priority: ReportPriority;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
};
