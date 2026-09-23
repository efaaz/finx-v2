"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signupSchema, type SignupInput } from "@/Schema/signupSchema";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { type SignupResponse } from "@/types/auth";
import { api } from "@/lib/api/client";
import { toast } from "@/components/ui/toast";
import { useGoogleLogin } from "@react-oauth/google";
interface ApiError {
  message?: string;
}
export default function SignUpPage() {
  const router = useRouter();
  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onBlur",
  });
  const signupMutation = useMutation<
    SignupResponse,
    AxiosError<ApiError>,
    SignupInput
  >({
    mutationFn: async (data) => {
      console.log("data", data);

      const response = await api.post<SignupResponse>(
        "/auth/users/register",
        data,
      );
      console.log("response", response);
      return response.data;
    },

    onSuccess: () => {
      toast.add({
        type: "success",
        title: "Account created successfully",
        description: "You have been successfully signed up.",
      });
      router.replace("/dashboard");
    },
  });
  const onSubmit = (data: SignupInput) => {
    signupMutation.mutate(data);
  };

  const googleSignup = useGoogleLogin({
  flow: "auth-code",

  onSuccess: async (codeResponse) => {
    try {
      const response = await api.post("/auth/users/google-signin", {
        code: codeResponse.code,
      });

      console.log(response.data);

      router.replace("/dashboard");
    } catch (error) {
      console.error("Google signup failed:", error);
    }
  },

  onError: () => {
    console.error("Google authorization failed");
  },
});

  const serverError = signupMutation.error?.response?.data?.message;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <h1 className="flex items-center gap-2 self-center font-heading text-3xl font-medium">
          <Link href="/">FinX</Link>
        </h1>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-sans text-xl">
              Create your account
            </CardTitle>

            <CardDescription>
              Enter your information below to create your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>

                      <Input
                        {...field}
                        id={field.name}
                        type="text"
                        placeholder="John Doe"
                        autoComplete="name"
                        aria-invalid={fieldState.invalid}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>

                      <Input
                        {...field}
                        id={field.name}
                        type="email"
                        placeholder="m@example.com"
                        autoComplete="email"
                        aria-invalid={fieldState.invalid}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>

                      <Input
                        {...field}
                        id={field.name}
                        type="password"
                        placeholder="Enter your password"
                        autoComplete="new-password"
                        aria-invalid={fieldState.invalid}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                {/* Backend error */}
                {signupMutation.isError && (
                  <FieldError>
                    {serverError ??
                      "Unable to create your account. Please try again."}
                  </FieldError>
                )}
                <Field>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={signupMutation.isPending}
                  >
                    {form.formState.isSubmitting
                      ? "Creating account..."
                      : "Create Account"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => googleSignup()}
                  >
                    Continue with Google
                  </Button>
                  <FieldDescription className="text-center">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="underline underline-offset-4"
                    >
                      Sign in
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
