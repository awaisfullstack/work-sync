import { baseApi } from "@/lib/api/baseApi";
import type { SuccessResponse } from "@/types/api-response";
import type { DashboardData } from "./dashboardTypes";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<SuccessResponse<DashboardData>, void>({
      query: () => ({
        url: "/dashboard",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApi;

