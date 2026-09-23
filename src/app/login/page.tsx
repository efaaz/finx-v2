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
import { api } from "@/lib/api/client";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { signinSchema, type SigninInput } from "@/Schema/signinSchema";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "@/components/ui/toast";
import { SigninResponse } from "@/types/auth";
interface ApiError {
  message?: string;
}
export default function LoginForm() {
  const router = useRouter();

  const signinMutation = useMutation<
    SigninResponse,
    AxiosError<ApiError>,
    SigninInput
  >({
    mutationFn: async (data) => {
      console.log("mutation data:", data);

      const response = await api.post<SigninResponse>(
        "/auth/users/login",
        data,
      );
      console.log("response", response);
      return response.data;
    },

    onSuccess: () => {
      toast.add({
        type: "success",
        title: "Logged in successfully",
        description: "You have been successfully logged in.",
      });
      router.replace("/dashboard");
    },
  });

  const serverError = signinMutation.error?.response?.data?.message;

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
  const form = useForm<SigninInput>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });
  const handleSubmit = async (data: SigninInput) => {
    signinMutation.mutate(data);
  };
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm ">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                Login to your account
              </CardTitle>
              <CardDescription className="text-center">
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <FieldGroup>
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
                          placeholder="efaz@example.com"
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
                  {signinMutation.isError && (
                    <FieldError>
                      {serverError ??
                        "Unable to create your account. Please try again."}
                    </FieldError>
                  )}
                  <Field>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={signinMutation.isPending}
                    >
                      {form.formState.isSubmitting ? "Loging in..." : "Login"}
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => googleSignup()}
                    >
                      Login with Google
                    </Button>
                    <FieldDescription className="text-center">
                      Don&apos;t have an account? <Link href="/signup">Sign up</Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
