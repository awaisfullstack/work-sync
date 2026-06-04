import { baseApi } from "@/lib/api/baseApi";
import type { ApiResponse, PaginatedResponse } from "@/types/api-response";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UsersQuery,
  UsersStats,
} from "./userTypes";
import { UserOption } from "../auth/authTypes";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<ApiResponse<PaginatedResponse<User>>, UsersQuery>({
      query: (params) => ({
        url: "/users",
        method: "GET",
        params,
      }),
      providesTags: ["Users"],
    }),
    getUserStats: builder.query<ApiResponse<UsersStats>, void>({
      query: () => ({
        url: "/users/stats",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),

    getUserById: builder.query<ApiResponse<User>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),

    getUserOptions: builder.query<ApiResponse<UserOption[]>, void>({
      query: () => ({
        url: "/users/options",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),

    createUser: builder.mutation<ApiResponse<User>, CreateUserRequest>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users", "Dashboard", "ActivityLogs"],
    }),

    updateUser: builder.mutation<ApiResponse<User>, UpdateUserRequest>({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Users", id },
        "Users",
        "Dashboard",
        "ActivityLogs",
      ],
    }),

    deleteUser: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users", "Dashboard", "ActivityLogs"],
    }),

    activateUser: builder.mutation<
      ApiResponse<{ id: string; isActive: boolean }>,
      string
    >({
      query: (id) => ({
        url: `/users/${id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Users", id },
        "Users",
        "Dashboard",
        "ActivityLogs",
      ],
    }),

    deactivateUser: builder.mutation<
      ApiResponse<{ id: string; isActive: boolean }>,
      string
    >({
      query: (id) => ({
        url: `/users/${id}/deactivate`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Users", id },
        "Users",
        "Dashboard",
        "ActivityLogs",
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserStatsQuery,
  useGetUserByIdQuery,
  useGetUserOptionsQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
} = usersApi;
