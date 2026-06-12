import { baseApi } from "@/lib/api/baseApi";
import type { SuccessResponse } from "@/types/api-response";
import type {
  CreateDepartmentRequest,
  Department,
  UpdateDepartmentRequest,
} from "./departmentTypes";

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
      providesTags: (_result, _error, id) => [{ type: "Departments", id }],
    }),

    createDepartment: builder.mutation<
      SuccessResponse<Department>,
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
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Departments", id },
        "Departments",
        "Users",
        "Dashboard",
        "ActivityLogs",
      ],
    }),
  }),
});

export const {
  useGetDepartmentQuery,
  useGetDepartmentByIdQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
} = departmentsApi;

