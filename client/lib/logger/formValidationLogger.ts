"use client";

import type { FieldErrors, FieldValues } from "react-hook-form";

import { logFrontendValidationIssue } from "./frontendLogger";

function getValidationMessages<T extends FieldValues>(errors: FieldErrors<T>) {
  return Object.fromEntries(
    Object.entries(errors).map(([field, error]) => [
      field,
      error?.message ?? "Invalid value",
    ]),
  );
}

export function logFormValidationIssue<T extends FieldValues>(
  formName: string,
  errors: FieldErrors<T>,
  source: string,
) {
  return logFrontendValidationIssue(`${formName} form validation issue`, {
    source,
    metadata: {
      fields: Object.keys(errors),
      errors: getValidationMessages(errors),
    },
  });
}
