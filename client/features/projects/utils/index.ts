import { ProjectStatus } from "../projectTypes";

export function isProjectStatus(value: string): value is ProjectStatus {
  return ["ACTIVE", "COMPLETED", "ARCHIVED"].includes(value);
}