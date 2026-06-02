import { baseApi } from "@/lib/api/baseApi";
import { UserRole } from "../auth/authTypes";
import type { ApiResponse, PaginatedResponse } from "@/types/api-response";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId?: string | null;
  department?: {
    id: string;
    name: string;
  } | null;
}

export interface GetUsersQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole | "";
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<ApiResponse<PaginatedResponse<User>>, GetUsersQuery>({
      query: (params) => ({
        url: "/users",
        method: "GET",
        params: {
          page: params.page ?? 1,
          limit: params.limit ?? 100,
          search: params.search || undefined,
          role: params.role || undefined,
        },
      }),
      providesTags: ["Users"],
    }),
  }),
});

export const { useGetUsersQuery } = usersApi;
