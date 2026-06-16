import { baseApi } from "@/store/api/baseApi";
import type { SuccessResponse, PaginatedResponse } from "@/types/api-response";
import type {
  ManualShiftPayload,
  Shift,
  ShiftQuery,
  ShiftWorkedHours,
  TotalActiveShifts,
} from "@/types/shift.types";

export const shiftsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    clockIn: builder.mutation<SuccessResponse<Shift>, void>({
      query: () => ({
        url: "/shifts/clock-in",
        method: "POST",
      }),
      invalidatesTags: [
        { type: "Shifts", id: "LIST" },
        { type: "Shifts", id: "ACTIVE" },
        { type: "Shifts", id: "WEEKLY_HOURS" },
        { type: "Shifts", id: "WORKED_HOURS" },
        { type: "Shifts", id: "ALL_WORKED_HOURS" },
        "Dashboard",
        "ActivityLogs",
      ],
    }),
    clockOut: builder.mutation<SuccessResponse<null>, void>({
      query: () => ({
        url: "/shifts/clock-out",
        method: "POST",
      }),
      invalidatesTags: [
        { type: "Shifts", id: "LIST" },
        { type: "Shifts", id: "ACTIVE" },
        { type: "Shifts", id: "WEEKLY_HOURS" },
        { type: "Shifts", id: "WORKED_HOURS" },
        { type: "Shifts", id: "ALL_WORKED_HOURS" },
        "Dashboard",
        "ActivityLogs",
      ],
    }),
    getActiveShift: builder.query<SuccessResponse<Shift | null>, void>({
      query: () => ({
        url: "/shifts/me/active",
        method: "GET",
      }),
      providesTags: [{ type: "Shifts", id: "ACTIVE" }],
    }),
    getAllActiveShifts: builder.query<SuccessResponse<TotalActiveShifts>, void>({
      query: () => ({
        url: "/shifts/all-active-shifts",
        method: "GET",
      }),
      providesTags: [{ type: "Shifts", id: "All_ACTIVE" }],
    }),
    getWeeklyWorkedHours: builder.query<
      SuccessResponse<ShiftWorkedHours>,
      void
    >({
      query: () => ({
        url: "/shifts/me/weekly-hours",
        method: "GET",
      }),
      providesTags: [{ type: "Shifts", id: "WEEKLY_HOURS" }],
    }),
    getMyWorkedHours: builder.query<
      SuccessResponse<ShiftWorkedHours>,
     void
    >({
      query: () => ({
        url: "/shifts/me/worked-hours",
        method: "GET",
      }),
      providesTags: [{ type: "Shifts", id: "WORKED_HOURS" }],
    }),
    getShifts: builder.query<
      SuccessResponse<PaginatedResponse<Shift>>,
      ShiftQuery
    >({
      query: (params) => ({
        url: "/shifts/me",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map((shift) => ({
                type: "Shifts" as const,
                id: shift.id,
              })),
              { type: "Shifts" as const, id: "LIST" },
            ]
          : [{ type: "Shifts" as const, id: "LIST" }],
    }),
    getShiftById: builder.query<SuccessResponse<Shift>, string>({
      query: (id) => ({
        url: `/shifts/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Shifts", id }],
    }),
    createManualShift: builder.mutation<
      SuccessResponse<Shift>,
      ManualShiftPayload
    >({
      query: (body) => ({
        url: "/shifts/manual",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, body) => [
        { type: "Shifts", id: "LIST" },
        { type: "Shifts", id: "All_ACTIVE" },
        { type: "Shifts", id: `${body.userId}-WORKED_HOURS` },
        { type: "Shifts", id: "ALL_WORKED_HOURS" },
        "Dashboard",
        "ActivityLogs",
      ],
    }),
    deleteShift: builder.mutation<SuccessResponse<null>, string>({
      query: (id) => ({
        url: `/shifts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Shifts", "Dashboard", "ActivityLogs"],
    }),
    getEmployeeWorkedHours: builder.query<
      SuccessResponse<ShiftWorkedHours>,
      { userId: string }
    >({
      query: ({ userId }) => ({
        url: `/shifts/user/${userId}/worked-hours`,
        method: "GET",
      }),
      providesTags: (_result, _error, { userId }) => [
        { type: "Shifts", id: `${userId}-WORKED_HOURS` },
      ],
    }),
    getAllEmployeesWorkedHours: builder.query<
      SuccessResponse<ShiftWorkedHours>,
      void
    >({
      query: () => ({
        url: "/shifts/worked-hours",
        method: "GET",
      }),
      providesTags: [{ type: "Shifts", id: "ALL_WORKED_HOURS" }],
    }),
  }),
});

export const {
  useClockInMutation,
  useClockOutMutation,
  useCreateManualShiftMutation,
  useGetActiveShiftQuery,
  useGetAllActiveShiftsQuery,
  useGetAllEmployeesWorkedHoursQuery,
  useGetEmployeeWorkedHoursQuery,
  useGetMyWorkedHoursQuery,
  useGetShiftByIdQuery,
  useGetShiftsQuery,
  useGetWeeklyWorkedHoursQuery,
  useDeleteShiftMutation,
} = shiftsApi;
