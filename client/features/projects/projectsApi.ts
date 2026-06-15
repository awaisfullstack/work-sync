import { baseApi } from "@/lib/api/baseApi";
import type { SuccessResponse, PaginatedResponse } from "@/types/api-response";
import type {
  AssignProjectMemberPayload,
  CreateProjectPayload,
  Project,
  ProjectMember,
  ProjectOption,
  ProjectQuery,
  RemoveProjectMemberPayload,
  UpdateProjectRequest,
} from "./projectTypes";

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<
      SuccessResponse<PaginatedResponse<Project>>,
      ProjectQuery
    >({
      query: (params) => ({
        url: "/projects",
        method: "GET",
        params
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map((project) => ({
                type: "Projects" as const,
                id: project.id,
              })),
              { type: "Projects" as const, id: "LIST" },
            ]
          : [{ type: "Projects" as const, id: "LIST" }],
    }),
    getProjectById: builder.query<SuccessResponse<Project>, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "Projects" as const, id },
      ],
    }),
    getProjectOptions: builder.query<SuccessResponse<ProjectOption[]>, void>({
      query: () => ({
        url: "/projects/options",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((project) => ({
                type: "Projects" as const,
                id: project.id,
              })),
              { type: "Projects" as const, id: "LIST" },
            ]
          : [{ type: "Projects" as const, id: "LIST" }],
    }),
    createProject: builder.mutation<
      SuccessResponse<Project>,
      CreateProjectPayload
    >({
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
    }),
    updateProject: builder.mutation<
      SuccessResponse<Project>,
      UpdateProjectRequest
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
    archiveProject: builder.mutation<SuccessResponse<Project>, string>({
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
      SuccessResponse<ProjectMember>,
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
    removeProjectMember: builder.mutation<
      SuccessResponse<Project>,
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
  useRemoveProjectMemberMutation,
} = projectsApi;
