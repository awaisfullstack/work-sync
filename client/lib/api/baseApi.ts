import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
    timeout: 10000,

    /* prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.accessToken;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    }, */
  }),

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
