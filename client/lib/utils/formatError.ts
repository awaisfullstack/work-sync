import { isErrorResponse } from "@/types/api-response";

export function formatApiError(error: unknown): string {
  
  if (isErrorResponse(error)) {
    return Array.isArray(error.message)
      ? error.message.join(", ")
      : error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error
  ) {
    const apiError = error as { data?: unknown };

    if (isErrorResponse(apiError.data)) {
      return Array.isArray(apiError.data.message)
        ? apiError.data.message.join(", ")
        : apiError.data.message;
    }

    if (
      typeof apiError.data === "object" &&
      apiError.data !== null &&
      "message" in apiError.data
    ) {
      const message = apiError.data.message;

      if (Array.isArray(message)) {
        return message.join(", ");
      }

      if (typeof message === "string") {
        return message;
      }
    }
  }

  return "Something went wrong. Please try again.";
}
