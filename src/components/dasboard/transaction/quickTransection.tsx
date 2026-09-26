"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { formatTransactionDate } from "@/lib/formateHelper";
import { currencies } from "@/types/currency";
import { Plus } from "lucide-react";

import {
  CreateTransactionSchema,
  type CreateTransactionInput,
} from "@/Schema/transactionSchema";

import { createTransaction } from "@/lib/api/transactions";
import { type PostTransaction } from "@/types/transaction";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";

const QuickTransection = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useCurrentUser();

  const form = useForm<CreateTransactionInput>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type: "income",
      amount: undefined,
      categoryId: "",
      date: new Date().toISOString(),
      note: "",
    },
  });

  const { control, handleSubmit, reset } = form;

  const createTransactionMutation = useMutation({
    mutationFn: createTransaction,

    onSuccess: () => {
      toast.add({
        title: "Transaction added",
        description: "Your transaction has been added successfully.",
        type: "success",
      });
      reset({
        type: "income",
        amount: undefined,
        categoryId: "",
        date: new Date().toISOString(),
        note: "",
      });

      toast.add({
        title: "Transaction added",
        description: "Your transaction has been added successfully.",
        type: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
    },
    onError: (error) => {
      console.error("CREATE TRANSACTION ERROR:", error);
    },
  });

  const onSubmit = (values: CreateTransactionInput) => {
    console.log("SUBMIT VALUES:", values);

    if (!user) return;

    const data: PostTransaction = {
      userId: user._id,
      ...values,
    };

    createTransactionMutation.mutate(data);
  };

  if (isLoading || !user) {
    return (
      <>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-44" />
            <Skeleton className="mt-2 h-4 w-64" />
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              </div>
              
              <Skeleton className="h-8 w-full" />
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  const currencySymbol =
    currencies.find((item) => item.code === user.defaultCurrency)?.symbol ?? "";

  return (
    <Card className="border-border/80 bg-card">
      <CardHeader>
        <CardTitle className="font-sans text-lg">Add transaction</CardTitle>

        <CardDescription>
          Record a transaction without leaving this page.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid items-center gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* Type */}
            <Controller
              name="type"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <label className="pl-1 text-sm font-medium">Type</label>

                  <select
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="spending">Spending</option>
                    <option value="income">Income</option>
                  </select>

                  {fieldState.error && (
                    <p className="pl-1 text-xs text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Amount */}
            <Controller
              name="amount"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <label className="pl-1 text-sm font-medium">Amount</label>

                  <div className="flex items-center rounded-md border border-input bg-background">
                    <span className="px-3 text-sm text-muted-foreground">
                      {currencySymbol}
                    </span>

                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;

                        field.onChange(
                          value === "" ? undefined : e.target.valueAsNumber,
                        );
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      className="border-0 focus-visible:ring-0"
                    />
                  </div>

                  {fieldState.error && (
                    <p className="pl-1 text-xs text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Category */}
            <Controller
              name="categoryId"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <label className="pl-1 text-sm font-medium">Category</label>

                  <select
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Select category</option>

                    {user.categories?.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>

                  {fieldState.error && (
                    <p className="pl-1 text-xs text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Date */}
            <Controller
              name="date"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <label className="pl-1 text-sm font-medium">Date</label>

                  <Input value={formatTransactionDate(field.value)} readOnly />

                  {fieldState.error && (
                    <p className="pl-1 text-xs text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Submit */}
            <div className="mt-4 flex items-end">
              <Button
                type="submit"
                disabled={createTransactionMutation.isPending}
                className="w-full gap-2"
              >
                <Plus className="size-4" />

                {createTransactionMutation.isPending ? "Adding..." : "Add"}
              </Button>
            </div>
          </div>

          {/* Note */}
          <Controller
            name="note"
            control={control}
            render={({ field, fieldState }) => (
              <div className="mt-4 space-y-2">
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Add a note (optional)"
                />

                {fieldState.error && (
                  <p className="pl-1 text-xs text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Mutation error */}
          {createTransactionMutation.isError && (
            <p className="mt-3 text-sm text-destructive">
              Failed to add transaction. Please try again.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default QuickTransection;
