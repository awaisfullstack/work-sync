import { baseApi } from "@/lib/api/baseApi";
import {
  isSuccessResponse,
  type ApiResponse,
  type PaginatedResponse,
} from "@/types/api-response";
import type {
  AssignProjectMemberPayload,
  CreateProjectPayload,
  Project,
  ProjectMember,
  ProjectOption,
  ProjectQuery,
  RemoveProjectMemberPayload,
  UpdateProjectPayload,
} from "./projectTypes";

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
          sortBy: params?.sortBy || undefined,
          sortOrder: params?.sortOrder || undefined,
        },
      }),
      providesTags: (result) =>
        isSuccessResponse(result)
          ? [
              ...result.data.items.map((project) => ({
                type: "Projects" as const,
                id: project.id,
              })),
              { type: "Projects" as const, id: "LIST" },
            ]
          : [{ type: "Projects" as const, id: "LIST" }],
    }),
    getProjectById: builder.query<ApiResponse<Project>, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "Projects" as const, id },
      ],
    }),
    getProjectOptions: builder.query<ApiResponse<ProjectOption[]>, void>({
      query: () => ({
        url: "/projects/options",
        method: "GET",
      }),
      providesTags: (result) =>
        isSuccessResponse(result)
          ? [
              ...result.data.map((project) => ({
                type: "Projects" as const,
                id: project.id,
              })),
              { type: "Projects" as const, id: "LIST" },
            ]
          : [{ type: "Projects" as const, id: "LIST" }],
    }),
    createProject: builder.mutation<ApiResponse<Project>, CreateProjectPayload>(
      {
        query: (body) => ({
          url: "/projects",
          method: "POST",
          body,
        }),
        invalidatesTags: [
          { type: "Projects", id: "LIST" },
          "Dashboard",
          "ActivityLogs",
        ],
      },
    ),
    updateProject: builder.mutation<
      ApiResponse<Project>,
      { id: string; body: UpdateProjectPayload }
    >({
      query: ({ id, body }) => ({
        url: `/projects/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Projects", id },
        { type: "Projects", id: "LIST" },
        "Dashboard",
        "ActivityLogs",
      ],
    }),
    archiveProject: builder.mutation<ApiResponse<Project>, string>({
      query: (id) => ({
        url: `/projects/${id}/archive`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Projects", id },
        { type: "Projects", id: "LIST" },
        "Dashboard",
        "ActivityLogs",
      ],
    }),
    assignProjectMember: builder.mutation<
      ApiResponse<ProjectMember>,
      AssignProjectMemberPayload
    >({
      query: ({ projectId, userId, roleInProject }) => ({
        url: `/projects/${projectId}/members`,
        method: "POST",
        body: { userId, roleInProject },
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: "Projects", id: projectId },
        { type: "Projects", id: "LIST" },
        "ActivityLogs",
      ],
    }),
    getProjectMembers: builder.query<ApiResponse<ProjectMember[]>, string>({
      query: (id) => ({
        url: `/projects/${id}/members`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "Projects" as const, id },
      ],
    }),
    removeProjectMember: builder.mutation<
      ApiResponse<Project>,
      RemoveProjectMemberPayload
    >({
      query: ({ projectId, userId }) => ({
        url: `/projects/${projectId}/members/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: "Projects", id: projectId },
        { type: "Projects", id: "LIST" },
        "ActivityLogs",
      ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useGetProjectOptionsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useArchiveProjectMutation,
  useAssignProjectMemberMutation,
  useGetProjectMembersQuery,
  useRemoveProjectMemberMutation,
} = projectsApi;
