export type MessageType = string | string[];

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface BaseResponse {
  success: boolean;
  message: MessageType;
  statusCode: number;
}

export interface SuccessResponse<T = unknown> extends BaseResponse {
  success: true;
  data: T;
}

export interface ErrorResponse extends BaseResponse {
  success: false;
  path?: string;
  method?: string;
  timestamp: string;
}

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

export function isSuccessResponse<T>(
  response: ApiResponse<T> | null | undefined,
): response is SuccessResponse<T> {
  return response?.success === true;
}

export function isErrorResponse(
  response: unknown,
): response is ErrorResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    response.success === false
  );
}
