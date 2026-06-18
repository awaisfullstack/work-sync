"use client";

import { cn } from "@/lib/utils";
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
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { useLoginMutation } from "@/store/api/authApi";

import { FieldErrors, useForm } from "react-hook-form";
import { LoginFormValues, loginSchema } from "@/validators/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { setUser } from "@/store/slices/authSlice";
import { toast } from "sonner";
import { formatApiError } from "@/lib/utils/formatError";
import { logFrontendError } from "@/lib/logger/frontendLogger";
import { logFormValidationIssue } from "@/lib/logger/formValidationLogger";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      const response = await login(values).unwrap();
      if (response.success) {
        dispatch(setUser(response.data.user));
        router.replace("/dashboard");
        toast.success(response.message || "Login successful!");
        reset();
      }
    } catch (error: unknown) {
      const message = formatApiError(error);
      void logFrontendError("Login error", error, {
        source: "auth.login",
        metadata: {
          email: values.email,
          message,
        },
      });
      toast.error(message);
    }
  }

  function onInvalid(errors: FieldErrors<LoginFormValues>) {
    void logFormValidationIssue("Login", errors, "auth.login.form");
  }

  return (
    <Card className={cn("w-full max-w-md", className)} {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Login to continue to WorkSync</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
              />
              {errors.email?.message && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="********"
                {...register("password")}
              />
              {errors.password?.message && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </Field>
            <Field>
              <Button disabled={isLoading} type="submit">
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
