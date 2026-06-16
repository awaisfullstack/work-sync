import { ProjectStatus } from "@/types/project.types";

export function isProjectStatus(value: string): value is ProjectStatus {
  return ["ACTIVE", "COMPLETED", "ARCHIVED"].includes(value);
}