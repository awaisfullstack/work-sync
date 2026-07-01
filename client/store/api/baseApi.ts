import { logout } from "@/store/slices/authSlice";
import { getCookie } from "cookies-next";
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  timeout: 10000,
});

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  if (typeof window !== "undefined") {
    const accessToken = getCookie("access_token") as string | undefined;

    if (accessToken) {
      const request: FetchArgs =
        typeof args === "string"
          ? { url: args, headers: { Authorization: `Bearer ${accessToken}` } }
          : {
              ...args,
              headers: {
                ...(args.headers ?? {}),
                Authorization: `Bearer ${accessToken}`,
              },
            };

      args = request;
    }
  }

  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    api.dispatch(logout());

    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      window.location.replace("/login");
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",

  baseQuery: baseQueryWithAuth,

  tagTypes: [
    "Auth",
    "Users",
    "Departments",
    "Projects",
    "Tasks",
    "Shifts",
    "Dashboard",
    "ActivityLogs",
  ],

  endpoints: () => ({}),
});
