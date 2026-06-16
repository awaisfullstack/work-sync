import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .min(3, "Task title must be at least 3 characters")
    .max(120, "Task title cannot exceed 120 characters"),

  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),

  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"], {
    message: "Please select a valid status",
  }),

  dueDate: z.string().min(1, "Due date is required"),

  projectId: z.string().min(1, "Project is required"),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
