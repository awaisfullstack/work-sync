import { baseApi } from "@/store/api/baseApi";
import type { SuccessResponse, PaginatedResponse } from "@/types/api-response";
import type { ActivityLog, ActivityLogsQuery } from "@/types/activity-log.types";

export const activityLogsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivityLogs: builder.query<
      SuccessResponse<PaginatedResponse<ActivityLog>>,
      ActivityLogsQuery
    >({
      query: (params) => ({
        url: "/activity-logs",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
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

