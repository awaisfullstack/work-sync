import { baseApi } from "@/lib/api/baseApi";
import {
  isSuccessResponse,
  type ApiResponse,
  type PaginatedResponse,
} from "@/types/api-response";
import type { ActivityLog, ActivityLogsQuery } from "./activityLogTypes";

export const activityLogsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivityLogs: builder.query<
      ApiResponse<PaginatedResponse<ActivityLog>>,
      ActivityLogsQuery
    >({
      query: (params) => ({
        url: "/activity-logs",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        isSuccessResponse(result)
          ? [
              ...result.data.items.map((log) => ({
                type: "ActivityLogs" as const,
                id: log.id,
              })),
              "ActivityLogs",
            ]
          : ["ActivityLogs"],
    }),
  }),
});

export const { useGetActivityLogsQuery } = activityLogsApi;
