import { z } from "zod";

export const signinSchema = z
.object({
    email: z
    .email()
    .toLowerCase(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long"),
  })

export type SigninInput = z.infer<typeof signinSchema>;