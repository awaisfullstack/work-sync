"use client";

import Link from "next/link";
import { ArrowLeft, Archive, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { canEditProject } from "@/lib/auth/permissions";

import {
  useArchiveProjectMutation,
  useGetProjectByIdQuery,
} from "../projectsApi";
import { ProjectDetailsCard } from "./ProjectDetailsCard";
import { ProjectMembersManager } from "./ProjectMembersManager";
import { formatApiError } from "@/lib/utils/formatError";
import { isSuccessResponse } from "@/types/api-response";
import FetchByIdError from "@/components/shared/FetchByIdError";
import ProjectViewSkeleton from "./ProjectViewSkeleton";
// import { ProjectTasksSummary } from "./ProjectTasksSummary";

interface ProjectViewPageClientProps {
  projectId: string;
}

export default function ProjectViewPageClient({
  projectId,
}: ProjectViewPageClientProps) {
  const currentUser = useAppSelector((state) => state.auth.user);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetProjectByIdQuery(projectId, {
      skip: !projectId,
    });

  const [archiveProject, { isLoading: isArchiving }] =
    useArchiveProjectMutation();

  const project = isSuccessResponse(data) ? data.data : undefined;

  async function handleArchive() {
    if (!project) return;

    const confirmed = window.confirm(
      `Are you sure you want to archive "${project.title}"?`,
    );

    if (!confirmed) return;

    try {
      await archiveProject(project.id).unwrap();
    } catch (error) {
      alert(formatApiError(error));
    }
  }

  if (isLoading || isFetching) {
    return <ProjectViewSkeleton />;
  }

  if (isError || !project) {
    return (
      <FetchByIdError
        title="Project not found"
        message="This project does not exist or you do not have permission to access it."
        refetch={refetch}
        backLink="/projects"
        backLinkText="Back to projects"
      />
    );
  }

  const canManage = canEditProject(currentUser);

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to projects</span>
            </Link>
          </Button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Project Details
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View full project information, members, and related work.
            </p>
          </div>
        </div>

        {canManage && (
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href={`/projects/${project.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Project
              </Link>
            </Button>

            {project.status !== "ARCHIVED" && (
              <Button
                variant="destructive"
                disabled={isArchiving}
                onClick={handleArchive}
              >
                <Archive className="mr-2 h-4 w-4" />
                {isArchiving ? "Archiving..." : "Archive"}
              </Button>
            )}
          </div>
        )}
      </div>

      <ProjectDetailsCard project={project} />

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        {/* <ProjectTasksSummary project={project} /> */}

        <ProjectMembersManager project={project} />
      </div>
    </section>
  );
}
