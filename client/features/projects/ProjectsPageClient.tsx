"use client";

import { columns } from "@/app/(dashboard)/projects/columns";
import { DataTable } from "@/app/(dashboard)/projects/data-table";
import { formatApiError } from "@/lib/utils/formatError";
import { isSuccessResponse } from "@/types/api-response";
import { useGetProjectsQuery } from "./projectsApi";
import type { ProjectStatus } from "./projectTypes";

const ProjectsPageClient = () => {
  const page = 1;
  const limit = 10;
  const search = "";
  const status: ProjectStatus | "" = "";

  const { data, error, isLoading, isFetching } = useGetProjectsQuery({
    page,
    limit,
    search,
    status,
  });

  if (isLoading || isFetching) {
    return (
      <div className="py-8 text-sm text-muted-foreground">
        Loading projects...
      </div>
    );
  }

  if (!isSuccessResponse(data)) {
    return (
      <div className="py-8 text-sm text-destructive">
        {formatApiError(error ?? { data })}
      </div>
    );
  }

  return <DataTable columns={columns} data={data.data.items} />;
};

export default ProjectsPageClient;
