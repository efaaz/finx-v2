"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  FolderPlus,
  Loader2,
  Plus,
  Trash2,
  WalletCards,
} from "lucide-react";

import { api } from "@/lib/api/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import { Badge } from "@/components/ui/badge";
import {
  Category,
  CategoryFormValues,
  CategoriesResponse,
} from "@/types/categories";
import { categorySchema } from "@/Schema/categoriesSchema";
import { Skeleton } from "@/components/ui/skeleton";

const API = {
  getCategories: "/categories/getUserCreatedCategories",
  createCategory: "/categories/createCategory",
  deleteCategory: (id: string) => `/categories/delete/${id}`,
};

// ==================================================
// Page
// ==================================================

export default function CategoriesPage() {
  const queryClient = useQueryClient();

  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  const { data, isPending, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get<CategoriesResponse>(API.getCategories);
      console.log("Fetched categories:", response);
      return response.data.data;
    },
  });
  console.log("Categories data:", data);
  // ----------------------------------------------
  // Form
  // ----------------------------------------------

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: "",
      type: "spending",
    },
  });

  // ----------------------------------------------
  // Create category
  // ----------------------------------------------

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

  // ----------------------------------------------
  // Delete category
  // ----------------------------------------------

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

  const incomeCategories =
    data?.categories?.filter((category) => category.type === "income") ?? [];

  const spendingCategories =
    data?.categories?.filter((category) => category.type === "spending") ?? [];

  const handleSubmit = (values: CategoryFormValues) => {
    createCategoryMutation.mutate(values);
  };

  // ----------------------------------------------
  // Delete
  // ----------------------------------------------

  const handleDelete = () => {
    if (!categoryToDelete) return;

    deleteCategoryMutation.mutate(categoryToDelete._id);
  };

  return (
    <main className="min-h-screen bg-black text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ========================================= */}
        {/* Header */}
        {/* ========================================= */}

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

        {/* ========================================= */}
        {/* Create category */}
        {/* ========================================= */}

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
                      form.setValue("type", value, {
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

        {/* ========================================= */}
        {/* Categories */}
        {/* ========================================= */}

        {isPending ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-44" />
                <Skeleton className="mt-2 h-4 w-64" />
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Skeleton className="h-14 w-full" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-44" />
                <Skeleton className="mt-2 h-4 w-64" />
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Skeleton className="h-14 w-full" />
                </div>
              </CardContent>
            </Card>
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
            {/* ===================================== */}
            {/* Spending */}
            {/* ===================================== */}

            <CategorySection
              title="Spending"
              description="Categories used for your expenses."
              icon={<ArrowDownLeft className="h-5 w-5 text-red-400" />}
              categories={spendingCategories}
              onDelete={setCategoryToDelete}
            />

            {/* ===================================== */}
            {/* Income */}
            {/* ===================================== */}

            <CategorySection
              title="Income"
              description="Categories used for your earnings."
              icon={<ArrowUpRight className="h-5 w-5 text-emerald-400" />}
              categories={incomeCategories}
              onDelete={setCategoryToDelete}
            />
          </div>
        )}
      </div>

      {/* =========================================== */}
      {/* Delete confirmation */}
      {/* =========================================== */}

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
                {categoryToDelete?.categoryName}
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

          <AlertDialogFooter>
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

// ==================================================
// Category section
// ==================================================

type CategorySectionProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  categories: Category[];
  onDelete: (category: Category) => void;
};

function CategorySection({
  title,
  description,
  icon,
  categories,
  onDelete,
}: CategorySectionProps) {
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
        {categories.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No {title.toLowerCase()} categories yet.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => {
              const isDefault = !category.userId;

              return (
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

                      {isDefault ? (
                        <Badge
                          variant="outline"
                          className="mt-1 border-border text-[10px] text-muted-foreground"
                        >
                          Default
                        </Badge>
                      ) : (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Custom category
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Only user-created categories can be deleted */}

                  {!isDefault && (
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
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
