

import { z } from "zod";

export const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Project title is required")
    .min(3, "Project title must be at least 3 characters")
    .max(150, "Project title must be less than 150 characters"),

  description: z
    .string()
    .trim()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),

  status: z.enum(["ACTIVE", "COMPLETED", "ARCHIVED"], {
    message: "Please select a valid status",
  }),

  deadline: z.string().nullable(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;