import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .min(3, "Task title must be at least 3 characters")
    .max(120, "Task title cannot exceed 120 characters"),

  description: z
    .string()
    .min(1, "Task description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),

  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"], {
    message: "Please select a valid status",
  }),

  dueDate: z.string().min(1, "Due date is required"),

  projectId: z.string().min(1, "Project is required"),

  assignedUserId: z.string().min(1, "Assigned user is required"),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
