

import { z } from "zod";

export const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Project title is required")
    .min(3, "Project title must be at least 3 characters")
    .max(120, "Project title must be less than 120 characters"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),

  status: z.enum(["ACTIVE", "COMPLETED", "ARCHIVED"], {
    message: "Please select a valid status",
  }),

  deadline: z.string().min(1, "Deadline is required"),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;