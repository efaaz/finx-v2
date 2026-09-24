import z from "zod";

export const CreateTransactionSchema = z.object({
  type: z.enum(["income", "spending"]),
  categoryId: z.string().min(1, "Category is required"),
  amount: z.number().positive("Amount must be a positive number"),
  date: z
    .string(),
  note: z.string().optional(),
});

export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;

