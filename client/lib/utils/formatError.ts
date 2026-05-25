// src/lib/utils/formatApiError.ts

export function formatApiError(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error
  ) {
    const apiError = error as {
      data?: {
        message?: string | string[];
      };
    };

    if (Array.isArray(apiError.data?.message)) {
      return apiError.data.message.join(", ");
    }

    if (typeof apiError.data?.message === "string") {
      return apiError.data.message;
    }
  }

  return "Something went wrong. Please try again.";
}