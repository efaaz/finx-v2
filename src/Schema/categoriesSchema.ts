import { z } from "zod";
export const categorySchema = z.object({
  categoryName: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(30, "Category name must be less than 30 characters"),

  type: z.enum(["income", "spending"]),
});