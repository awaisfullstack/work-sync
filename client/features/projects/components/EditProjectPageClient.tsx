"use client";

import { isSuccessResponse } from "@/types/api-response";
import { useGetProjectByIdQuery } from "../projectsApi";
import { ProjectForm } from "./ProjectForm";
import FetchByIdError from "@/components/shared/FetchByIdError";

interface EditProjectPageClientProps {
  projectId: string;
}

export function EditProjectPageClient({
  projectId,
}: EditProjectPageClientProps) {
  const { data, isLoading, isError } = useGetProjectByIdQuery(projectId);
  const project = isSuccessResponse(data) ? data.data : undefined;

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center text-sm text-slate-500">
        Loading project...
      </div>
    );
  }

  if (isError || !project) {
    return (
      <FetchByIdError
        title="Project not found"
        message="This project does not exist or you do not have permission to access it."
      />
    );
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Edit Project
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Update project details and status.
        </p>
      </div>

      <ProjectForm mode="update" project={project} />
    </section>
  );
}
