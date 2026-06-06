import { baseApi } from "@/lib/api/baseApi";
import {
  isSuccessResponse,
  type ApiResponse,
  type PaginatedResponse,
} from "@/types/api-response";
import type {
  ManualShiftPayload,
  Shift,
  ShiftQuery,
  ShiftWorkedHours,
} from "./shiftTypes";

export const shiftsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    clockIn: builder.mutation<ApiResponse<Shift>, void>({
      query: () => ({
        url: "/shifts/clock-in",
        method: "POST",
      }),
      invalidatesTags: [
        { type: "Shifts", id: "LIST" },
        { type: "Shifts", id: "ACTIVE" },
        { type: "Shifts", id: "WEEKLY_HOURS" },
        { type: "Shifts", id: "WORKED_HOURS" },
        "Dashboard",
        "ActivityLogs",
      ],
    }),
    clockOut: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: "/shifts/clock-out",
        method: "POST",
      }),
      invalidatesTags: [
        { type: "Shifts", id: "LIST" },
        { type: "Shifts", id: "ACTIVE" },
        { type: "Shifts", id: "WEEKLY_HOURS" },
        { type: "Shifts", id: "WORKED_HOURS" },
        "Dashboard",
        "ActivityLogs",
      ],
    }),
    getActiveShift: builder.query<ApiResponse<Shift | null>, void>({
      query: () => ({
        url: "/shifts/me/active",
        method: "GET",
      }),
      providesTags: [{ type: "Shifts", id: "ACTIVE" }],
    }),
    getWeeklyWorkedHours: builder.query<ApiResponse<ShiftWorkedHours>, void>({
      query: () => ({
        url: "/shifts/me/weekly-hours",
        method: "GET",
      }),
      providesTags: [{ type: "Shifts", id: "WEEKLY_HOURS" }],
    }),
    getMyWorkedHours: builder.query<
      ApiResponse<ShiftWorkedHours>,
      { fromDate?: string; toDate?: string }
    >({
      query: (params) => ({
        url: "/shifts/me/worked-hours",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "Shifts", id: "WORKED_HOURS" }],
    }),
    getShifts: builder.query<ApiResponse<PaginatedResponse<Shift>>, ShiftQuery>(
      {
        query: (params) => ({
          url: "/shifts/me",
          method: "GET",
          params,
        }),
        providesTags: (result) =>
          isSuccessResponse(result)
            ? [
                ...result.data.items.map((shift) => ({
                  type: "Shifts" as const,
                  id: shift.id,
                })),
                { type: "Shifts" as const, id: "LIST" },
              ]
            : [{ type: "Shifts" as const, id: "LIST" }],
      },
    ),
    getShiftById: builder.query<ApiResponse<Shift>, string>({
      query: (id) => ({
        url: `/shifts/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Shifts", id }],
    }),
    createManualShift: builder.mutation<ApiResponse<Shift>, ManualShiftPayload>(
      {
        query: (body) => ({
          url: "/shifts/manual",
          method: "POST",
          body,
        }),
        invalidatesTags: (_result, _error, body) => [
          { type: "Shifts", id: "LIST" },
          { type: "Shifts", id: `${body.userId}-WORKED_HOURS` },
          "Dashboard",
          "ActivityLogs",
        ],
      },
    ),
    getEmployeeWorkedHours: builder.query<
      ApiResponse<ShiftWorkedHours>,
      { userId: string; fromDate?: string; toDate?: string }
    >({
      query: ({ userId, fromDate, toDate }) => ({
        url: `/shifts/user/${userId}/worked-hours`,
        method: "GET",
        params: { fromDate, toDate },
      }),
      providesTags: (_result, _error, { userId }) => [
        { type: "Shifts", id: `${userId}-WORKED_HOURS` },
      ],
    }),
  }),
});

export const {
  useClockInMutation,
  useClockOutMutation,
  useCreateManualShiftMutation,
  useGetActiveShiftQuery,
  useGetEmployeeWorkedHoursQuery,
  useGetMyWorkedHoursQuery,
  useGetShiftByIdQuery,
  useGetShiftsQuery,
  useGetWeeklyWorkedHoursQuery,
} = shiftsApi;
