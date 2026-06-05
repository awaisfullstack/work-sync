import { z } from "zod";

export const manualShiftSchema = z
  .object({
    userId: z.string().min(1, "Employee is required"),
    clockInAt: z.string().min(1, "Clock in time is required"),
    clockOutAt: z.string().min(1, "Clock out time is required"),
  })
  .refine(
    (values) => new Date(values.clockOutAt) > new Date(values.clockInAt),
    {
      message: "Clock out time must be after clock in time",
      path: ["clockOutAt"],
    },
  );

export type ManualShiftFormValues = z.infer<typeof manualShiftSchema>;
