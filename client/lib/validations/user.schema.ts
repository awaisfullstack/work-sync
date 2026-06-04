import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(80, "Name cannot exceed 80 characters"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),

  role: z.enum(["ADMIN", "EMPLOYEE"], {
    message: "Please select a valid role",
  }),

  departmentId: z.string().nullable(),
});

export const updateUserSchema = createUserSchema.extend({
  password: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || value.length >= 8, {
      message: "Password must be at least 8 characters",
    }),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
export type UserFormValues = CreateUserFormValues | UpdateUserFormValues;
