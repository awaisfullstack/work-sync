import { ErrorResponse } from "@/types/api-response";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function formatApiError(error: unknown): string {
  if (typeof error === "object" && error !== null && "data" in error) {
    const apiError = error as FetchBaseQueryError;

    const data = apiError.data as ErrorResponse;
    const { message } = data;
    if (Array.isArray(message)) {
      return message.join(", ");
    }

    if (typeof message === "string") {
      return message;
    }
  }

  return "Something went wrong. Please try again.";
}
