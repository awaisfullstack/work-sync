import { Badge } from "@/components/ui/badge";
import { ProjectStatus } from "@/types/project.types";

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
}

const statusClasses: Record<ProjectStatus, string> = {
  ACTIVE: "border-green-200 bg-green-50 text-green-700 hover:bg-green-50",
  COMPLETED: "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-50",
  ARCHIVED: "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-100",
};

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  return (
    <Badge variant="outline" className={statusClasses[status]}>
      {status}
    </Badge>
  );
}