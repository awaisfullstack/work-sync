import { CalendarDays, Clock, UserRound } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { formatProjectDate, getDeadlineStatus } from "../utils";
import { Project } from "../projectTypes";

interface ProjectDetailsCardProps {
  project: Project;
}

export function ProjectDetailsCard({ project }: ProjectDetailsCardProps) {
  const deadlineStatus = getDeadlineStatus(project.deadline);

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <CardTitle className="text-2xl">{project.title}</CardTitle>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              {project.description}
            </p>
          </div>

          <ProjectStatusBadge status={project.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Separator />

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <CalendarDays className="h-4 w-4" />
              Deadline
            </div>

            <p className="mt-2 text-lg font-semibold text-slate-900">
              {formatProjectDate(project.deadline)}
            </p>

            <p
              className={
                deadlineStatus.variant === "danger"
                  ? "mt-1 text-sm text-red-600"
                  : deadlineStatus.variant === "warning"
                    ? "mt-1 text-sm text-amber-600"
                    : "mt-1 text-sm text-slate-500"
              }
            >
              {deadlineStatus.label}
            </p>
          </div>

          <div className="rounded-xl border bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <UserRound className="h-4 w-4" />
              Created By
            </div>

            <p className="mt-2 text-lg font-semibold text-slate-900">
              {project.createdBy.name ?? "Unknown"}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {project.createdBy.email ?? "No email available"}
            </p>
          </div>

          <div className="rounded-xl border bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Clock className="h-4 w-4" />
              Last Updated
            </div>

            <p className="mt-2 text-lg font-semibold text-slate-900">
              {formatProjectDate(project.updatedAt)}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Created {formatProjectDate(project.createdAt)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}