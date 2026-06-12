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
export interface SuccessResponse<T = unknown> {
  success: true;
  message: MessageType;
  statusCode: number;
  data: T;
}

export interface ErrorResponse {
  success: false;
  message: MessageType;
  statusCode: number;
  path?: string;
  method?: string;
  timestamp: string;
}

export function isErrorResponse(response: unknown): response is ErrorResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    response.success === false
  );
}
