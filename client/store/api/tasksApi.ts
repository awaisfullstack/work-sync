import { baseApi } from "@/store/api/baseApi";
import type { SuccessResponse, PaginatedResponse } from "@/types/api-response";
import {
  CreateTaskPayload,
  AssignTaskPayload,
  Task,
  TaskQuery,
  UpdateTaskStatusPayload,
  TaskComment,
  CreateTaskCommentRequest,
  UpdateTaskRequest,
} from "@/types/task.types";

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<
      SuccessResponse<PaginatedResponse<Task>>,
      TaskQuery
    >({
      query: (params) => ({
        url: "/tasks",
        method: "GET",
        params,
      }),
      providesTags: ["Tasks"],
    }),
    getTaskById: builder.query<SuccessResponse<Task>, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "GET",
      }),
      providesTags: ["Tasks"],
    }),
    createTask: builder.mutation<SuccessResponse<null>, CreateTaskPayload>({
      query: (body) => ({
        url: "/tasks",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tasks", "Dashboard", "ActivityLogs"],
    }),
    updateTask: builder.mutation<SuccessResponse<null>, UpdateTaskRequest>({
      query: ({ id, body }) => ({
        url: `/tasks/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Tasks", "Dashboard", "ActivityLogs"],
    }),
    updateTaskStatus: builder.mutation<
      SuccessResponse<null>,
      UpdateTaskStatusPayload
    >({
      query: ({ id, status }) => ({
        url: `/tasks/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Tasks", "Dashboard", "ActivityLogs"],
    }),
    assignTask: builder.mutation<SuccessResponse<null>, AssignTaskPayload>({
      query: ({ id, userId }) => ({
        url: `/tasks/${id}/assign`,
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: ["Tasks", "Dashboard", "ActivityLogs"],
    }),
    unassignTask: builder.mutation<SuccessResponse<null>, AssignTaskPayload>({
      query: ({ id, userId }) => ({
        url: `/tasks/${id}/unassign/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Tasks", "Dashboard", "ActivityLogs"],
    }),
    deleteTask: builder.mutation<SuccessResponse<null>, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks", "Dashboard", "ActivityLogs"],
    }),
    getTaskComments: builder.query<SuccessResponse<TaskComment[]>, string>({
      query: (taskId) => ({
        url: `/tasks/${taskId}/comments`,
        method: "GET",
      }),
      providesTags: ["Tasks"],
    }),
    addTaskComment: builder.mutation<
      SuccessResponse<null>,
      CreateTaskCommentRequest
    >({
      query: ({ taskId, comment }) => ({
        url: `/tasks/${taskId}/comments`,
        method: "POST",
        body: { comment },
      }),
      invalidatesTags: ["Tasks", "ActivityLogs"],
    }),
    deleteTaskComment: builder.mutation<
      SuccessResponse<null>,
      { taskId: string; commentId: string }
    >({
      query: ({ taskId, commentId }) => ({
        url: `/tasks/${taskId}/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks", "ActivityLogs"],
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
