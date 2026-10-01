"use client";
import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  FolderPlus,
  Loader2,
  Plus,
  Trash2,
  WalletCards,
  Power,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api/client";
import {
  categorySchema,
  type CategoryFormValues,
} from "@/Schema/categoriesSchema";
import type {
  ManagedCategory,
  ManageCategoriesResponse,
  CategoryResponse,
} from "@/types/categories";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const API = {
  getCategories: "/categories/manage",

  createCategory: "/categories/createCategory",

  deleteCategory: (id: string) => `/categories/delete/${id}`,

  toggleCategory: (id: string) => `/categories/${id}/toggle`,
};

export default function CategoriesPage() {
  const queryClient = useQueryClient();

  const [categoryToDelete, setCategoryToDelete] =
    useState<ManagedCategory | null>(null);

  const [togglingCategoryId, setTogglingCategoryId] = useState<string | null>(
    null,
  );

  const { data, isPending, isError } = useQuery<ManageCategoriesResponse>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get<CategoryResponse>(API.getCategories);

      return response.data.data;
    },
  });

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),

    defaultValues: {
      categoryName: "",
      type: "spending",
    },
  });

  // Create category
  const createCategoryMutation = useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      const response = await api.post(API.createCategory, values);

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      form.reset({
        categoryName: "",
        type: "spending",
      });
    },
  });

  // Delete category
  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const response = await api.delete(API.deleteCategory(categoryId));

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      setCategoryToDelete(null);
    },
  });

  // Toggle default category
  const toggleCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const response = await api.patch(API.toggleCategory(categoryId));

      return response.data;
    },

    onMutate: (categoryId) => {
      setTogglingCategoryId(categoryId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },

    onSettled: () => {
      setTogglingCategoryId(null);
    },
  });

  // Categories

  const allDefaultCategories = data?.defaultCategories ?? [];

  const allUserCategories = data?.userCategories ?? [];

  const incomeDefaultCategories = allDefaultCategories.filter(
    (category) => category.type === "income",
  );

  const spendingDefaultCategories = allDefaultCategories.filter(
    (category) => category.type === "spending",
  );

  const incomeUserCategories = allUserCategories.filter(
    (category) => category.type === "income",
  );

  const spendingUserCategories = allUserCategories.filter(
    (category) => category.type === "spending",
  );

  // Handlers
  const handleSubmit = (values: CategoryFormValues) => {
    createCategoryMutation.mutate(values);
  };

  const handleDelete = () => {
    if (!categoryToDelete) return;

    deleteCategoryMutation.mutate(categoryToDelete._id);
  };

  const handleToggleCategory = (categoryId: string) => {
    toggleCategoryMutation.mutate(categoryId);
  };

  return (
    <main className="min-h-screen bg-black text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}

        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-3 py-1 text-xs font-medium text-violet-300">
            <WalletCards className="h-3.5 w-3.5" />
            Expense organization
          </div>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Categories
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Organize your income and spending with categories that match the way
            you manage your money.
          </p>
        </div>
        {/* Create category */}
        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderPlus className="h-5 w-5 text-violet-400" />
              Create category
            </CardTitle>

            <CardDescription>
              Add a custom category to your account.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="grid gap-5 md:grid-cols-[1fr_220px_auto]"
            >
              {/* Category name */}

              <div className="space-y-2">
                <Label htmlFor="categoryName">Category name</Label>

                <Input
                  id="categoryName"
                  placeholder="e.g. Groceries"
                  {...form.register("categoryName")}
                  className="bg-card"
                />

                {form.formState.errors.categoryName && (
                  <p className="text-xs text-red-400">
                    {form.formState.errors.categoryName.message}
                  </p>
                )}
              </div>

              {/* Category type */}

              <div className="space-y-2">
                <Label>Category type</Label>

                <Select
                  value={form.watch("type")}
                  onValueChange={(value) => {
                    if (value) {
                      form.setValue("type", value as "income" | "spending", {
                        shouldValidate: true,
                      });
                    }
                  }}
                >
                  <SelectTrigger className="bg-card">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="spending">Spending</SelectItem>

                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>

                {form.formState.errors.type && (
                  <p className="text-xs text-red-400">
                    {form.formState.errors.type.message}
                  </p>
                )}
              </div>

              {/* Create button */}

              <div className="flex items-end">
                <Button
                  type="submit"
                  disabled={createCategoryMutation.isPending}
                  className="w-full bg-violet-600 hover:bg-violet-500 md:w-auto"
                >
                  {createCategoryMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create
                    </>
                  )}
                </Button>
              </div>
            </form>

            {createCategoryMutation.isSuccess && (
              <div className="mt-4 flex items-center gap-2 text-sm text-emerald-400">
                <Check className="h-4 w-4" />
                Category created successfully.
              </div>
            )}

            {createCategoryMutation.isError && (
              <p className="mt-4 text-sm text-red-400">
                {(createCategoryMutation.error as any)?.response?.data
                  ?.message || "Failed to create category."}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Default category information */}
        <div className="mb-6 rounded-2xl border border-border bg-card p-4 sm:p-5">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
              <Power className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-sm font-medium">Manage default categories</h2>

              <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
                Default categories are available automatically. Disable any
                category you do not want to see when creating transactions.
                Disabling a category does not remove your previous transactions.
              </p>
            </div>
          </div>
        </div>
        {/* Categories */}
        {isPending ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <CategorySkeleton />
            <CategorySkeleton />
          </div>
        ) : isError ? (
          <Card className="border-border bg-card">
            <CardContent className="flex min-h-50 items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Failed to load categories. Please try again later.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Spending */}
            <CategorySection
              title="Spending"
              description="Categories used for your expenses."
              icon={<ArrowDownLeft className="h-5 w-5 text-red-400" />}
              defaultCategories={spendingDefaultCategories}
              userCategories={spendingUserCategories}
              onDelete={setCategoryToDelete}
              onToggle={handleToggleCategory}
              togglingCategoryId={togglingCategoryId}
            />

            {/* Income */}
            <CategorySection
              title="Income"
              description="Categories used for your earnings."
              icon={<ArrowUpRight className="h-5 w-5 text-emerald-400" />}
              defaultCategories={incomeDefaultCategories}
              userCategories={incomeUserCategories}
              onDelete={setCategoryToDelete}
              onToggle={handleToggleCategory}
              togglingCategoryId={togglingCategoryId}
            />
          </div>
        )}
      </div>
      {/* Delete confirmation */}
      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setCategoryToDelete(null);
          }
        }}
      >
        <AlertDialogContent className="border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {categoryToDelete?.categoryName}{" "}
              </span>
              ? Existing transactions using this category may still reference
              it.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteCategoryMutation.isError && (
            <p className="text-sm text-red-400">
              {(deleteCategoryMutation.error as any)?.response?.data?.message ||
                "Failed to delete category."}
            </p>
          )}

          <AlertDialogFooter className="bg-card">
            <AlertDialogCancel disabled={deleteCategoryMutation.isPending}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteCategoryMutation.isPending}
              className="bg-red-600 text-white hover:bg-red-500"
            >
              {deleteCategoryMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

// Category skeleton

function CategorySkeleton() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <Skeleton className="h-5 w-44" />
        <Skeleton className="mt-2 h-4 w-64" />
      </CardHeader>

      <CardContent className="space-y-3">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </CardContent>
    </Card>
  );
}

// Category section
type CategorySectionProps = {
  title: string;
  description: string;
  icon: React.ReactNode;

  defaultCategories: ManagedCategory[];
  userCategories: ManagedCategory[];

  onDelete: (category: ManagedCategory) => void;

  onToggle: (categoryId: string) => void;

  togglingCategoryId: string | null;
};

function CategorySection({
  title,
  description,
  icon,
  defaultCategories,
  userCategories,
  onDelete,
  onToggle,
  togglingCategoryId,
}: CategorySectionProps) {
  const hasCategories =
    defaultCategories.length > 0 || userCategories.length > 0;

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>

        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        {!hasCategories ? (
          <div className="rounded-xl border border-dashed border-border bg-card px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No {title.toLowerCase()} categories yet.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Custom categories */}
            {userCategories.length > 0 && (
              <div className="space-y-2">
                <div className="px-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Your categories
                  </p>
                </div>

                <div className="space-y-2">
                  {userCategories.map((category) => (
                    <div
                      key={category._id}
                      className="group flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 transition hover:border-violet-500/20"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                            category.type === "income"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {category.type === "income" ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownLeft className="h-4 w-4" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {category.categoryName}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Custom category
                          </p>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(category)}
                        className="shrink-0 text-muted-foreground opacity-70 transition hover:bg-red-500/10 hover:text-red-400 sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />

                        <span className="sr-only">
                          Delete {category.categoryName}
                        </span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Default categories */}

            {defaultCategories.length > 0 && (
              <div className="space-y-2">
                <div className="px-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Default categories
                  </p>
                </div>

                <div className="space-y-2">
                  {defaultCategories.map((category) => {
                    const isToggling = togglingCategoryId === category._id;

                    return (
                      <div
                        key={category._id}
                        className={`group flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition ${
                          category.isDisabled
                            ? "border-border/60 bg-black/20 opacity-70"
                            : "border-border bg-card hover:border-violet-500/20"
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                              category.type === "income"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-red-500/10 text-red-400"
                            }`}
                          >
                            {category.type === "income" ? (
                              <ArrowUpRight className="h-4 w-4" />
                            ) : (
                              <ArrowDownLeft className="h-4 w-4" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p
                              className={`truncate text-sm font-medium ${
                                category.isDisabled
                                  ? "text-muted-foreground"
                                  : "text-foreground"
                              }`}
                            >
                              {category.categoryName}
                            </p>

                            <div className="mt-1 flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="border-border text-[10px] text-muted-foreground"
                              >
                                Default
                              </Badge>

                              {category.isDisabled && (
                                <Badge
                                  variant="outline"
                                  className="border-amber-500/20 bg-amber-500/5 text-[10px] text-amber-400"
                                >
                                  Disabled
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          {isToggling && (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          )}

                          <Switch
                            checked={!category.isDisabled}
                            disabled={isToggling}
                            onCheckedChange={() => onToggle(category._id)}
                            aria-label={`${
                              category.isDisabled ? "Enable" : "Disable"
                            } ${category.categoryName}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
