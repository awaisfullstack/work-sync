import { baseApi } from "@/store/api/baseApi";
import type { SuccessResponse, PaginatedResponse } from "@/types/api-response";
import type {
  AssignProjectMemberPayload,
  CreateProjectPayload,
  Project,
  ProjectOption,
  ProjectQuery,
  RemoveProjectMemberPayload,
  UpdateProjectRequest,
} from "@/types/project.types";

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<
      SuccessResponse<PaginatedResponse<Project>>,
      ProjectQuery
    >({
      query: (params) => ({
        url: "/projects",
        method: "GET",
        params,
      }),
      providesTags: ["Projects"],
    }),
    getProjectById: builder.query<SuccessResponse<Project>, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "GET",
      }),
      providesTags: ["Projects"],
    }),
    getProjectOptions: builder.query<SuccessResponse<ProjectOption[]>, void>({
      query: () => ({
        url: "/projects/options",
        method: "GET",
      }),
      providesTags: ["Projects"],
    }),
    createProject: builder.mutation<
      SuccessResponse<null>,
      CreateProjectPayload
    >({
      query: (body) => ({
        url: "/projects",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Projects", "Dashboard", "ActivityLogs"],
    }),
    updateProject: builder.mutation<
      SuccessResponse<null>,
      UpdateProjectRequest
    >({
      query: ({ id, body }) => ({
        url: `/projects/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Projects", "Dashboard", "ActivityLogs"],
    }),
    archiveProject: builder.mutation<SuccessResponse<null>, string>({
      query: (id) => ({
        url: `/projects/${id}/archive`,
        method: "PATCH",
      }),
      invalidatesTags: ["Projects", "Dashboard", "ActivityLogs"],
    }),
    assignProjectMember: builder.mutation<
      SuccessResponse<null>,
      AssignProjectMemberPayload
    >({
      query: ({ projectId, userId, roleInProject }) => ({
        url: `/projects/${projectId}/members`,
        method: "POST",
        body: { userId, roleInProject },
      }),
      invalidatesTags: ["Projects", "Dashboard", "ActivityLogs"],
    }),
    removeProjectMember: builder.mutation<
      SuccessResponse<null>,
      RemoveProjectMemberPayload
    >({
      query: ({ projectId, userId }) => ({
        url: `/projects/${projectId}/members/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects", "Dashboard", "ActivityLogs"],
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
