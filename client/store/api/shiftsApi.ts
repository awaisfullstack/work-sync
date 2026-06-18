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
    clockIn: builder.mutation<SuccessResponse<null>, void>({
      query: () => ({
        url: "/shifts/clock-in",
        method: "POST",
      }),
      invalidatesTags: ["Shifts", "Dashboard", "ActivityLogs"],
    }),
    clockOut: builder.mutation<SuccessResponse<null>, void>({
      query: () => ({
        url: "/shifts/clock-out",
        method: "POST",
      }),
      invalidatesTags: ["Shifts", "Dashboard", "ActivityLogs"],
    }),
    getActiveShift: builder.query<SuccessResponse<Shift | null>, void>({
      query: () => ({
        url: "/shifts/me/active",
        method: "GET",
      }),
      providesTags: ["Shifts"],
    }),
    getAllActiveShifts: builder.query<SuccessResponse<TotalActiveShifts>, void>({
      query: () => ({
        url: "/shifts/all-active-shifts",
        method: "GET",
      }),
      providesTags: ["Shifts"],
    }),
    getWeeklyWorkedHours: builder.query<
      SuccessResponse<ShiftWorkedHours>,
      void
    >({
      query: () => ({
        url: "/shifts/me/weekly-hours",
        method: "GET",
      }),
      providesTags: ["Shifts"],
    }),
    getMyWorkedHours: builder.query<
      SuccessResponse<ShiftWorkedHours>,
      void
    >({
      query: () => ({
        url: "/shifts/me/worked-hours",
        method: "GET",
      }),
      providesTags: ["Shifts"],
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
      providesTags: ["Shifts"],
    }),
    getShiftById: builder.query<SuccessResponse<Shift>, string>({
      query: (id) => ({
        url: `/shifts/${id}`,
        method: "GET",
      }),
      providesTags: ["Shifts"],
    }),
    createManualShift: builder.mutation<
      SuccessResponse<null>,
      ManualShiftPayload
    >({
      query: (body) => ({
        url: "/shifts/manual",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Shifts", "Dashboard", "ActivityLogs"],
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
      providesTags: ["Shifts"],
    }),
    getAllEmployeesWorkedHours: builder.query<
      SuccessResponse<ShiftWorkedHours>,
      void
    >({
      query: () => ({
        url: "/shifts/worked-hours",
        method: "GET",
      }),
      providesTags: ["Shifts"],
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
