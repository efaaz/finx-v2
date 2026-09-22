import { z } from "zod";

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),

    email: z
      .email()
      .toLowerCase(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long"),
  })

export type SignupInput = z.infer<typeof signupSchema>;