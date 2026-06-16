import { z } from "zod";

export const manualShiftSchema = z
  .object({
    userId: z.string().min(1, "Employee is required"),
    clockInDate: z.string().min(1, "Clock in date is required"),
    clockInTime: z.string().min(1, "Clock in time is required"),
    clockOutDate: z.string().optional(),
    clockOutTime: z.string().optional(),
  })
  .refine(
    (values) => (!values.clockOutDate && !values.clockOutTime) || Boolean(values.clockOutDate && values.clockOutTime),
    {
      message: "Clock out date and time must both be provided",
      path: ["clockOutTime"],
    },
  )
  .refine(
    (values) => {
      if (!values.clockOutDate || !values.clockOutTime) {
        return true;
      }

      return (
        new Date(`${values.clockOutDate}T${values.clockOutTime}`) >
        new Date(`${values.clockInDate}T${values.clockInTime}`)
      );
    },
    {
      message: "Clock out time must be after clock in time",
      path: ["clockOutTime"],
    },
  );

export type ManualShiftFormValues = z.infer<typeof manualShiftSchema>;
