import { baseApi } from "@/store/api/baseApi";
import type {
  AuthResponseData,
  AuthUser,
  LoginRequest,
} from "@/types/auth.types";
import type { SuccessResponse } from "@/types/api-response";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<SuccessResponse<AuthResponseData>, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    getMe: builder.query<SuccessResponse<AuthUser>, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    logout: builder.mutation<SuccessResponse<null>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery, useLogoutMutation } = authApi;
