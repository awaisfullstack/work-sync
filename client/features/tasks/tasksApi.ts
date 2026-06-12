import { baseApi } from "@/lib/api/baseApi";
import type { SuccessResponse, PaginatedResponse } from "@/types/api-response";
import {
  CreateTaskPayload,
  AssignTaskPayload,
  Task,
  TaskQuery,
  UpdateTaskStatusPayload,
  UpdateTaskPayload,
  TaskComment,
  CreateTaskCommentRequest,
} from "./taskTypes";

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<
      SuccessResponse<PaginatedResponse<Task>>,
      TaskQuery | void
    >({
      query: (params) => ({
        url: "/tasks",
        method: "GET",
        params: {
          page: params?.page,
          limit: params?.limit,
          search: params?.search || undefined,
          projectId: params?.projectId || undefined,
          status: params?.status || undefined,
          sortBy: params?.sortBy || undefined,
          sortOrder: params?.sortOrder || undefined,
          fromDate: params?.startDate || undefined,
          toDate: params?.endDate || undefined,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map((task) => ({
                type: "Tasks" as const,
                id: task.id,
              })),
              { type: "Tasks" as const, id: "LIST" },
            ]
          : [{ type: "Tasks" as const, id: "LIST" }],
    }),
    getTaskById: builder.query<SuccessResponse<Task>, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Tasks" as const, id }],
    }),
    createTask: builder.mutation<SuccessResponse<Task>, CreateTaskPayload>({
      query: (body) => ({
        url: "/tasks",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Tasks", id: "LIST" },
        "Dashboard",
        "ActivityLogs",
      ],
    }),
    updateTask: builder.mutation<
      SuccessResponse<Task>,
      { id: string; body: UpdateTaskPayload }
    >({
      query: ({ id, body }) => ({
        url: `/tasks/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Tasks", id },
        { type: "Tasks", id: "LIST" },
        "Dashboard",
        "ActivityLogs",
      ],
    }),
    updateTaskStatus: builder.mutation<
      SuccessResponse<Task>,
      UpdateTaskStatusPayload
    >({
      query: ({ id, status }) => ({
        url: `/tasks/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Tasks", id },
        { type: "Tasks", id: "LIST" },
        "Dashboard",
        "ActivityLogs",
      ],
    }),
    assignTask: builder.mutation<SuccessResponse<Task>, AssignTaskPayload>({
      query: ({ id, userId }) => ({
        url: `/tasks/${id}/assign`,
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Tasks", id },
        { type: "Tasks", id: "LIST" },
        "Dashboard",
        "ActivityLogs",
      ],
    }),
    unassignTask: builder.mutation<SuccessResponse<Task>, AssignTaskPayload>({
      query: ({ id, userId }) => ({
        url: `/tasks/${id}/unassign/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Tasks", id },
        { type: "Tasks", id: "LIST" },
        "Dashboard",
        "ActivityLogs",
      ],
    }),
    deleteTask: builder.mutation<SuccessResponse, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Tasks" as const, id },
        { type: "Tasks" as const, id: "LIST" },
      ],
    }),
    getTaskComments: builder.query<SuccessResponse<TaskComment[]>, string>({
      query: (taskId) => ({
        url: `/tasks/${taskId}/comments`,
        method: "GET",
      }),
      providesTags: (_result, _error, taskId) => [
        { type: "Tasks", id: `${taskId}-comments` },
      ],
    }),
    addTaskComment: builder.mutation<
      SuccessResponse<TaskComment>,
      CreateTaskCommentRequest
    >({
      query: ({ taskId, comment }) => ({
        url: `/tasks/${taskId}/comments`,
        method: "POST",
        body: { comment },
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Tasks", id: `${taskId}-comments` },
        { type: "Tasks", id: taskId },
        "ActivityLogs",
      ],
    }),
    deleteTaskComment: builder.mutation<
      SuccessResponse<null>,
      { taskId: string; commentId: string }
    >({
      query: ({ taskId, commentId }) => ({
        url: `/tasks/${taskId}/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Tasks", id: `${taskId}-comments` },
        { type: "Tasks", id: taskId },
        "ActivityLogs",
      ],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useAssignTaskMutation,
  useUnassignTaskMutation,
  useDeleteTaskMutation,
  useGetTaskCommentsQuery,
  useAddTaskCommentMutation,
  useDeleteTaskCommentMutation,
} = tasksApi;

