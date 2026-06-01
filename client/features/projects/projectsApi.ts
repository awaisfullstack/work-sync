import { baseApi } from "@/lib/api/baseApi";
import type { ApiResponse, PaginatedResponse } from "@/types/api-response";
import type { Project, ProjectQuery } from "./projectTypes";

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<
      ApiResponse<PaginatedResponse<Project>>,
      ProjectQuery | void
    >({
      query: (params) => ({
        url: "/projects",
        method: "GET",
        params: {
          page: params?.page,
          limit: params?.limit,
          search: params?.search || undefined,
          status: params?.status || undefined,
        },
      }),
      providesTags: ["Projects"],
    }),
  }),
});

export const { useGetProjectsQuery } = projectsApi;
