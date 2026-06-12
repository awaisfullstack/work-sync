import { baseApi } from "@/lib/api/baseApi";
import type { PaginatedResponse, SuccessResponse } from "@/types/api-response";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserOption,
  UsersQuery,
  UsersStats,
} from "./userTypes";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<SuccessResponse<PaginatedResponse<User>>, UsersQuery>({
      query: (params) => ({
        url: "/users",
        method: "GET",
        params,
      }),
      providesTags: ["Users"],
    }),
    getUserStats: builder.query<SuccessResponse<UsersStats>, void>({
      query: () => ({
        url: "/users/stats",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),

    getUserById: builder.query<SuccessResponse<User>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),

    getUserOptions: builder.query<SuccessResponse<UserOption[]>, void>({
      query: () => ({
        url: "/users/options",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),

    createUser: builder.mutation<SuccessResponse<User>, CreateUserRequest>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users", "Dashboard", "ActivityLogs"],
    }),

    updateUser: builder.mutation<SuccessResponse<null>, UpdateUserRequest>({
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

    deleteUser: builder.mutation<SuccessResponse<null>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users", "Dashboard", "ActivityLogs"],
    }),

    activateUser: builder.mutation<
      SuccessResponse<null>,
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
      SuccessResponse<null>,
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
