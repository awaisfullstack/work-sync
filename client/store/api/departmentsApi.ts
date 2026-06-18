import { baseApi } from "@/store/api/baseApi";
import type { SuccessResponse } from "@/types/api-response";
import type {
  CreateDepartmentRequest,
  Department,
  UpdateDepartmentRequest,
} from "@/types/department.types";

export const departmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDepartment: builder.query<SuccessResponse<Department[]>, void>({
      query: () => ({
        url: "/departments",
        method: "GET",
      }),
      providesTags: ["Departments"],
    }),

    getDepartmentById: builder.query<SuccessResponse<Department>, string>({
      query: (id) => ({
        url: `/departments/${id}`,
        method: "GET",
      }),
      providesTags: ["Departments"],
    }),

    createDepartment: builder.mutation<
      SuccessResponse<null>,
      CreateDepartmentRequest
    >({
      query: (body) => ({
        url: "/departments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Departments", "Users", "Dashboard", "ActivityLogs"],
    }),

    updateDepartment: builder.mutation<
      SuccessResponse<null>,
      UpdateDepartmentRequest
    >({
      query: ({ id, body }) => ({
        url: `/departments/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Departments", "Users", "Dashboard", "ActivityLogs"],
    }),
  }),
});

export const {
  useGetDepartmentQuery,
  useGetDepartmentByIdQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
} = departmentsApi;
