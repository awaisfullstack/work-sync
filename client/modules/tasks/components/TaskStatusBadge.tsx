import { Badge } from "@/components/ui/badge";
import { TaskStatus } from "@/types/task.types";

interface TaskStatusBadgeProps {
  status: TaskStatus;
}

const statusClasses: Record<TaskStatus, string> = {
  COMPLETED:
    "border-green-200 bg-green-50 text-green-700 hover:bg-green-50",
  IN_PROGRESS: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50",
  TODO: "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-50",
};

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  return (
    <Badge variant="outline" className={statusClasses[status]}>
      {status}
    </Badge>
  );
}
