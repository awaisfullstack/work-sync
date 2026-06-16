"use client";

import Link from "next/link";
import { ArrowLeft, Archive, Pencil } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { canEditProject } from "@/lib/auth/permissions";

import {
  useArchiveProjectMutation,
  useGetProjectByIdQuery,
} from "@/store/api/projectsApi";
import { ProjectDetailsCard } from "./ProjectDetailsCard";
import { ProjectMembersManager } from "./ProjectMembersManager";
import { formatApiError } from "@/lib/utils/formatError";
import FetchByIdError from "@/components/common/FetchByIdError";
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

  const project = data?.data;

  async function handleArchive() {
    if (!project) return;

    try {
      await archiveProject(project.id).unwrap();
      toast.success("Project archived successfully");
    } catch (error) {
      toast.error(formatApiError(error));
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isArchiving}>
                    <Archive className="mr-2 h-4 w-4" />
                    {isArchiving ? "Archiving..." : "Archive"}
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Archive project?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {`This will archive "${project.title}" and move it out of active project work.`}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      disabled={isArchiving}
                      onClick={handleArchive}
                      className="bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20"
                    >
                      Archive
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}
      </div>

      <ProjectDetailsCard project={project} />

      <ProjectMembersManager project={project} />
    </section>
  );
}
