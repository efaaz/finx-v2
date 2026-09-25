"use client";

import { useMemo, useState } from "react";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileQuestion,
  LifeBuoy,
  MessageSquareText,
  Plus,
  Search,
  Send,
  Settings2,
  ShieldAlert,
  Sparkles,
  TerminalSquare,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Separator } from "@/components/ui/separator";
import FeatureComingSoon from "@/components/ui/FeatureComingSoon";

// ==================================================
// Types
// ==================================================

type ReportStatus = "open" | "in-progress" | "resolved";

type ReportPriority = "low" | "medium" | "high";

type ReportCategory = "bug" | "transaction" | "account" | "technical" | "other";

type Report = {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  priority: ReportPriority;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
};

// ==================================================
// Hardcoded data
// ==================================================

const reports: Report[] = [
  {
    id: "FINX-1042",
    title: "Transaction amount is showing incorrectly",
    description:
      "I added a spending transaction for 1,500 BDT but the dashboard is showing 15,000 BDT.",
    category: "transaction",
    priority: "high",
    status: "in-progress",
    createdAt: "Sep 24, 2026",
    updatedAt: "Sep 25, 2026",
  },
  {
    id: "FINX-1027",
    title: "Unable to upload profile picture",
    description:
      "The profile picture upload finishes but the old image is still displayed.",
    category: "account",
    priority: "medium",
    status: "resolved",
    createdAt: "Sep 18, 2026",
    updatedAt: "Sep 20, 2026",
  },
  {
    id: "FINX-0988",
    title: "Monthly summary is not updating",
    description:
      "Today's transaction was added successfully but the monthly summary did not change immediately.",
    category: "bug",
    priority: "medium",
    status: "open",
    createdAt: "Sep 12, 2026",
    updatedAt: "Sep 12, 2026",
  },
];

// ==================================================
// Page
// ==================================================

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        report.title.toLowerCase().includes(search.toLowerCase()) ||
        report.id.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || report.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <main className="min-h-screen bg-black text-foreground">
      <FeatureComingSoon />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ==================================================
            Header
        ================================================== */}

        <section className="relative mb-10 overflow-hidden rounded-3xl border border-border bg-card px-6 py-8 sm:px-8 sm:py-10">
          {/* subtle decorative glow */}

          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-cyan-500/5 blur-3xl" />

          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-3 py-1 text-xs font-medium text-violet-300">
              <LifeBuoy className="h-3.5 w-3.5" />
              FinX Help Center
            </div>

            <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
              How can we help?
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Found a bug, something behaving unexpectedly, or need help with
              your account? Report it here and keep track of your support
              requests.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                className="bg-violet-600 hover:bg-violet-500"
                onClick={() =>
                  document.getElementById("report-issue")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
              >
                <Plus className="h-4 w-4" />
                Report an issue
              </Button>

              <Button
                variant="outline"
                className="border-border bg-card"
                onClick={() =>
                  document.getElementById("my-reports")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
              >
                View my reports
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* ==================================================
            Quick help cards
        ================================================== */}

        <section className="mb-10 grid gap-4 sm:grid-cols-3">
          <QuickHelpCard
            icon={<FileQuestion className="h-5 w-5 text-violet-400" />}
            title="Common questions"
            description="Check the FAQ before submitting a report."
          />

          <QuickHelpCard
            icon={<ShieldAlert className="h-5 w-5 text-red-400" />}
            title="Report a bug"
            description="Tell us exactly what went wrong."
          />

          <QuickHelpCard
            icon={<MessageSquareText className="h-5 w-5 text-cyan-400" />}
            title="Track your reports"
            description="See the current status of issues you submitted."
          />
        </section>

        {/* ==================================================
            Main content
        ================================================== */}

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          {/* ==================================================
              Report issue
          ================================================== */}

          <Card id="report-issue" className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-violet-400" />
                Report an issue
              </CardTitle>

              <CardDescription>
                Give us enough information to reproduce and understand the
                problem.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form className="space-y-5">
                {/* Title */}

                <div className="space-y-2">
                  <Label htmlFor="title">Issue title</Label>

                  <Input
                    id="title"
                    placeholder="e.g. Transaction total is incorrect"
                    className="bg-card"
                  />
                </div>

                {/* Category + Priority */}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Category</Label>

                    <Select defaultValue="bug">
                      <SelectTrigger className="bg-card">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="bug">Bug / Error</SelectItem>

                        <SelectItem value="transaction">
                          Transactions
                        </SelectItem>

                        <SelectItem value="account">Account</SelectItem>

                        <SelectItem value="technical">
                          Technical issue
                        </SelectItem>

                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Priority</Label>

                    <Select defaultValue="medium">
                      <SelectTrigger className="bg-card">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>

                        <SelectItem value="medium">Medium</SelectItem>

                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}

                <div className="space-y-2">
                  <Label htmlFor="description">What happened?</Label>

                  <Textarea
                    id="description"
                    placeholder="Describe the problem, what you expected to happen, and what actually happened..."
                    className="min-h-37.5 resize-none bg-card"
                  />

                  <p className="text-xs text-muted-foreground">
                    Avoid including passwords, access tokens, or other sensitive
                    information.
                  </p>
                </div>

                {/* Reproduction */}

                <div className="space-y-2">
                  <Label htmlFor="steps">
                    Steps to reproduce
                    <span className="ml-2 text-xs text-muted-foreground">
                      Optional
                    </span>
                  </Label>

                  <Textarea
                    id="steps"
                    placeholder={`1. Go to Transactions
2. Create a spending transaction
3. Enter the amount
4. Check the dashboard`}
                    className="min-h-27.5 resize-none bg-card font-mono text-sm"
                  />
                </div>

                <Separator />

                {/* Submit */}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CircleHelp className="h-4 w-4" />
                    Please provide screenshots when relevant.
                  </div>

                  <Button
                    type="button"
                    className="bg-violet-600 hover:bg-violet-500"
                  >
                    <Send className="h-4 w-4" />
                    Submit report
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* ==================================================
              Before reporting
          ================================================== */}

          <div className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-cyan-400" />
                  Before you report
                </CardTitle>

                <CardDescription>
                  A few things that can help resolve your issue faster.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <ChecklistItem
                    title="Refresh the page"
                    description="The issue may be caused by temporary state."
                  />

                  <ChecklistItem
                    title="Check your internet connection"
                    description="Make sure requests are reaching FinX."
                  />

                  <ChecklistItem
                    title="Try the action again"
                    description="Mention whether the issue happens every time."
                  />

                  <ChecklistItem
                    title="Describe the expected result"
                    description="Tell us what you expected FinX to do."
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TerminalSquare className="h-5 w-5 text-violet-400" />
                  Useful information
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="rounded-xl border border-border bg-background/40 p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <InfoItem label="Browser" value="Chrome" />

                    <InfoItem label="Platform" value="Windows" />

                    <InfoItem label="App version" value="v1.0.0" />

                    <InfoItem label="Environment" value="Production" />
                  </div>
                </div>

                <p className="mt-3 text-xs text-muted-foreground">
                  This information can automatically be attached to your report
                  later.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ==================================================
            My reports
        ================================================== */}

        <section id="my-reports" className="mt-10">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">My reports</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Track issues and requests you have submitted.
              </p>
            </div>

            <Badge variant="outline" className="w-fit border-border">
              {reports.length} reports
            </Badge>
          </div>

          {/* Search / filter */}

          <Card className="mb-5 border-border bg-card">
            <CardContent className="p-4">
              <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by title or report ID..."
                    className="bg-card pl-9"
                  />
                </div>

                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value ?? "all")}
                >
                  <SelectTrigger className="bg-card">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>

                    <SelectItem value="open">Open</SelectItem>

                    <SelectItem value="in-progress">In progress</SelectItem>

                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reports */}

          <div className="space-y-3">
            {filteredReports.length === 0 ? (
              <Card className="border-border bg-card">
                <CardContent className="flex min-h-45 flex-col items-center justify-center text-center">
                  <FileQuestion className="mb-3 h-8 w-8 text-muted-foreground" />

                  <p className="font-medium">No reports found</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Try changing your search or status filter.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))
            )}
          </div>
        </section>

        {/* ==================================================
            FAQ
        ================================================== */}

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-xl font-semibold">
              Frequently asked questions
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Quick answers to common FinX questions.
            </p>
          </div>

          <Card className="border-border bg-card">
            <CardContent className="p-2 sm:p-4">
              <Accordion className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="px-3">
                    Why is my transaction not appearing in the dashboard?
                  </AccordionTrigger>

                  <AccordionContent className="px-3 text-muted-foreground">
                    Make sure the transaction was successfully saved. Refresh
                    the dashboard and check whether the transaction appears in
                    your transaction history.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="px-3">
                    Can I delete a category I created?
                  </AccordionTrigger>

                  <AccordionContent className="px-3 text-muted-foreground">
                    Yes. Custom categories can be removed from the Categories
                    page. Default categories cannot be deleted.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="px-3">
                    Why hasn't my monthly summary changed?
                  </AccordionTrigger>

                  <AccordionContent className="px-3 text-muted-foreground">
                    The dashboard summary depends on your daily records. Refresh
                    the page and verify that the transaction was recorded for
                    the correct date.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="px-3">
                    What information should I include in a bug report?
                  </AccordionTrigger>

                  <AccordionContent className="px-3 text-muted-foreground">
                    Include what you were trying to do, what happened, what you
                    expected to happen, and the steps needed to reproduce the
                    issue.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

// ==================================================
// Quick Help Card
// ==================================================

type QuickHelpCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function QuickHelpCard({ icon, title, description }: QuickHelpCardProps) {
  return (
    <Card className="group border-border bg-card transition hover:border-violet-500/20">
      <CardContent className="p-5">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background">
          {icon}
        </div>

        <h3 className="text-sm font-medium">{title}</h3>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>

        <ChevronRight className="mt-4 h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-violet-400" />
      </CardContent>
    </Card>
  );
}

// ==================================================
// Checklist
// ==================================================

type ChecklistItemProps = {
  title: string;
  description: string;
};

function ChecklistItem({ title, description }: ChecklistItemProps) {
  return (
    <div className="flex gap-3">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

      <div>
        <p className="text-sm font-medium">{title}</p>

        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

// ==================================================
// Info item
// ==================================================

type InfoItemProps = {
  label: string;
  value: string;
};

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

// ==================================================
// Report Card
// ==================================================

function ReportCard({ report }: { report: Report }) {
  return (
    <Card className="group border-border bg-card transition hover:border-violet-500/20">
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-violet-400">
                {report.id}
              </span>

              <StatusBadge status={report.status} />

              <PriorityBadge priority={report.priority} />
            </div>

            <h3 className="text-base font-medium">{report.title}</h3>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              {report.description}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <span className="capitalize">{report.category}</span>

              <span className="flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5" />
                Submitted {report.createdAt}
              </span>

              <span>Updated {report.updatedAt}</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            View details
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ==================================================
// Status Badge
// ==================================================

function StatusBadge({ status }: { status: ReportStatus }) {
  if (status === "resolved") {
    return (
      <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/10">
        <CheckCircle2 className="mr-1 h-3 w-3" />
        Resolved
      </Badge>
    );
  }

  if (status === "in-progress") {
    return (
      <Badge className="border-cyan-500/20 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/10">
        <Clock3 className="mr-1 h-3 w-3" />
        In progress
      </Badge>
    );
  }

  return (
    <Badge className="border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500/10">
      <AlertCircle className="mr-1 h-3 w-3" />
      Open
    </Badge>
  );
}

// ==================================================
// Priority Badge
// ==================================================

function PriorityBadge({ priority }: { priority: ReportPriority }) {
  if (priority === "high") {
    return (
      <Badge variant="outline" className="border-red-500/20 text-red-400">
        High
      </Badge>
    );
  }

  if (priority === "medium") {
    return (
      <Badge variant="outline" className="border-amber-500/20 text-amber-400">
        Medium
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="border-border text-muted-foreground">
      Low
    </Badge>
  );
}
