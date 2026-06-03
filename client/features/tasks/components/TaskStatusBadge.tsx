import { Badge } from "@/components/ui/badge";
import { TaskStatus } from "../taskTypes";

interface TaskStatusBadgeProps {
  status: TaskStatus;
}

const statusClasses: Record<TaskStatus, string> = {
  COMPLETED:
    "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-50",
  IN_PROGRESS: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50",
  TODO: "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-50",
};

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  return (
    <Badge variant="outline" className={statusClasses[status]}>
      {status}
    </Badge>
  );
}
