export type MessageType = string | string[];

export interface BaseResponse {
  success: boolean;
  message: MessageType;
  statusCode: number;
  timestamp: string;
}

export interface SuccessResponse<T = unknown> extends BaseResponse {
  success: true;
  data: T;
}

export interface ErrorResponse extends BaseResponse {
  success: false;
  path?: string;
  method?: string;
}

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;
