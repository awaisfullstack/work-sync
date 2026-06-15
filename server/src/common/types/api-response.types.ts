export type MessageType = string | string[];
export interface SuccessResponse<T> {
  success: true;
  statusCode: number;
  message: MessageType;
  data: T;
}

export interface ErrorResponse {
  success: false;
  statusCode: number;
  message: MessageType;
  path?: string;
  method?: string;
  timestamp: string;
  debug?: {
    errorName: string;
    originalErrorMessage?: string;
    stack?: string;
  };
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
