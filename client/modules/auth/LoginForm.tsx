"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";

import { useForm } from "react-hook-form";
import { LoginFormValues, loginSchema } from "@/validators/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { setUser } from "@/store/slices/authSlice";
import { toast } from "sonner";
import { formatApiError } from "@/lib/utils/formatError";
import { loginAction } from "@/app/actions/auth.actions";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);

    try {
      // Call server action — sets httpOnly cookie server-side
      const result = await loginAction(values);

      if (result.success) {
        dispatch(setUser(result.user)); // update Redux
        toast.success(result.message || "Login successful!");
        reset();
        router.replace("/dashboard"); // middleware sees cookie 
      } else {
        toast.error(result.message);
      }
    } catch (error: unknown) {
      const message = formatApiError(error);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className={cn("w-full max-w-md", className)} {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Login to continue to WorkSync</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
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
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
