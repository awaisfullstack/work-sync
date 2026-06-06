import { z } from "zod";

export const manualShiftSchema = z
  .object({
    userId: z.string().min(1, "Employee is required"),
    clockInDate: z.string().min(1, "Clock in date is required"),
    clockInTime: z.string().min(1, "Clock in time is required"),
    clockOutDate: z.string().min(1, "Clock out date is required"),
    clockOutTime: z.string().min(1, "Clock out time is required"),
  })
  .refine(
    (values) => {
      if (
        !values.clockInDate ||
        !values.clockInTime ||
        !values.clockOutDate ||
        !values.clockOutTime
      ) {
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
